import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Project = sequelize.define('Project', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(200),
        allowNull:false,
        validate: {
            notEmpty: {
                msg: 'Project name cannot be empty'
            },
            len: {
                args: [3, 200],
                msg: 'Project name must be between 3 and 200 characters'
            }
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Description cannot be empty'
            }
        }
    },
    repoUrl: {
        type: DataTypes.STRING(500),
        allowNull: false,
        validate: {
            isUrl: {
                msg: 'Must be a valid URL'
            },
            notEmpty: {
                msg: 'Repository URL cannot be empty'
            }
        }
    },
    isPublic: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    creatorId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    }
}, {
    tableName: 'projects',
    timestamps: true
});

export default Project;