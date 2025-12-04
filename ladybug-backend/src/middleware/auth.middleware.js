import jwt from 'jsonwebtoken'
import {User} from '../models/associations.js'

export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token  = authHeader && authHeader.split(' ')[1];

        if(!token) {
            return res.status(401).json({
                succes: false,
                message: 'Access denied. No token provided.'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.userId);

        if (!user) {
            return res.status(401).json({
                succes: false,
                message: 'Invalid token. User not found.'
            });
        }

        req.user = {
            id: user.id,
            email: user.email,
            name: user.name
        };

        next();
    } catch(error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                succes: false,
                message: 'Invalid token.'
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired. Please login again.'
            });
        }
        return res.status(500).json({
            succes: false,
            message: 'Authentication failed.',
            error: error.message
        });
    }
};

export const optionalAuth = async(req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if(token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findByPk(decoded.userId);

            if (user) {
                req.user = {
                    id: user.id,
                    email: user.email,
                    name: user.name
                 };
            }
        }

        next();
    } catch (error) {
        next();
    }
};