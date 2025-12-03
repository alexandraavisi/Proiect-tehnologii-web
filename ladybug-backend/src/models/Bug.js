import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Bug=sequelize.define('Bug',{
    id:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    projectId:{
        type:DataTypes.UUID,
        allowNull: false,
        references:{
            model:'projects',
            key:'id'
        }
    },
    title:{
        type:DataTypes.STRING(300),
        allowNull:false,
        validate:{
            notEmpty:{
                msg: 'Bug title cannot be empty'
            },
            len:{
                args: [5,300],
                msg: 'Title must be between 5 and 300 characters'
            }
        }
    },
    description:{
        type: DataTypes.TEXT,
        allowNull: false,
        validate:{
            notEmpty:{
                msg: 'Description cannot be empty'
            }
        }
    },
    severity:{
        type:DataTypes.ENUM('CRITICAL', 'HIGH', 'MEDIUM', 'LOW'),
        allowNull: false,
        validate:{
            isIn:{
                args:[['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']],
                msg: 'Invalid severity level'
            }
        }
    },
    priority:{
        type: DataTypes.ENUM('HIGH', 'MEDIUM', 'LOW'),
        allowNull: false,
        validate:{
            isIn:{
                args:[['HIGH', 'MEDIUM', 'LOW']],
                msg: 'Invalid priority level'
            }
        }
    },
    status:{
        type: DataTypes.ENUM('ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'IN_TESTING', 'CLOSED'),
        allowNull: false,
        validate:{
            isIn:{
                args:[['ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'IN_TESTING', 'CLOSED']],
                msg:'Invalid status'
            }
        }
    },
    reporterId:{
        type: DataTypes.UUID,
        allowNull: false,
        references:{
            model: 'project_members',
            key: 'id'
        }
    },
    assigneeId:{
        type: DataTypes.UUID,
        allowNull: true,
        references:{
            model: 'project_members',
            key: 'id'
        }
    },
    githubCommitUrl:{
        type: DataTypes.STRING(500),
        allowNull: true
    },
    resolvedAt:{
        type: DataTypes.DATE,
        allowNull: true
    },
    closedAt:{
        type: DataTypes.DATE,
        allowNull: true
    },
    closedBy:{
        type: DataTypes.UUID,
        allowNull: true,
        references:{
            model: 'project_members',
            key: 'id'
        }
    }
},{
    tableName: 'bugs',
    timestamps: true,
    indexes:[
        {
            fields: ['projectId', 'status']
        },
        {
            fields:['assigneeId']
        }
    ]
});

export default Bug;