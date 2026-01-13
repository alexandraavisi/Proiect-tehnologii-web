import {
    Bug, 
    BugAssignment, 
    Project, 
    ProjectMember, 
    User, 
    Activity
} from '../models/associations.js';
import { catchAsync } from '../middleware/errorHandler.middleware.js';
import { ErrorFactory } from '../middleware/errorHandler.middleware.js';

const logActivity = async (projectId, userId, type, message, bugId = null) => {
    try{
        await Activity.create({
            projectId,
            userId,
            bugId,
            type,
            message
        });
    }catch(error){
        console.error('Failed to log activity:', error);
    }
};

export const createBug= catchAsync(async (req, res)=>{
    const {projectId, title, description, severity, priority, githubCommitUrl} = req.body;
    const userId = req.user.id;
    
    const membership = await ProjectMember.findOne({
        where:{
            projectId,
            userId
        }
    });

    if(!membership){
        throw ErrorFactory.forbidden('You must be a project member to report bugs');
    }

    const bug= await Bug.create({
        projectId,
        reporterId: membership.id,
        title,
        description,
        severity,
        priority,
        status: 'REPORTED',
        githubCommitUrl: githubCommitUrl || null
    });

    await logActivity(
        projectId,
        userId,
        'BUG_REPORTED',
        `${req.user.name} reported bug: ${title}`,
        bug.id
    );

    const bugWithReporter = await Bug.findByPk(bug.id, {
        include:[
            {
                model: ProjectMember,
                as: 'reporter',
                include:[
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'name','email']
                    }
                ]
            }
        ]
    });

    res.status(201).json({
        success: true,
        message: 'Bug reported successfully',
        bug: bugWithReporter
    });
});

export const getAllBugs = catchAsync(async (req, res) => {
  const { projectId } = req.query;
  const userId = req.user.id;

  const whereClause = {};
  
  if (projectId) {
    whereClause.projectId = projectId;
  }

  const bugs = await Bug.findAll({
    where: whereClause,
    include: [
      {
        model: ProjectMember,
        as: 'reporter',
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email']
          }
        ]
      },
      {
        model: ProjectMember,
        as: 'assignee',
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email']
          }
        ]
      },
      {
        model: Project,
        as: 'project',
        attributes: ['id', 'name', 'isPublic'],
        include: [
          {
            model: ProjectMember,
            as: 'members',
            where: { userId },
            required: false
          }
        ]
      }
    ],
    order: [['createdAt', 'DESC']]
  });

  const accessibleBugs = bugs.filter(bug => {
    if (!bug.project) return false;
    
    const isMember = bug.project.members && bug.project.members.length > 0;
    const isPublicProject = bug.project.isPublic;
    
    return isMember || isPublicProject;
  });

  res.json({
    success: true,
    count: accessibleBugs.length,
    bugs: accessibleBugs
  });
});

export const getBugById = catchAsync( async (req,res)=>{
    const {id} =req.params;
    const userId= req.user.id;

    const bug = await Bug.findByPk(id,{
        include: [
        {
            model: ProjectMember,
            as: 'reporter',
            include: [
            {
                model: User,
                as: 'user',
                attributes: ['id', 'name', 'email']
            }
            ]
        },
        {
            model: ProjectMember,
            as: 'assignee',
            include: [
            {
                model: User,
                as: 'user',
                attributes: ['id', 'name', 'email']
            }
            ]
        },
        {
            model: Project,
            as: 'project',
            attributes: ['id', 'name', 'description', 'isPublic', 'creatorId'],
            include: [
            {
                model: ProjectMember,
                as: 'members',
                include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email']
                }
                ]
            }
            ]
        }
        ]
    });

    if(!bug){
        throw ErrorFactory.notFound('Bug not found');
    }

    const membership = await ProjectMember.findOne({
        where: {
            projectId: bug.projectId,
            userId: userId
        }
    });

    const bugData = bug.toJSON();

    if (bugData.project && membership) {
        bugData.project.membership = {
        id: membership.id,
        role: membership.role,
        isCreator: membership.isCreator,
        joinedAt: membership.joinedAt
        };
    } else if (bugData.project) {
        bugData.project.membership = null;
    }

    res.json({
        success: true,
        bug
    });
});

export const updateBug = catchAsync( async (req,res)=>{
    const {id} = req.params;
    const {title, description, severity, priority, githubCommitUrl} = req.body;

    const bug=await Bug.findByPk(id);

    if(!bug){
        throw ErrorFactory.notFound('Bug not found');
    }

    if(title) bug.title= title;
    if(description) bug.description = description;
    if(severity) bug.severity= severity;
    if(priority) bug.priority = priority;
    if(githubCommitUrl!== undefined) bug.githubCommitUrl = githubCommitUrl;
    
    await bug.save();

    await logActivity(
        bug.projectId,
        req.user.id,
        'BUG_UPDATED',
        `${req.user.name} updated bug: ${bug.title}`,
        bug.id
    );

    res.json({
        success: true,
        message: 'Bug updated successfully',
        bug
    });
});

export const assignBugToMember = catchAsync( async (req,res)=>{
    const {id} = req.params;
    const {assigneeId} = req.body;
    const userId =req.user.id;

    const bug=await Bug.findByPk(id);

    if(!bug){
        throw ErrorFactory.notFound('Bug not found');
    }

    const assigneeMembership = await ProjectMember.findByPk(assigneeId,{
        include:[
            {
                model: User,
                as: 'user',
                attributes: ['id','name','email']
            }
        ]
    });

    if(!assigneeMembership || assigneeMembership.projectId !== bug.projectId){
        throw ErrorFactory.badRequest('Assignee is not a member of this project');
    }

    if(assigneeMembership.role !== 'MP'){
        throw ErrorFactory.badRequest('Only MP members can be assigned bugs');
    }

    const assignment = await BugAssignment.create({
        bugId: bug.id,
        assignedTo: assigneeId,
        assignedBy: req.membership.id,
        status: 'PENDING'
    });

    bug.assigneeId = assigneeId;
    bug.status = 'ASSIGNED';
    await bug.save();

    await logActivity(
        bug.projectId,
        userId,
        'BUG_ASSIGNED',
        `${req.user.name} assigned bug "${bug.title}" to ${assigneeMembership.user.name}`,
        bug.id
    );

    res.json({
        success: true,
        message: 'Bug assigned successfully',
        assignment,
        bug
    });
});

export const selfAssignBug = catchAsync( async (req, res)=>{
    const {id} = req.params;
    const userId = req.user.id;

    const bug= await Bug.findByPk(id);

    if(!bug){
        throw ErrorFactory.notFound('Bug not found');
    }

    if(bug.assigneeId){
        throw ErrorFactory.badRequest('Bug is already assigned');
    }

    bug.assigneeId = req.membership.id;
    bug.status = 'IN_PROGRESS';
    await bug.save();

    await logActivity(
        bug.projectId,
        userId,
        'BUG_SELF_ASSIGNED',
        `${req.user.name} self-assigned bug: ${bug.title}`,
        bug.id
    );

    res.json({
        success: true,
        message: 'Bug self-assigned successfully',
        bug
    });
});

export const updateBugStatus = catchAsync( async (req,res)=>{
    const {id} = req.params;
    const {status} = req.body;

    const bug= req.bug;

    const oldStatus = bug.status;
    bug.status = status;
    await bug.save();

    await logActivity(
        bug.projectId,
        req.user.id,
        'BUG_STATUS_CHANGED',
        `${req.user.name} changed bug "${bug.title}" status from ${oldStatus} to ${status}`,
        bug.id
    );

    res.json({
        success: true,
        message: 'Bug status updated successfully',
        bug
    });
});

export const resolveBug = catchAsync( async (req,res)=>{
    const {id}= req.params;
    const bug = req.bug;
    bug.status ='RESOLVED';
    await bug.save();

    await logActivity(
        bug.projectId,
        req.user.id,
        'BUG_RESOLVED',
        `${req.user.name} marked bug "${bug.title}" as resolved`,
        bug.id
    );

    res.json({
        success: true,
        message: 'Bug marked as resolved',
        bug
    });
});

export const closeBug = catchAsync (async (req,res)=>{
    const {id} =req.params;
    const bug = req.bug;
    bug.status = 'CLOSED';
    await bug.save();

    await logActivity(
        bug.projectId,
        req.user.id,
        'BUG_CLOSED',
        `${req.user.name} closed bug: ${bug.title}`,
        bug.id
    );

    res.json({
        success: true,
        message: 'Bug closed successfully',
        bug
    });
});

export const deleteBug = catchAsync(async (req,res)=>{
    const {id} = req.params;
    const bug= await Bug.findByPk(id);

    if(!bug){
        throw ErrorFactory.notFound('Bug not found');
    }

    await bug.destroy();

    res.json({
        success: true,
        message: 'Bug deleted successfully'
    });
});