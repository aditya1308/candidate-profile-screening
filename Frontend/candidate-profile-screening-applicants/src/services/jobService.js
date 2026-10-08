import { candidateStorageService } from './candidateStorageService.js';

const API_BASE_URL = 'http://localhost:8092/api/v1'

export const jobService = {
  async getAllJobs() {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const jobs = await response.json();
      
      // Transform backend job data to match frontend expected format
      return jobs.map(job => ({
        id: job.id,
        title: job.title,
        description: job.description,
        location: job.location,
        requiredSkills: job.requiredSkills || ''
      }));
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
  },

  async searchJobs(query) {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs/search?query=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const jobs = await response.json();
      
      // Transform backend job data to match frontend expected format
      return jobs.map(job => ({
        id: job.id,
        title: job.title,
        description: job.description,
        location: job.location,
        requiredSkills: job.requiredSkills || ''
      }));
    } catch (error) {
      console.error('Error searching jobs:', error);
      throw error;
    }
  },

  async getJobById(jobId) {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const job = await response.json();
      
      return {
        id: job.id,
        title: job.title,
        description: job.description,
        location: job.location,
        requiredSkills: job.requiredSkills || ''
      };
    } catch (error) {
      console.error('Error fetching job:', error);
      throw error;
    }
  },

  async matchJobs(resumePdf) {
    const formData = new FormData();
    formData.append('resumePdf', resumePdf);

    const response = await fetch(`${API_BASE_URL}/match-jobs`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${candidateStorageService.getToken()}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = 'Unable to match this resume to the available jobs.';
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorJson.error || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  }
};
