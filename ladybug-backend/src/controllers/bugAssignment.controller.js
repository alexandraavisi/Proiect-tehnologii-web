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

const logActivity = async (projectId, userId, type, message, bugId = null) =>{
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

export const acceptAssignment = catchAsync( async (req,res)=>{
    const {id} = req.params;
    const userId = req.user.id;

    const assignment = await BugAssignment.findByPk(id,{
        include:[
           {
            model: Bug,
            as: 'bug',
            include:[
                {
                    model: Project,
                    as: 'project',
                }
            ]
           },
           {
            model: ProjectMember,
            as: 'assignee',
            include:[
                {
                    model: User,
                    as: 'user'
                }
            ]
           }
        ]
    });

    if(!assignment){
        throw ErrorFactory.notFound('Assignment not found');
    }

    if(assignment.assignee.userId !== userId){
        throw ErrorFactory.forbidden('You can only accept assignments assigned to you');
    }

    if(assignment.status !== 'PENDING'){
        throw ErrorFactory.badRequest(`Cannot accept assignment with status ${assignment.status}`);
    }

    assignment.status = 'ACCEPTED';
    assignment.respondedAt = new Date();
    await assignment.save();

    const bug= assignment.bug;
    bug.status = 'IN_PROGRESS';
    await bug.save();

    await logActivity(
        bug.projectId,
        userId,
        'BUG_ASSIGNMENT_ACCEPTED',
        `${req.user.name} accepted assignment for bug "${bug.title}"`,
        bug.id
    );

    res.json({
        success: true,
        message: 'Assignment accepted successfully',
        assignment,
        bug 
    });
});

export const rejectAssignment = catchAsync(async (req,res)=>{
    const {id} =req.params;
    const {reason} = req.body;
    const userId = req.user.id;

    if(!reason){
        throw ErrorFactory.badRequest('Rejection reason is required');
    }

    const assignment = await BugAssignment.findByPk(id, {
        include:[
            {
                model: Bug,
                as: 'bug',
                include:[
                    {
                        model: Project,
                        as: 'project'
                    }
                ]
            },
            {
                model: ProjectMember,
                as: 'assignee',
                include:[
                    {
                        model: User,
                        as: 'user'
                    }
                ]
            }
        ]
    });

    if(!assignment){
        throw ErrorFactory.notFound('Assignment not found');
    }

    if(assignment.assignee.userId !== userId){
        throw ErrorFactory.forbidden('You can only reject assignments assigned to you');
    }

    if(assignment.status !== 'PENDING'){
        throw ErrorFactory.badRequest(`Cannot reject assignment with status ${assignment.status}`);
    }

    assignment.status= 'REJECTED';
    assignment.rejectionReason =reason;
    assignment.respondedAt = new Date();
    await assignment.save();

    const bug = assignment.bug;
    bug.assigneeId = null;
    bug.status = 'REPORTED';
    await bug.save();

    await logActivity(
        bug.projectId,
        userId,
        'BUG_ASSIGNMENT_REJECTED',
        `${req.user.name} rejected assignment for bug "${bug.title}": ${reason}`,
        bug.id
    );

    res.json({
        success: true,
        message: 'Assignment rejected successfully',
        assignment,
        bug
    });
});

export const getMyPendingAssignments = catchAsync(async (req,res)=>{
    const userId=req.user.id;

    const memberships= await ProjectMember.findAll({
        where: {userId},
        attributes: ['id']
    });

    const membershipIds= memberships.map(m =>m.id);

    const assignments = await BugAssignment.findAll({
        where: {
            assignedTo: membershipIds,
            status: 'PENDING'
        },
        include:[
            {
                model: Bug,
                as: 'bug',
                include:[
                    {
                        model: Project,
                        as: 'project',
                        attributes: ['id', 'name']
                    },
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
                    }
                ]
            },
            {
                model: ProjectMember,
                as: 'assigner',
                include:[
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'name', 'email']
                    }
                ]
            }
        ],
        order: [['createdAt', 'DESC']]
    });

    res.json({
        success: true,
        count: assignments.length,
        assignments
    });
});

export const getMyAssignments = catchAsync(async (req,res)=>{
    const userId= req.user.id;
    const {status} = req.query;

    const memberships= await ProjectMember.findAll({
        where: {userId},
        attributes: ['id']
    });

    const membershipIds= memberships.map(m => m.id);

    const whereClause= {
        assignedTo: membershipIds
    };

    if(status){
        whereClause.status =status;
    }

    const assignments = await BugAssignment.findAll({
        where: whereClause,
        include:[
            {
                model: Bug,
                as: 'bug',
                include:[
                    {
                        model: Project,
                        as: 'project',
                        attributes: ['id', 'name']
                    },
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
                    }
                ]
            },
            {
                model: ProjectMember,
                as: 'assigner',
                include:[
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'name', 'email']
                    }
                ]
            }
        ],
        order: [['createdAt', 'DESC']]
    });

    res.json({
        success: true,
        count: assignments.length,
        assignments
    });
});

export const getBugAssignmentHistory = catchAsync(async (req,res)=>{
    const {id} = req.params;
    const userId = req.user.id;

    const bug=await Bug.findByPk(id);

    if(!bug){
        throw ErrorFactory.notFound('Bug not found');
    }

    const memberships= await ProjectMember.findOne({
        where:{
            projectId: bug.projectId,
            userId
        }
    });

    if(!memberships){
        throw ErrorFactory.forbidden('Access denied. You are not a member of this project.');
    }

    const assignments= await BugAssignment.findAll({
        where: {bugId: id},
        include:[
            {
                model: ProjectMember,
                as: 'assignee',
                include:[
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'name', 'email']
                    }
                ]
            },
            {
                model: ProjectMember,
                as: 'assigner',
                include:[
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'name', 'email']
                    }
                ]
            }
        ],
        order: [['createdAt', 'DESC']]
    });

    res.json({
        success: true,
        bug:{
            id: bug.id,
            title: bug.title,
            status: bug.status
        },
        count: assignments.length,
        assignments
    });
});