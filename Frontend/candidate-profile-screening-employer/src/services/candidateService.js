import { API_CONFIG, apiRequest, handleApiError } from './apiConfig.js';

export const candidateService = {
  async getCandidatesByJob() {
    try {
      // Use the existing /candidates endpoint to get all candidates
      const response = await apiRequest(`${API_CONFIG.BASE_URL}/candidates`);
      const allCandidates = await response.json();
      
      // Filter candidates with status "IN_PROCESS" (Applied candidates)
      const appliedCandidates = allCandidates.filter(candidate => 
        candidate.status === "IN_PROCESS"
      );
      
      // Transform the data to include resumeUrl and appliedDate
      return appliedCandidates.map(candidate => ({
        ...candidate,
        resumeUrl: `${API_CONFIG.BASE_URL}/candidate/${candidate.id}/resume`, // Resume download URL
        appliedDate: candidate.applicationDate || new Date().toISOString()
      }));
    } catch (error) {
      throw handleApiError(error, 'fetching candidates by job');
    }
  },

  async updateCandidateStatus(candidateId, newStatus) {
    try {
      // TODO: Implement actual backend endpoint for status updates
      // For now, throw an error since the endpoint is not implemented
      throw new Error('Status update endpoint not implemented yet');
    } catch (error) {
      throw handleApiError(error, 'updating candidate status');
    }
  },

  async getCandidateById(candidateId) {
    try {
      const response = await apiRequest(`${API_CONFIG.BASE_URL}/candidate/${candidateId}`);
      return await response.json();
    } catch (error) {
      throw handleApiError(error, 'fetching candidate by ID');
    }
  },

  async getAllCandidates() {
    try {
      const response = await apiRequest(`${API_CONFIG.BASE_URL}/candidates`);
      return await response.json();
    } catch (error) {
      throw handleApiError(error, 'fetching all candidates');
    }
  }
};
