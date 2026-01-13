import api from './api'

export const authService = {
    // Get current user
    getCurrentUser: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    // Update profile
    updateProfile: async (data) => {
        const response = await api.put('/auth/profile', data);
        return response.data;
    },

    // Change password
    changePassword: async (data) => {
        const response = await api.put('/auth/password', data);
        return response.data;
    },
};