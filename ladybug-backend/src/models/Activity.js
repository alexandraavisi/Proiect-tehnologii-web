import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Activity = sequelize.define('Activity', {
    id: {
        type:DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    projectId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'projects',
            key: 'id'
        }
    },
    bugId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'bugs',
            key: 'id'
        }
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    type: {
        type:DataTypes.ENUM(
            'PROJECT_CREATED',
            'PROJECT_UPDATED',
            'PROJECT_DELETED',
            'MEMBER_ADDED',
            'MEMBER_REMOVED',
            'BUG_REPORTED',
            'BUG_ASSIGNED',
            'BUG_ASSIGNMENT_ACCEPTED',
            'BUG_ASSIGNMENT_REJECTED',
            'BUG_STATUS_CHANGED',
            'BUG_RESOLVED',
            'BUG_CLOSED',
            'USER_JOINED_AS_TESTER'
        ),
        allowNull:false
    },
    message: {
        type: DataTypes.STRING(500),
        allowNull: false
    }
}, {
    tableName: 'activities',
    timestamps:true,
    updatedAt: false,
    indexes: [
        {
            fields: ['projectId', 'cratedAt']
        },
        {
            fields: ['userId', 'createdAt']
        }
    ]
});

export default Activity;