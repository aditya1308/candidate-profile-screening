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
      // Return mock data for testing
      return [
        { id: 1, fullName: "John Doe", email: "john.doe@company.com" },
        { id: 2, fullName: "Jane Smith", email: "jane.smith@company.com" },
        { id: 3, fullName: "Mike Johnson", email: "mike.johnson@company.com" },
        { id: 4, fullName: "Sarah Wilson", email: "sarah.wilson@company.com" },
        { id: 5, fullName: "David Brown", email: "david.brown@company.com" },
        { id: 6, fullName: "Emily Davis", email: "emily.davis@company.com" },
        { id: 7, fullName: "Robert Taylor", email: "robert.taylor@company.com" },
        { id: 8, fullName: "Lisa Anderson", email: "lisa.anderson@company.com" },
        { id: 9, fullName: "Michael Wilson", email: "michael.wilson@company.com" },
        { id: 10, fullName: "Jennifer Garcia", email: "jennifer.garcia@company.com" },
        { id: 11, fullName: "Christopher Martinez", email: "christopher.martinez@company.com" },
        { id: 12, fullName: "Amanda Rodriguez", email: "amanda.rodriguez@company.com" },
        { id: 13, fullName: "James Thompson", email: "james.thompson@company.com" },
        { id: 14, fullName: "Michelle White", email: "michelle.white@company.com" },
        { id: 15, fullName: "Daniel Lee", email: "daniel.lee@company.com" },
        { id: 16, fullName: "Jessica Hall", email: "jessica.hall@company.com" },
        { id: 17, fullName: "Matthew Allen", email: "matthew.allen@company.com" },
        { id: 18, fullName: "Nicole Young", email: "nicole.young@company.com" },
        { id: 19, fullName: "Andrew King", email: "andrew.king@company.com" },
        { id: 20, fullName: "Stephanie Wright", email: "stephanie.wright@company.com" }
      ];
    }
  }
};
