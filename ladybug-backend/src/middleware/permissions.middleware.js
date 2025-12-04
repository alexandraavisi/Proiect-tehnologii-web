import { use } from 'react';
import {Project, ProjectMember, Bug } from '../models/associations.js';

const getProjectMembership = async (projectId, userId) => {
    return await ProjectMember.findOne({
        where: {
            projectId,
            userId
        }
    });
};

export const isProjectMember = async (req, res, next) => {
    try{
        const projectId = req.params.projectId || req.params.id || req.body.projectId;
        const userId = req.user.id;

        if(!projectId) {
            return res.status(400).json({
                success: false,
                message: 'Project ID is required'
            });
        }

        const membership = await getProjectMembership(projectId, userId);

        if(!membership) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. You are not a member of this project.'
            });
        }

        if (!membership.isCreator) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Only project creator can perform this action.'
            });
        }

        req.membership = membership;

        next();
    }catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to verify project membership',
            error: error.message
        });
    }
};

export const isProjectCreator = async (req, res, next) => {
    try {
        const projectId = req.params.projectId || req.params.id;
        const userId = req.user.id;

        if (!projectId) {
            return res.status(400).json({
                success: false,
                message: 'Project ID is required'
            });
        }

        const membership = await getProjectMembership(projectId, userId);

        if (!membership)  {
            return res.status(403).json({
                success: false,
                message: 'Access denied. You are not a member of this project.'
            });
        }

        req.membership = membership;

        next();
        
    }catch(error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to verify project membership',
            error: error.message
        });
    }
};

export const isMP = async (req, res, next) => {
  try {
    const projectId = req.params.projectId || req.params.id || req.body.projectId;
    const userId = req.user.id;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: 'Project ID is required'
      });
    }

    const membership = await getProjectMembership(projectId, userId);

    if (!membership) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You are not a member of this project.'
      });
    }

    if (membership.role !== 'MP') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only project members (MP) can perform this action.'
      });
    }

    req.membership = membership;

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to verify MP status',
      error: error.message
    });
  }
};

export const canUpdateBug = async (req, res, next) => {
    try {
        const bugId = req.params.id || req.params.bugId;
        const userId = req.user.id;

        if(!bugId) {
            return res.status(400).json({
                success: false,
                message: 'Bug ID is required'
            });
        }

        const bug = await Bug.findByPk(bugId, {
            include: [
                {
                    model: ProjectMember,
                    as: 'assignee',
                    include: ['user']
                }
            ]
        });

        if(!bug) {
            return res.status(404).json({
                success: false,
                 message: 'Bug not found'
            });
        }

        if(!bug.assigneeId || bug.assignee.userId !== userId) {
            return res.status(403).json({
                success: false,
                 message: 'Access denied. Only the assigned member can update this bug.'
            });
        }

        req.bug = bug;
        next();
    }catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to verify bug update permission',
            error: error.message
        });
    }
};

export const canCloseBug = async (req, res, next) => {
    try {
        const bugId = req.params.id || req.params.bugId;
        const userId = req.user.id;

        if (!bugId) {
            return res.status(400).json({
                success: false,
                message: 'Bug Id is required'
            });
        }

        const bug = await Bug.findByPk(bugId, {
            include: [
                {
                    model: Project,
                    as: 'project'
                }
            ]
        });

        if (!bug) {
            return res.status(404).json({
                success: false,
                message: 'Bug not found'
            });
        }

        const membership = await getProjectMembership(bug.projectId, userId);

        if(!membership || !membership.isCreator) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Only project creator can close bugs.'
            });
        }

        req.bug = bug;
        req.membership = membership;

        next();
    }catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to verify bug close permission',
            error: error.message
        });
    }
};

export const canAssignBugToOthers = async (req, res, next) => {
    try {
        const bugId = req.params.id || req.params.bugId;
        const userId = req.user.id;

        if(!bugId) {
            return res.status(400).json({
                success: false,
                message: 'Bug ID is required'
            });
        }

        const bug = await Bug.findByPk(bugId);

        if(!bug) {
            return res.status(404).json({
                success: false,
                message: 'Bug not found'
            });
        }

        const membership = await getProjectMembership(bug.projectId, userId);

        if(!membership) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. You are not a member of this project.'
            });
        }

        if(membership.role !== 'MP') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Only project member (MP) can assign bugs.'
            });
        }

        if(!membership.isCreator) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Only creator can assign to others.'
            })
        }

        req.bug = bug;
        req.membership = membership;

        next();

    }catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to verify bug assignment permission',
            error: error.message
        });
    }
};

export const canSelfAssignBug = async (req, res, next) => {
    try {
        const bugId = req.params.id || req.params.bugId;
        const userId = req.user.id;

        if(!bugId) {
            return res.status(400).json({
                success: false,
                message: 'Bug ID is required'
            });
        }

        const bug = await Bug.findByPk(bugId);

        if(!bug) {
            return res.status(404).json({
                success: false,
                message: 'Bug not found'
            });
        }

        if(bug.assigneeId) {
            return res.status(400).json({
                success: false,
                message: 'Bug is already assigned. Only unassigned bugs can be self-assigned.'
            });
        }

        const membership = await getProjectMembership(bug.projectId, userId);

        if(!membership) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. You are not a member of this project.'
            });
        }

        if(membership.role !== 'MP') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Only project members (MP) can self-assign bugs.'
            });
        }

        req.bug = bug;
        req.membership = membership;

        next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to verify self-assignment permission',
            error: error.message
        });
    }
};


export const canDeleteProject = async (req, res, next) => {
  try {
    const projectId = req.params.id || req.params.projectId;
    const userId = req.user.id;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: 'Project ID is required'
      });
    }

    const project = await Project.findByPk(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    if (project.creatorId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only project creator can delete the project.'
      });
    }

    req.project = project;

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to verify delete permission',
      error: error.message
    });
  }
};
