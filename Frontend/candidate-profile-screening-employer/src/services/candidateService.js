import { API_CONFIG, apiRequest, handleApiError } from './apiConfig.js';

export const candidateService = {
  /**
   * Get all candidates for a specific job by jobId
   * Uses the new backend API: GET /api/v1/all-candidates/{id}
   */
  async getCandidatesByJobId(jobId) {
    try {
      const response = await apiRequest(`${API_CONFIG.BASE_URL}/all-candidates/${jobId}`);
      const candidates = await response.json();
      
      // Transform the data to include resumeUrl and appliedDate
      return candidates.map(candidate => ({
        ...candidate,
        resumeUrl: `${API_CONFIG.BASE_URL}/candidate/${candidate.id}/resume`, // Resume download URL
        appliedDate: candidate.applicationDate || new Date().toISOString()
      }));
    } catch (error) {
      throw handleApiError(error, 'fetching candidates by job ID');
    }
  },

  /**
   * Update candidate status
   * Uses the backend API: PUT /api/v1/update-status
   */
  async updateCandidateStatus(candidateId, newStatus) {
    try {
      const params = new URLSearchParams({
        id: candidateId,
        status: newStatus
      });
      
      const response = await apiRequest(`${API_CONFIG.BASE_URL}/update-status?${params}`, {
        method: 'PUT'
      });
      
      if (!response.ok) {
        throw new Error('Failed to update candidate status');
      }
      
      // The backend returns plain text, not JSON
      const result = await response.text();
      return { message: result };
    } catch (error) {
      throw handleApiError(error, 'updating candidate status');
    }
  },

  /**
   * Get candidate by ID
   * Uses the backend API: GET /api/v1/candidate/{id}
   */
  async getCandidateById(candidateId) {
    try {
      const response = await apiRequest(`${API_CONFIG.BASE_URL}/candidate/${candidateId}`);
      return await response.json();
    } catch (error) {
      throw handleApiError(error, 'fetching candidate by ID');
    }
  },

  /**
   * Get all candidates (deprecated - use getCandidatesByJobId instead)
   * Uses the backend API: GET /api/v1/candidates
   */
  async getAllCandidates() {
    try {
      const response = await apiRequest(`${API_CONFIG.BASE_URL}/candidates`);
      return await response.json();
    } catch (error) {
      throw handleApiError(error, 'fetching all candidates');
    }
  }
};
