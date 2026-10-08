import { candidateStorageService } from './candidateStorageService.js';

const API_BASE_URL = 'http://localhost:8092/api/v1';

export const applicationService = {
  async autofillResume(resume, jobId) {
    const formData = new FormData();
    formData.append('resumePdf', resume);
    formData.append('jobId', jobId);

    const response = await fetch(`${API_BASE_URL}/parse-resume`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${candidateStorageService.getToken()}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = 'Unable to read the resume';
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorJson.error || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  },

  async submitApplication(applicationData) {
    try {
      const formData = new FormData();
      
      // Add all form fields to FormData
      formData.append('name', applicationData.name);
      formData.append('dob', applicationData.dateOfBirth);
      formData.append('phoneNumber', applicationData.phone);
      formData.append('resumePdf', applicationData.resume);
      formData.append('jobId', applicationData.jobId);
      formData.append('consent', applicationData.consent);

      const response = await fetch(`${API_BASE_URL}/apply-job`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${candidateStorageService.getToken()}`
        },
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
        } catch {
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