export class ApiError extends Error{
    constructor(statusCode, message, isOperational = true){
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.status = statusCode.toString().startsWith('4') ? 'fail' : 'error';
        
        Error.captureStackTrace(this, this.constructor);
    }
}

export const ErrorFactory = {
    badRequest: (message = 'Bad Request') => new ApiError(400, message),
    unauthorized: (message = 'Unauthorized') => new ApiError(401, message),
    forbidden: (message = 'Forbidden') => new ApiError(403, message),
    notFound: (message = 'Resource not found') => new ApiError(404, message),
    conflict: (message = 'Conflict') => new ApiError(409, message),
    internal: (message = 'Internal Server Error') => new ApiError(500, message, false)
};

const handleSequelizeError = (err, res) =>{
    if(err.name === 'SequelizeValidationError'){
        const errors = err.errors.map( e =>({
            field: e.path,
            message: e.message
        }));

        return res.status(400).json({
            success: false,
            message: 'Validation error',
            errors
        });
    }

    if(err.name === 'SequelizeUniqueConstraintError'){
        const field = err.errors[0].path;
        return res.status(409).json({
            success: false,
            message: `${field} already exists`,
            field
        });
    }

    if(err.name === 'SequelizeForeignKeyConstraintError'){
        return res.status(400).json({
            success: false,
            message: 'Invalid reference - related resource not found'
        });
    }

    if(err.name === 'SequelizeConnectionError'){
        return res.status(503).json({
            success: false,
            message: 'Database connection error'
        });
    }

    return null;
};

export const errorHandler = (err, req, res, next) =>{
    const sequelizeError = handleSequelizeError(err, res);
    if(sequelizeError !== null)
        return;

    let statusCode= err.statusCode ||500;
    let message =err.message || 'Something went wrong';

    if(err.name === 'JsonWebTokenError'){
        statusCode=401;
        message= 'Invalid token';
    }

    if(err.name === 'TokenExpiredError'){
        statusCode=401;
        message='Token expired';
    }

    if(err.name === 'CastError'){
        statusCode=400;
        message= `Invalid ${err.path}: ${err.value}`;
    }

    const response = {
        success: false,
        message,
        ...(statusCode === 500 && {error: 'Internal Server Error'})
    };

    if(process.env.NODE_ENV ==='development'){
        response.stack = err.stack;
        response.error = err.message;
    }

    console.error('Error:', {
        message: err.message,
        statusCode,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
        body: req.body,
        params: req.params
    });

    res.status(statusCode).json(response);
};

export const notFoundHandler = (req, res, next) =>{
    const error = new ApiError(404, `Route ${req.originalUrl} not found`);
    next(error);
};

export const catchAsync = (fn) =>{
    return (req, res, next) =>{
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};