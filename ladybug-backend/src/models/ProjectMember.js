import {DataTypes, Model} from 'sequelize';
import sequelize from '../config/database.js';

const ProjectMember = sequelize.define('ProjectMember',{
    id:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    projectId:{
        type: DataTypes.UUID,
        allowNull: false,
        references:{
            model: 'projects',
            key: 'id'
        }
    },
    userId:{
        type: DataTypes.UUID,
        allowNull: false,
        validate:{
            isIn:{
                args:[['MP', 'TST']],
                msg: 'Role must be either MP or TST'
            }
        }
    },
    isCreator:{
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    joinedAt:{
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
},{
    tableName: 'project_members',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['projectId', 'userId']
        }
    ]
});

export default ProjectMember;