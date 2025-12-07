import express from 'express'
import {
    acceptAssignment,
    rejectAssignment,
    getMyPendingAssignments,
    getMyAssignments,
    getBugAssignmentHistory
} from '..//controllers/bugAssignment.controller.js'

import { authenticateToken } from '../middleware/auth.middleware.js';
import {validateUUID, validateAssignmentReject} from '../middleware/validations.middleware.js'

const router = express.Router();

router.put('/:id/accept', authenticateToken, validateUUID, acceptAssignment);
router.put('/:id/reject', authenticateToken, validateUUID, validateAssignmentReject, rejectAssignment);
router.get('/my-pending', authenticateToken, getMyPendingAssignments);
router.get('/my-assignments', authenticateToken, getMyAssignments);
router.get('/bug/:bugId', authenticateToken, validateUUID, getBugAssignmentHistory)

export default router