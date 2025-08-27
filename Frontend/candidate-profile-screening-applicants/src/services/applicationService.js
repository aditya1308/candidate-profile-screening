const API_BASE_URL = 'http://localhost:8092/api/v1';

export const applicationService = {
  async submitApplication(applicationData) {
    try {
      const formData = new FormData();
      formData.append('resumePdf', applicationData.resume);
      formData.append('jobId', applicationData.jobId);

      const response = await fetch(`${API_BASE_URL}/apply-job`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Failed to submit application';
        
        // Try to parse the error response as JSON to get the specific message
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.message) {
            errorMessage = errorJson.message;
          } else if (errorJson.error) {
            errorMessage = errorJson.error;
          }
        } catch (parseError) {
          // If it's not JSON, use the raw text
          errorMessage = errorText || `HTTP error! status: ${response.status}`;
        }
        
        return {
          success: false,
          error: errorMessage
        };
      }

      const application = await response.json();
      return {
        success: true,
        application,
        applicationId: application.id,
        candidateId: application.candidateId,
        jobId: application.jobId
      };
    } catch (error) {
      console.error('Error submitting application:', error);
      return {
        success: false,
        error: error.message || 'An unexpected error occurred'
      };
    }
  },

  async getCandidateById(candidateId) {
    try {
      const response = await fetch(`${API_BASE_URL}/candidate/${candidateId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching candidate:', error);
      throw error;
    }
  },

  async getAllCandidates() {
    try {
      const response = await fetch(`${API_BASE_URL}/candidates`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching candidates:', error);
      throw error;
    }
  }
};