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
  },

  /**
   * Get pending interviews for the current interviewer
   * Uses the backend API: GET /api/v1/interview/my-interviews/pending
   */
  async getPendingInterviews() {
    try {
      const response = await apiRequest(`http://localhost:8092/interview/my-interviews/pending`);
      return await response.json();
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
      const response = await apiRequest(`http://localhost:8092/interview/my-interviews/completed`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching completed interviews:', error);
      throw error;
    }
  },

  /**
   * Send interview scheduling email
   * Uses the backend API: POST /api/v1/email/schedule-invite
   */
  async sendInterviewEmail(candidateEmail, subject, body) {
    try {
      const url = `http://localhost:8092/api/v1/email/schedule-invite`;
      console.log('Sending interview email:', { candidateEmail, subject });
      
      const requestBody = {
        candidateEmail: candidateEmail,
        subject: subject,
        body: body
      };
      
      console.log('Request body:', requestBody);
      
      const response = await apiRequest(url, {
        method: 'POST',
        body: JSON.stringify(requestBody)
      });
      
      // Always try to get the response as text first, then parse if possible
      let responseText;
      try {
        responseText = await response.text();
        console.log('Raw response text:', responseText);
      } catch (textError) {
        console.error('Error reading response as text:', textError);
        throw new Error('Failed to read response from server');
      }
      
      // Try to parse as JSON, but don't fail if it's not JSON
      let data;
      try {
        data = JSON.parse(responseText);
        console.log('Parsed JSON response:', data);
      } catch (jsonError) {
        // If it's not JSON, treat it as plain text
        console.log('Response is not JSON, treating as plain text');
        data = { message: responseText };
      }
      
      console.log('Interview email sent successfully:', data);
      return data;
    } catch (error) {
      console.error('Error sending interview email:', error);
      throw error;
    }
  }
};
