import {body, param, validationResult} from 'express-validator';

export const handleValidationErrors = (req, res, next)=>{
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(err =>({
                field: err.path || err.param,
                message: err.msg
            })) 
        });
    }
    next();
};

const isStrongPassword = (value) =>{
    const minLength = 8;
    const hasUpperCase=/[A-Z]/.test(value);
    const hasLowerCase=/[a-z]/.test(value);
    const hasNumber=/[0-9]/.test(value);
    
    if(value.length < minLength)
        throw new Error('Password must be at least 8 characters long');
    if(!hasUpperCase)
        throw new Error('Password must contain at least one uppercase letter');
    if(!hasLowerCase)
        throw new Error('Password must contain at least one lowercase letter');
    if(!hasNumber)
        throw new Error('Password must contain at least one number');

    return true;
};

export const validateRegister = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({min: 2, max: 100}).withMessage('Name must be between 2 and 100 characters'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Must be a valid email address')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('Password is required')
        .custom(isStrongPassword),

    handleValidationErrors
];

export const validateLogin = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Must be a valid email address')
        .normalizeEmail(),
    
    body('password')
        .notEmpty().withMessage('Password is required'),

    handleValidationErrors
];

export const validateProfileUpdate = [
    body('name')
        .optional()
        .trim()
        .isLength({min: 2, max: 100}).withMessage('Name must be between 2 and 100 characters'),
    
    body('email')
        .optional()
        .trim()
        .isEmail().withMessage('Must be a valid email address')
        .normalizeEmail(),

    handleValidationErrors
];

export const validatePasswordChange = [
    body('currentPassword')
        .notEmpty().withMessage('Current password is required'),

    body('newPassword')
        .notEmpty().withMessage('New password is required')
        .custom(isStrongPassword)
        .custom((value, {req}) =>{
            if(value === req.body.currentPassword)
                throw new Error('New password must be different from current password');
            return true;
        }),

    handleValidationErrors
];

export const validateProjectCreate = [
    body('name')
        .trim()
        .notEmpty().withMessage('Project name is required')
        .isLength({min: 3, max: 200}).withMessage('Project name must be between 3 and 200 characters'),

    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({min: 10, max: 5000}).withMessage('Description must be between 10 and 5000 characters'),

    body('repoUrl')
        .trim()
        .notEmpty().withMessage('Repository URL is required')
        .isURL().withMessage('Must be a valid URL')
        .matches(/^https?:\/\/(www\.)?(github\.com|gitlab\.com)\//)
        .withMessage('Repository URL must be from GitHub or GitLab'),

    body('isPublic')
        .optional()
        .isBoolean().withMessage('isPublic must be a boolean'),

    handleValidationErrors
];

export const validateProjectUpdate = [
    body('name')
        .optional()
        .trim()
        .isLength({min: 3, max: 200}).withMessage('Project name must be between 3 and 200 characters'),

    body('description')
        .optional()
        .trim()
        .isLength({min: 10, max: 5000}).withMessage('Description must be between 10 and 5000 characters'),

    body('repoUrl')
        .optional()
        .trim()
        .isURL().withMessage('Must be a valid URL')
        .matches(/^https?:\/\/(www\.)?(github\.com|gitlab\.com)\//)
        .withMessage('Repository URL must be from GitHub or GitLab'),

    body('isPublic')
        .optional()
        .isBoolean().withMessage('isPublic must be a boolean'),

    handleValidationErrors
];

export const validateBugCreate = [
    body('projectId')
        .notEmpty().withMessage('Project ID is required')
        .isUUID().withMessage('Project ID must be a valid UUID'),

    body('title')
        .trim()
        .notEmpty().withMessage('Bug title is required')
        .isLength({min: 5, max: 300}).withMessage('Title must be between 5 and 300 characters'),

    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({min: 10, max: 10000}).withMessage('Description must be between 10 and 10000 characters'),

    body('severity')
        .notEmpty().withMessage('Severity is required')
        .isIn(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']).withMessage('Severity must be CRITICAL, HIGH, MEDIUM or LOW'),

    body('priority')
        .notEmpty().withMessage('Priority is required')
        .isIn(['HIGH', 'MEDIUM', 'LOW']).withMessage('Priority must be HIGH, MEDIUM or LOW'),

    body('githubCommitUrl')
        .optional()
        .trim()
        .isURL().withMessage('Must be a valid URL')
        .matches(/^https?:\/\/(www\.)?github\.com\/.*\/commit\/[a-f0-9]{40}$/)
        .withMessage('Must be a valid GitHub commit URL'),

    handleValidationErrors
];

export const validateBugUpdate = [
    body('title')
        .optional()
        .trim()
        .isLength({min: 5, max: 300}).withMessage('Title must be between 5 and 300 characters'),

    body('description')
        .optional()
        .trim()
        .isLength({min: 10, max: 10000}).withMessage('Description must be between 10 and 10000 characters'),

    body('severity')
        .optional()
        .isIn(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']).withMessage('Severity must be CRITICAL, HIGH, MEDIUM or LOW'),

    body('priority')
        .optional()
        .isIn(['HIGH', 'MEDIUM', 'LOW']).withMessage('Priority must be HIGH, MEDIUM or LOW'),

    body('githubCommitUrl')
        .optional()
        .trim()
        .isURL().withMessage('Must be a valid URL'),

    handleValidationErrors
];

export const validateBugStatusUpdate = [
    body('status')
        .notEmpty().withMessage('Status is required')
        .isIn(['ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'IN_TESTING', 'CLOSED'])
        .withMessage('Status must be ASSIGNED, IN_PROGRESS, RESOLVED, IN_TESTING or CLOSED'),

    handleValidationErrors
];

export const validateUUID = [
    param('id').isUUID().withMessage('Invalid ID format'),
    
    handleValidationErrors
];

export const validateAddMember = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Must be a valid email address')
        .normalizeEmail(),

    body('role')
        .notEmpty().withMessage('Role is required')
        .isIn(['MP', 'TST']).withMessage('Role must be either MP or TST'),

    handleValidationErrors
];

export const validateBugAssignment = [
    body('assigneeId')
        .notEmpty().withMessage('Assignee ID is required')
        .isUUID().withMessage('Assignee ID must be a valid UUID'),

    handleValidationErrors
];

export const validateProjectIdParam = [
    param('projectId').isUUID().withMessage('Invalid project ID format'),
    handleValidationErrors
];

export const validateAssignmentReject = [
    body('reason')
        .trim()
        .notEmpty().withMessage('Rejection reason is required')
        .isLength({ min: 10, max: 500 }).withMessage('Reason must be between 10 and 500 characters'),
    handleValidationErrors
];