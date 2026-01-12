import api from "./api";

export const projectService = {
    //Get all projects
    getAllProjects: async () => {
        const response = await api.get('/projects');
        return response.data;
    },

    //Get project by ID
    getProjectById: async (id) => {
        const response = await api.get(`/projects/${id}`);
        return response.data;
    },

    //Create project
    createProject: async (data) => {
        const response = await api.post(`/projects`, data);
        return response.data;
    },

    //Update project
    updateProject: async (id) => {
        const response = await api.delete(`/projects/${id}`);
        return response.data;
    },

    //Delete project
    deleteProject: async (id) => {
        const response = await api.delete(`/projects/${id}, data`);
        return response.data;
    },

    //Add memeber to project
    addMember: async (projectId, data) => {
        const response = await api.post(`/projects/${projectId}/members`, data);
        return response.data;
    },

    //Remove member from project
    removeMember: async (projectId, memberId) => {
        const response = await api.delete(`/projects/${projectId}/members/${memberId}`);
        return response.data;
    },

    //Join as tester
    joinAsTester: async (projectId) => {
        const response = await api.post(`/projects/${projectId}/join`);
        return response.data;
    },
};