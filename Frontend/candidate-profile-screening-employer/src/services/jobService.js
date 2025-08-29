import { API_CONFIG, apiRequest, handleApiError } from './apiConfig.js';

export const jobService = {
  async getAllJobs() {
    try {
      const response = await apiRequest(`${API_CONFIG.BASE_URL}/jobs`);
      const jobs = await response.json();
      
      // Transform backend job data to match frontend expected format
      return jobs.map(job => ({
        id: job.id,
        title: job.title,
        description: job.description,
        location: job.location,
        company: job.company || 'Societe Generale',
        status: job.status || 'Active',
        type: job.type || 'Full-time',
        experience: job.experience || 'Not specified',
        salary: job.salary || 'Competitive',
        postedDate: job.postedDate || new Date().toISOString(),
        applications: job.applications || 0,
        department: job.department,
        requirements: job.requirements || [],
        responsibilities: job.responsibilities || [],
        requiredSkills: job.requiredSkills || ''
      }));
    } catch (error) {
      throw handleApiError(error, 'fetching all jobs');
    }
  },

  async searchJobs(query) {
    try {
      const response = await apiRequest(`${API_CONFIG.BASE_URL}/jobs/search?query=${encodeURIComponent(query)}`);
      const jobs = await response.json();
      
      // Transform backend job data to match frontend expected format
      return jobs.map(job => ({
        id: job.id,
        title: job.title,
        description: job.description,
        location: job.location,
        company: job.company || 'Societe Generale',
        status: job.status || 'Active',
        type: job.type || 'Full-time',
        experience: job.experience || 'Not specified',
        salary: job.salary || 'Competitive',
        postedDate: job.postedDate || new Date().toISOString(),
        applications: job.applications || 0,
        department: job.department,
        requirements: job.requirements || [],
        responsibilities: job.responsibilities || [],
        requiredSkills: job.requiredSkills || ''
      }));
    } catch (error) {
      throw handleApiError(error, 'searching jobs');
    }
  },

  async getJobById(jobId) {
    try {
      // Since we don't have a backend endpoint for single job, 
      // we'll fetch all jobs and find the one we need
      const allJobs = await this.getAllJobs();
      const job = allJobs.find(job => job.id === jobId);
      
      if (!job) {
        throw new Error('Job not found');
      }
      
      return job;
    } catch (error) {
      throw handleApiError(error, 'fetching job by ID');
    }
  }
};
