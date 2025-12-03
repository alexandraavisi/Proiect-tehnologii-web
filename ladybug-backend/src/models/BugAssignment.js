import { DataTypes, Deferrable } from "sequelize";
import sequelize from "../config/database.js";

const BugAssignment = sequelize.define('BugAssignment',{
    id:{
        type:DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey:true,
        allowNull: false
    },
    bugId:{
        type: DataTypes.UUID,
        allowNull: false,
        references:{
            model: 'bugs',
            key: 'id'
        }
    },
    assignedTo:{
        type: DataTypes.UUID,
        allowNull: false,
        references:{
            model: 'project_members',
            key: 'id'
        }
    },
    assignedBy:{
        type: DataTypes.UUID,
        allowNull: false,
        references:{
            model: 'project_members',
            key: 'id'
        }
    },
    status:{
        type: DataTypes.ENUM('PENDING', 'ACCEPTED', 'REJECTED'),
        allowNull: false,
        defaultValue: 'PENDING',
        validate:{
            isIn:{
                args: [['PENDING', 'ACCEPTED', 'REJECTED']],
                msg: 'Invalid assignment status'
            }
        }
    },
    assignedAt:{
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    respondedAt:{
        type: DataTypes.DATE,
        allowNull: true
    }
},{
    tableName:'bug_assignments',
    timestamps: true,
    indexes:[
        {
            unique: true,
            fields: ['bugId', 'assignedTo']
        },
        {
            fields: ['assignedTo', 'status']
        }
    ]
});

export default BugAssignment;