import api from './api';

export const bugAssignmentService = {
    // Accept assignment
    acceptAssignment: async (assignmentId) => {
        const response = await api.put(`/bug-assignments/${assignmentId}/accept`);
        return response.data;
    },

    // Reject assignment
    rejectAssignment: async (assignmentId, reason) => {
        const response = await api.put(`/bug-assignments/${assignmentId}/reject`, { reason });
        return response.data;
    },

    // Get my pending assignments
    getMyPendingAssignments: async () => {
        const response = await api.get('/bug-assignments/my-pending');
        return response.data;
    },

    // Get all my assignments (with optional status filter)
    getMyAssignments: async (status = '') => {
        const params = status ? { status } : {};
        const response = await api.get('/bug-assignments/my-assignments', { params });
        return response.data;
    },

    // Get bug assignment history
    getBugHistory: async (bugId) => {
        const response = await api.get(`/bug-assignments/bug/${bugId}`);
        return response.data;
    },
};