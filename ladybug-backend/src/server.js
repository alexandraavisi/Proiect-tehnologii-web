import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'

import { testConnection } from './config/database.js'

import authRoutes from './routes/auth.routes.js'
import projectRoutes from './routes/project.routes.js'
import bugRoutes from './routes/bug.routes.js'
import activityRoutes from './routes/activity.routes.js'
import bugAssignmentRoutes from './routes/bugAssignment.routes.js'

import { errorHandler, notFoundHandler } from './middleware/errorHandler.middleware.js'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));

app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({extended: true, limit: '10mb'}));

if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}


app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'LadyBug API is running!'
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/bugs', bugRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/bug-assignments', bugAssignmentRoutes);

app.use(notFoundHandler);

app.use(errorHandler);

const startServer = async () => {
    try {
        console.log('Testing database connection...');
        const isConnected = await testConnection();

        if(!isConnected) {
            console.error('Failed to connect to database');
            process.exit(1);
        }

        app.listen(PORT, () => {
            console.log('LadyBug API Server Started');
            console.log(`Server running on: http://localhost:${PORT}`)
            console.log('Database: Connected')
            console.log(`Started at: ${new Date().toLocaleString()}`)
        });
    }catch (error) {
        console.error(' Failed to start server:', error.message)
        process.exit(1);
    }
};

process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});


startServer();

export default app;