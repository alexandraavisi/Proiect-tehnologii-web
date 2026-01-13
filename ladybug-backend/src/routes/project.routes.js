import express from 'express';
import {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject,
    addMember,
    removeMember,
    joinAsTester
} from '../controllers/project.controller.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.middleware.js';
import {
    isProjectMember,
    isProjectCreator,
    canDeleteProject
} from '../middleware/permissions.middleware.js';
import {
    validateProjectCreate,
    validateProjectUpdate,
    validateAddMember,
    validateUUID
} from '../middleware/validations.middleware.js';

const router = express.Router();

router.post('/', authenticateToken, validateProjectCreate, createProject);
router.get('/', optionalAuth, getAllProjects);

router.post('/:id/members', authenticateToken, validateUUID, validateAddMember, isProjectCreator, addMember);
router.delete('/:id/members/:memberId', authenticateToken, isProjectCreator, removeMember);
router.post('/:id/join', authenticateToken, validateUUID, joinAsTester);

router.get('/:id', authenticateToken, validateUUID,  getProjectById);
router.put('/:id', authenticateToken, validateUUID, validateProjectUpdate, isProjectCreator, updateProject);
router.delete('/:id', authenticateToken, validateUUID, canDeleteProject, deleteProject);



export default router;