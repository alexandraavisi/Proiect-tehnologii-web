import api from './api';

export const activityService = {
    // Get project activities
    getProjectActivities: async (projectId, limit = 20) => {
        const response = await api.get(`/activities/project/${projectId}`, {params: { limit }});
        return response.data;
    },

    // Get my activity feed
    getMyActivityFeed: async (limit = 50) => {
        const response = await api.get('/activities/my-feed', {params: { limit }});
        return response.data;
    },

    // Get dashboard statistics
    getDashboardStats: async (projectId) => {
        const response = await api.get(`/activities/dashboard/${projectId}`);
        return response.data;
    },

    // Get my personal statistics
    getMyStats: async () => {
        const response = await api.get('/activities/my-stats');
        return response.data;
    },
};