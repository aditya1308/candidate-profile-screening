import { apiRequest } from './apiConfig.js';

export const interviewerService = {
  /**
   * Get all interviewers
   * Uses the backend API: GET /api/v1/admins/interviewers
   */
  async getAllInterviewers() {
    try {
      const response = await apiRequest(`http://localhost:8092/admins/interviewers`);
      return await response.json();
    } catch (error) {
      console.warn('Interviewer API not ready, using mock data:', error.message);
    }
  }
};
