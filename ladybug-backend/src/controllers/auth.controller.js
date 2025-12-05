import jwt from 'jsonwebtoken';
import {User} from '../models/associations.js';
import { catchAsync} from '../middleware/errorHandler.middleware.js';
import { ErrorFactory } from '../middleware/errorHandler.middleware.js';

const generateToken = (userId) =>{
    return jwt.sign(
        {userId},
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRES_IN || '7d'}
    );
};

export const register = catchAsync( async (req, res)=>{
    const {name, email, password} = req.body;

    const existingUser= await User.findOne({where: {email}});
    if(existingUser){
        throw ErrorFactory.conflict('Email already registered');
    }

    const user= await User.create({ name, email, password});
    const token = generateToken(user.id);

    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt
        }
    });
});

export const login = catchAsync( async (req, res)=>{
    const {email, password} = req.body;

    const user= await User.findOne({ where: {email}});
    if(!user){
        throw ErrorFactory.unauthorized('Invalid email or password');
    }

    const isPasswordValid = await user.comparePassword(password);
    if(!isPasswordValid){
        throw ErrorFactory.unauthorized('Invalid email or password');
    }

    const token = generateToken(user.id);

    res.json({
        success: true,
        message: 'Login successful',
        token,
        user:{
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt
        }
    });
});

export const getCurrentUser = catchAsync( async (req, res)=>{
    const user= await User.findByPk(req.user.id);
    if(!user){
        throw ErrorFactory.notFound('User not found');
    }

    res.json({
        success: true,
        user:{
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }
    });
});

export const updateProfile= catchAsync(async (req, res)=>{
    const {name, email}=req.body;
    const userId=req.user.id;

    const user= await User.findByPk(userId);
    if(!user){
        throw ErrorFactory.notFound('User not found');
    }

    if(email && email!==user.email){
        const existingUser = await User.findOne({ where: {email}});
        if(existingUser){
            throw ErrorFactory.conflict('Email already in use');
        }
    }

    if(name) user.name = name;
    if(email) user.email = email;

    await user.save();

    res.json({
        success: true,
        message: 'Profile updated successfully',
        user:{
            id: user.id,
            name: user.name,
            email: user.email,
            updatedAt: user.updatedAt
        }
    });
});

export const changePassword = catchAsync( async (req,res)=>{
    const {currentPassword, newPassword} = req.body;
    const userId = req.user.id;

    const user = await User.findByPk(userId);
    if(!user){
        throw ErrorFactory.notFound('User not found');
    }

    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if(!isCurrentPasswordValid){
        throw ErrorFactory.unauthorized('Current password is incorrect');
    }

    user.password = newPassword;
    await user.save();

    res.json({
        success: true,
        message: 'Password changed successfully'
    });
});

export const logout = catchAsync(async (req, res)=>{
    res.json({
        success: true,
        message: 'Logout successful. Please remove token from client.'
    });
});