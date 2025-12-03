import sequelize from "../config/database.js";
import User from './User.js';
import Project from "./Project.js";
import ProjectMember from './ProjectMember.js'
import Bug from './Bug.js';
import BugAssignment from './BugAssignment.js'
import Activity from "./Activity.js";

User.hasMany(Project, {foreignKey: 'creatorId', as: 'createdProjects'});
User.hasMany(ProjectMember, {foreignKey: 'userId', as: 'projectMemberships'});
User.hasMany(Activity, {foreignKey: 'userId', as: 'activities'});

Project.belongsTo(User, {foreignKey: 'creatorId', as: 'creator'});
Project.hasMany(ProjectMember, {foreignKey: 'projectId', as: 'members', onDelete: 'CASCADE'});
Project.hasMany(Bug, {foreignKey: 'projectId', as: 'bugs', onDelete: 'CASCADE'});
Project.hasMany(Activity, {foreignKey: 'projectId', as: 'activities', onDelete: 'CASCADE'});

ProjectMember.belongsTo(User, { foreignKey: 'userId', as: 'user' });
ProjectMember.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });
ProjectMember.hasMany(Bug, { foreignKey: 'reporterId', as: 'reportedBugs' });
ProjectMember.hasMany(Bug, { foreignKey: 'assigneeId', as: 'assignedBugs' });
ProjectMember.hasMany(Bug, { foreignKey: 'closedBy', as: 'closedBugs' });
ProjectMember.hasMany(BugAssignment, { foreignKey: 'assignedTo', as: 'bugAssignments' });
ProjectMember.hasMany(BugAssignment, { foreignKey: 'assignedBy', as: 'assignmentsMade' });

Bug.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });
Bug.belongsTo(ProjectMember, { foreignKey: 'reporterId', as: 'reporter' });
Bug.belongsTo(ProjectMember, { foreignKey: 'assigneeId', as: 'assignee' });
Bug.belongsTo(ProjectMember, { foreignKey: 'closedBy', as: 'closer' });
Bug.hasMany(BugAssignment, { foreignKey: 'bugId', as: 'assignments', onDelete: 'CASCADE' });
Bug.hasMany(Activity, { foreignKey: 'bugId', as: 'activities', onDelete: 'CASCADE' });

BugAssignment.belongsTo(Bug, { foreignKey: 'bugId', as: 'bug' });
BugAssignment.belongsTo(ProjectMember, { foreignKey: 'assignedTo', as: 'assignee' });
BugAssignment.belongsTo(ProjectMember, { foreignKey: 'assignedBy', as: 'assigner' });

Activity.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });
Activity.belongsTo(Bug, { foreignKey: 'bugId', as: 'bug' });
Activity.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export {
    sequelize,
    User,
    Project,
    ProjectMember,
    Bug,
    BugAssignment,
    Activity
};

export default {
    sequelize,
    User,
    Project,
    ProjectMember,
    Bug,
    BugAssignment,
    Activity
};