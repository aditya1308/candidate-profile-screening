import { apiRequest, API_CONFIG } from './apiConfig.js';

export const interviewService = {
  /**
   * Get pending interviews for the current interviewer
   * Uses the backend API: GET /api/v1/interview/my-interviews/pending
   */
  async getPendingInterviews() {
    try {
      const url = `${API_CONFIG.BASE_URL}/interview/my-interviews/pending`;
      console.log('Fetching pending interviews from:', url);
      
      const response = await apiRequest(url);
      const data = await response.json();
      
      console.log('Pending interviews response:', data);
      return data;
    } catch (error) {
      console.error('Error fetching pending interviews:', error);
      throw error;
    }
  },

  /**
   * Get completed interviews for the current interviewer
   * Uses the backend API: GET /api/v1/interview/my-interviews/completed
   */
  async getCompletedInterviews() {
    try {
      const url = `${API_CONFIG.BASE_URL}/interview/my-interviews/completed`;
      console.log('Fetching completed interviews from:', url);
      
      const response = await apiRequest(url);
      const data = await response.json();
      
      console.log('Completed interviews response:', data);
      return data;
    } catch (error) {
      console.error('Error fetching completed interviews:', error);
      throw error;
    }
  }
};
