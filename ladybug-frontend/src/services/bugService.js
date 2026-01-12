import api from './api';

export const bugService = {
  // Get all bugs
  getAllBugs: async (params = {}) => {
    const response = await api.get('/bugs', { params });
    return response.data;
  },

  // Get bug by ID
  getBugById: async (id) => {
    const response = await api.get(`/bugs/${id}`);
    return response.data;
  },

  // Create bug
  createBug: async (data) => {
    const response = await api.post('/bugs', data);
    return response.data;
  },

  // Update bug
  updateBug: async (id, data) => {
    const response = await api.put(`/bugs/${id}`, data);
    return response.data;
  },

  // Update bug status
  updateBugStatus: async (id, status) => {
    const response = await api.put(`/bugs/${id}/status`, { status });
    return response.data;
  },

  // Self-assign bug
  selfAssignBug: async (id) => {
    const response = await api.post(`/bugs/${id}/self-assign`);
    return response.data;
  },

  // Assign bug to member
  assignBugToMember: async (id, assigneeId) => {
    const response = await api.post(`/bugs/${id}/assign`, { assigneeId });
    return response.data;
  },

   // Resolve bug
  resolveBug: async (id) => {
    const response = await api.put(`/bugs/${id}/resolve`);
    return response.data;
  },

  // Close bug
  closeBug: async (id) => {
    const response = await api.put(`/bugs/${id}/close`);
    return response.data;
  },

   // Delete bug
  deleteBug: async (id) => {
    const response = await api.delete(`/bugs/${id}`);
    return response.data;
  },
};



