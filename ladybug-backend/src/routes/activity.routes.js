import express from 'express';
import {
    getProjectActivities,
    getMyActivities,
    getDashboardStats,
    getMyStats
} from '../controllers/activity.controller.js'
import { authenticateToken } from '../middleware/auth.middleware.js';
import { validateUUID, validateProjectIdParam } from '../middleware/validations.middleware.js';

const router = express.Router();

router.get(
    '/project/:id',
    authenticateToken,
    validateUUID,
    getProjectActivities
);

router.get(
    '/my-feed',
    authenticateToken,
    getMyActivities
);

router.get(
    '/dashboard/:id',
    authenticateToken,
    validateUUID,
    getDashboardStats
);

router.get(
    '/my-stats', 
    authenticateToken,
    getMyStats
);

export default router;