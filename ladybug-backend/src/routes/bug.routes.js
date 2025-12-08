import express from 'express';
import{
    createBug,
    getAllBugs,
    getBugById,
    updateBug,
    assignBugToMember,
    selfAssignBug,
    updateBugStatus,
    resolveBug,
    closeBug,
    deleteBug
} from '../controllers/bug.controller.js';
import {authenticateToken} from '../middleware/auth.middleware.js';
import{
    canUpdateBug,
    canCloseBug,
    canAssignBugToOthers,
    canSelfAssignBug,
    isProjectCreator
} from '../middleware/permissions.middleware.js';
import{
    validateBugCreate,
    validateBugUpdate,
    validateBugStatusUpdate,
    validateBugAssignment,
    validateUUID
} from '../middleware/validations.middleware.js';

const router = express.Router();

router.post('/', authenticateToken, validateBugCreate, createBug);
router.get('/', authenticateToken, getAllBugs);

router.post('/:id/assign', authenticateToken, validateUUID, validateBugAssignment, canAssignBugToOthers, assignBugToMember);
router.post('/:id/self-assign', authenticateToken, validateUUID, canSelfAssignBug, selfAssignBug);
router.put('/:id/status', authenticateToken, validateUUID, validateBugStatusUpdate, canUpdateBug, updateBugStatus);
router.put('/:id/resolve', authenticateToken, validateUUID, canUpdateBug, resolveBug);
router.put('/:id/close', authenticateToken, validateUUID, canCloseBug, closeBug);

router.get('/:id', authenticateToken, validateUUID, getBugById);
router.put('/:id', authenticateToken, validateUUID, validateBugUpdate, canUpdateBug, updateBug);
router.delete('/:id', authenticateToken, validateUUID, isProjectCreator, deleteBug);

export default router;