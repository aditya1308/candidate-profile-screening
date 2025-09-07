import { API_CONFIG, apiRequest, handleApiError } from './apiConfig.js';
import { authService } from './authService.js';

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
  async updateCandidateStatus(candidateId, newStatus, interviewId = null, interviewerEmail = null) {
    try {
      const params = new URLSearchParams({
        id: candidateId,
        status: newStatus
      });
      
      // Add optional parameters if provided
      if (interviewId !== null && interviewId !== undefined) {
        params.append('interviewId', interviewId);
      }
      
      if (interviewerEmail !== null && interviewerEmail !== undefined && interviewerEmail !== '') {
        params.append('interviewerEmail', interviewerEmail);
      }
      
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
  },

  /**
   * Bulk upload resumes for a specific job
   * Uses the backend API: POST /api/v1/bulk-upload
   */
  async bulkUploadResumes(jobId, resumeFiles) {
    try {
      const formData = new FormData();
      
      // Add jobId to form data
      formData.append('jobId', jobId);
      
      // Add all resume files to form data
      resumeFiles.forEach((file) => {
        formData.append('resumePdf', file);
      });

      const response = await fetch(`${API_CONFIG.BASE_URL}/bulk-upload`, {
        method: 'POST',
        headers: {
          // Don't set Content-Type header - let browser set it with boundary for FormData
          'Authorization': authService.getAuthHeader().Authorization || ''
        },
        body: formData
      });

      if (!response.ok) {
        const error = new Error(`HTTP error! status: ${response.status}`);
        error.status = response.status;
        throw error;
      }
      
      return await response.json();
    } catch (error) {
      throw handleApiError(error, 'bulk uploading resumes');
    }
  }
};
