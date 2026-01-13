import { Activity, Project, User, ProjectMember,Bug } from '../models/associations.js';
import { catchAsync } from '../middleware/errorHandler.middleware.js';
import { ErrorFactory } from '../middleware/errorHandler.middleware.js'; 
import { Op, where } from 'sequelize';
import sequelize from '../config/database.js';

export const getProjectActivities = catchAsync(async(req, res) => {
    const {id: projectId} = req.params;
    const {limit = 20} = req.query;
    const userId = req.user.id;

    const project = await Project.findByPk(projectId);

    if (!project) {
        throw ErrorFactory.notFound('Project not found');
    }

    const membership = await ProjectMember.findOne({
        where: {
            projectId: projectId,
            userId: userId
        }
    });

    if(!project.isPublic && !membership) {
        throw ErrorFactory.forbidden('Access denied. You are not a member of this project.');
    }

    const activities = await Activity.findAll({
        where: {projectId},
        include: [
            {
                model: User,
                as: 'user',
                attributes: ['id', 'name', 'email']
            }
        ],
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit)
    });

    res.json({
        success: true,
        count: activities.length,
        activities
    });
});

export const getMyActivities = catchAsync(async(req, res) => {
    const userId = req.user.id;
    const {limit = 50} = req.query;

    const membership = await ProjectMember.findAll({
        where: {userId},
        attributes: ['projectId']
    });

    const projectIds = membership.map(m => m.projectId);

    if(projectIds.length === 0) {
        return res.json({
            success: true,
            count: 0,
            activities: []
        });
    }

    const activities = await Activity.findAll({
        where: {
            projectId: {
                [Op.in]: projectIds
            }
        },
        include: [
            {
                model: Project,
                as: 'project',
                attributes: ['id', 'name']
            },
            {
                model: User,
                as: 'user',
                attributes: ['id', 'name', 'email']
            },
            {
                model: Bug,
                as: 'bug',
                attributes: ['id', 'title', 'status']
            }
        ],
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit)
    });

    res.json({
        success: true,
        count: activities.length,
        activities
    });
});

export const  getDashboardStats = catchAsync(async (req, res) => {
    const projectId =req.params.id;
    const userId = req.user.id;

    const membership = await ProjectMember.findOne({
        where: {
            projectId,
            userId
        }
    });

    if(!membership) {
        throw ErrorFactory.forbidden('Access denied. You are not a member of this project.')
    }

    const project = await Project.findByPk(projectId, {
        include: [
            {
                model: User,
                as: 'creator',
                attributes: ['id', 'name', 'email']
            }
        ]
    });

    const meberStats = await ProjectMember.findAll({
        where: { projectId} ,
        attributes: [
            'role',
            [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['role']
    });

    const members = {
        total: 0,
        MP: 0,
        TST: 0
    };

    meberStats.forEach(stat => {
        const role = stat.get('role');
        const count = parseInt(stat.get('count'));
        members[role] = count;
        members.total += count;
    });

    const bugStatusStats = await Bug.findAll({
        where: {projectId},
        attributes: [
            'status',
            [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['status']
    });

    const bugs = {
        total: 0,
        REPORTED: 0,
        ASSIGNED: 0,
        IN_PROGRESS: 0,
        RESOLVED: 0,
        IN_TESTING: 0,
        CLOSED: 0
    };

    bugStatusStats.forEach(stat => {
        const status = stat.get('status');
        const count = parseInt(stat.get('count'));
        bugs[status] = count;
        bugs.total += count;
    });

    const bugSeverityStats = await Bug.findAll({
        where: {projectId},
        attributes: [
            'severity',
            [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['severity']
    });

    const severity = {
        CRITICAL: 0,
        HIGH: 0,
        MEDIUM: 0,
        LOW: 0
    };

    bugSeverityStats.forEach(stat => {
        const sev = stat.get('severity');
        const count = parseInt(stat.get('count'));
        severity[sev] = count;
    });

    const bugPriorityStats = await Bug.findAll({
        where: {projectId},
        attributes: [
            'priority',
            [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['priority']
    });

    const priority ={
        HIGH: 0,
        MEDIUM: 0,
        LOW: 0
    };

    bugPriorityStats.forEach(stat => {
        const pri = stat.get('priority');
        const count = parseInt(stat.get('count'));
        priority[pri] =count;
    });

    const recentActivities = await Activity.findAll({
        where: {projectId},
        include: [
            {
                model: User,
                as: 'user',
                attributes: ['id', 'name', 'email']
            },
            {
                model:Bug,
                as: 'bug',
                attributes: ['id', 'title']
            }
        ],
        order: [['createdAt' , 'DESC']],
        limit: 10
    });

    const topContributors = await Activity.findAll({
        where: {projectId},
        attributes: [
            'userId',
            [sequelize.fn('COUNT', sequelize.col('Activity.id')), 'activityCount']
        ],
        include: [
            {
                model: User,
                as: 'user',
                attributes: ['id', 'name', 'email']
            }
        ],
        group: ['Activity.userId', 'user.id'],
        order: [[sequelize.fn('COUNT', sequelize.col('Activity.id')), 'DESC']],
        limit: 5
    });

    res.json({
        success: true,
        project: {
            id: project.id,
            name: project.name,
            description: project.description,
            isPublic: project.isPublic,
            creator: project.creator,
            createdAt: project.createdAt
        },
        stats: {
            members,
            bugs,
            severity,
            priority
        },
        recentActivities,
        topContributors
    });
});

export const getMyStats = catchAsync(async(req, res) => {
    const userId = req.user.id;

    const projectCount = await ProjectMember.count({
        where: { userId }
    });

    const createdProjectsCount = await ProjectMember.count({
        where: {
            userId,
            isCreator: true
        }
    });

    const membership = await ProjectMember.findAll({
        where: {userId},
        attributes: ['id']
    });

    const membershipIds = membership.map(m => m.id);

    const bugsReported = await Bug.count ({
        where: {
            reporterId: {
                [Op.in]: membershipIds
            }
        }
    });

    const bugsAssigned = await Bug.count({
        where: {
            assigneeId: {
                [Op.in]: membershipIds
            }
        }
    });

    const bugsResolved = await Bug.count({
        where: {
            assigneeId: {
                [Op.in]: membershipIds
            },
            status: {
                [Op.in]: ['RESOLVED', 'CLOSED']
            }
        }
    });

    const roleStats = await ProjectMember.findAll({
        where: {userId},
        attributes: [
            'role',
            [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['role']
    });

    const roles = {
        MP: 0,
        TST: 0
    };

    roleStats.forEach(stat => {
        const role = stat.get('role');
        const count = parseInt(stat.get('count'));
        roles[role] = count;
    });

    res.json({
        success: true,
        stats: {
            projects: {
                total: projectCount,
                asCreator: createdProjectsCount,
                asMember: projectCount - createdProjectsCount
            },
            bugs: {
                reported: bugsReported,
                assigned: bugsAssigned,
                resolved: bugsResolved
            },
            roles
        }
    });
});