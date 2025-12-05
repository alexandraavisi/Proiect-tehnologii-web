import express from 'express';
import {
    register,
    login,
    getCurrentUser,
    updateProfile,
    changePassword,
    logout
} from '../controllers/auth.controller.js';
import {authenticateToken} from '../middleware/auth.middleware.js';
import {
    validateRegister,
    validateLogin,
    validateProfileUpdate,
    validatePasswordChange
} from '../middleware/validations.middleware.js';
import { SequelizeMethod } from 'sequelize/lib/utils';

const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

router.get('/me', authenticateToken, getCurrentUser);
router.put('/profile', authenticateToken, validateProfileUpdate, updateProfile);
router.put('/password', authenticateToken, validatePasswordChange, changePassword);
router.post('/logout', authenticateToken, logout);

export default router;