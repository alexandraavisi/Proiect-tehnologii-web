import {Project, ProjectMember, User, Bug, Activity} from '../models/associations.js'
import {catchAsync} from '../middleware/errorHandler.middleware.js';
import { ErrorFactory } from '../middleware/errorHandler.middleware.js';
import { Op } from 'sequelize';

const logActivity = async(projectId, userId, type, message, bugId = null) => {
    try {
        await Activity.create({
            projectId,
            userId,
            bugId,
            type,
            message
        });
    }catch (error) {
        console.error('Failed to log activity:', error);
    }
};


export const createProject = catchAsync(async (req, res) => {
    const {name, description, repoUrl, isPublic} = req.body;
    const userId = req.user.id;

    const project = await Project.create({
        name,
        description,
        repoUrl,
        isPublic: isPublic !== undefined ? isPublic : true,
        creatorId: userId
    });

    const membership = await ProjectMember.create({
        projectId: project.id,
        userId: userId,
        role: 'MP',
        isCreator: true
    });

    await logActivity(
        project.id,
        userId,
        'PROJECT_CREATED',
        `${req.user.name} created the project`
    );

    res.status(201).json({
        success: true,
        message: 'Project created successfully',
        project: {
            id: project.id,
            name: project.name,
            description: project.description,
            repoUrl: project.repoUrl,
            isPublic: project.isPublic,
            creatorId: project.creatorId,
            createdAt: project.createdAt
        },
        membership: {
            role: membership.role,
            isCreator: membership.isCreator
        }
    });
});

export const getAllProjects = catchAsync(async(req, res) => {
    const userId = req.user ? req.user.id : null;

    let whereClause = {};

    if (userId) {
        whereClause = {
            [Op.or]: [
                { isPublic: true },
                { creatorId:userId},
                {'$members.userId$': userId}
            ]
        };
    } else {
        whereClause = {isPublic: true};
    }

    const projects = await Project.findAll({
        where: whereClause,
        include: [
            {
                model: User,
                as: 'creator',
                attributes: ['id', 'name', 'email']
            },
            {
                model: ProjectMember,
                as: 'members',
                attributes: ['id', 'role', 'isCreator'],
                include: [
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'name', 'email']
                    }
                ]
            }
        ],
        order: [['createdAt', 'DESC']],
        distinct: true
    });

    res.json({
        success: true,
        count: projects.length,
        projects
    });
});

export const getProjectById = catchAsync(async (req, res) => {
    const {id} = req.params;
    const userId = req.user.id;

    const project = await Project.findByPk(id, {
        include: [
            {
                model: User,
                as: 'creator',
                attributes: ['id', 'name', 'email']
            },
            {
                model: ProjectMember,
                as: 'members',
                include: [
                    {
                        model:User,
                        as: 'user',
                        attributes: ['id', 'name', 'email']
                    }
                ]
            },
            {
                model: Bug,
                as: 'bugs',
                attributes: ['id', 'title', 'status', 'severity', 'priority', 'createdAt']
            }
        ]
    });

    if(!project) {
        throw ErrorFactory.notFound('Project not found');
    }

    const membership = await ProjectMember.findOne({
        where: {
            projectId: id,
            userId: userId
        }
    });

    if (!project.isPublic && !membership) {
        throw ErrorFactory.forbidden('Access denied. Project is private.');
    }

    const bugStats = {
        total: project.bugs.length,
        assigned: project.bugs.filter(b => b.status === 'ASSIGNED').length,
        inProgress: project.bugs.filter(b => b.status === 'IN_PROGRESS').length,
        resolved:project.bugs.filter(b => b.status === 'RESOLVED').length,
        inTesting: project.bugs.filter(b => b.status === 'IN_TESTING').length,
        closed: project.bugs.filter(b => b.status === 'CLOSED').length
    };

    const projectData = project.toJSON();

    if (membership) {
        projectData.membership = {
            id: membership.id,
            role: membership.role,
            isCreator: membership.isCreator,
            joinedAt: membership.joinedAt
        };
    } else {
        projectData.membership = null;
    }

    res.json({
        success: true,
        project: projectData,
        bugStats
    });
});

export const updateProject = catchAsync(async(req, res) => {
    const {id} = req.params;
    const {name, description, repoUrl, isPublic} = req.body;

    const project = await Project.findByPk(id);

    if(!project) {
        throw ErrorFactory.notFound('Project not found');
    }

    if(name) project.name = name;
    if(description) project.description = description;
    if(repoUrl) project.repoUrl = repoUrl;
    if(isPublic !== undefined) project.isPublic = isPublic;

    await project.save();

    await logActivity(
        project.id,
        req.user.id,
        'PROJECT_UPDATED',
        `${req.user.name} updated the project`
    );

    res.json({
        success: true,
        message: 'Project updated successfully',
        project
    });
});

export const deleteProject = catchAsync(async(req, res) => {
    const { id } = req.params;

    const project = await Project.findByPk(id);

    if(!project) {
        throw ErrorFactory.notFound('Project not found');
    }

    await project.destroy();

    res.json({
        success: true,
        message: 'Project deleted successfully'
    });
});

export const addMember = catchAsync(async(req, res) => {
    const {id} = req.params;
    const {email, role} = req.body;

    const user = await User.findOne({where: {email}});
    if(!user) {
        throw ErrorFactory.notFound('User with this email not found');
    }

    const existingMember = await ProjectMember.findOne({
        where: {
            projectId: id,
            userId: user.id
        }
    });

    if(existingMember) {
        throw ErrorFactory.conflict('User is already a member of this project');
    }

    const membership = await ProjectMember.create({
        projectId: id,
        userId: user.id,
        role,
        isCreator: false 
    });

    await logActivity(
        id,
        req.user.id,
        'MEMBER_ADDED',
        `${req.user.name} added ${user.name} as ${role}`
    );

    const memberWithUser = await ProjectMember.findByPk(membership.id, {
        include: [
            {
                model: User,
                as: 'user',
                attributes: ['id', 'name', 'email']
            }
        ]
    });

    res.status(201).json({
        success: true,
        message: 'Member added successfully',
        member: memberWithUser
    });
});

export const removeMember = catchAsync(async(req, res) => {
    const {id, memberId} = req.params;

    const membership = await ProjectMember.findOne({
        where: {
            id: memberId,
            projectId: id
        },
        include: [
            {
                model: User,
                as:'user',
                attributes: ['name']
            }
        ]
    });

    if(!membership) {
        throw ErrorFactory.notFound('Member not found');
    }

    if(membership.isCreator) {
        throw ErrorFactory.badRequest('Cannot remove project creator');
    }

    const memberName = membership.user.name;

    await membership.destroy();

    await logActivity(
        id,
        req.user.id,
        'MEMBER_REMOVED',
        `${req.user.name} removed ${memberName} from the project`
    );

    res.json({
        success: true,
        message: 'Member removed successfully'
    });
});

export const joinAsTester = catchAsync(async(req, res) => {
    const {id} = req.params;
    const userId = req.user.id;

    const project = await Project.findByPk(id);

    if(!project) {
        throw ErrorFactory.notFound('Project not found');
    }

    if(!project.isPublic) {
        throw ErrorFactory.forbidden('Cannot join private project. Contact project creator.');
    }

    const existingMember = await ProjectMember.findOne({
        where: {
            projectId: id,
            userId: userId
        }
    });

    if(existingMember) {
        throw ErrorFactory.conflict('You are already a member of this project')
    }

    const membership = await ProjectMember.create({
        projectId: id,
        userId: userId,
        role: 'TST',
        isCreator: false
    });

    await logActivity(
        id, 
        userId,
        'USER_JOINED_AS_TESTER',
        `${req.user.name} joined as tester`
    );

    res.status(201).json({
        success: true,
        message: 'Successfully joined project as tester',
        membership: {
            id: membership.id,
            role: membership.role,
            projectId: membership.projectId
        }
    });
});