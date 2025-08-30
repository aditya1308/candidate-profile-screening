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
      const response = await apiRequest(`${API_CONFIG.BASE_URL}/jobs/${jobId}`);
      const job = await response.json();
      
      // Transform backend job data to match frontend expected format
      return {
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
      };
    } catch (error) {
      throw handleApiError(error, 'fetching job by ID');
    }
  },

  async createJob(jobData) {
    try {
      const response = await apiRequest(`${API_CONFIG.BASE_URL}/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: jobData.title,
          description: jobData.description,
          location: jobData.location,
          requiredSkills: jobData.requiredSkills
        }),
      });
      
      const job = await response.json();
      
      // Transform backend job data to match frontend expected format
      return {
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
      };
    } catch (error) {
      throw handleApiError(error, 'creating job');
    }
  },

  async updateJob(jobId, jobData) {
    try {
      const response = await apiRequest(`${API_CONFIG.BASE_URL}/jobs/${jobId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: jobData.title,
          description: jobData.description,
          location: jobData.location,
          requiredSkills: jobData.requiredSkills
        }),
      });
      
      const job = await response.json();
      
      // Transform backend job data to match frontend expected format
      return {
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
      };
    } catch (error) {
      throw handleApiError(error, 'updating job');
    }
  },

  async deleteJob(jobId) {
    try {
      await apiRequest(`${API_CONFIG.BASE_URL}/jobs/${jobId}`, {
        method: 'DELETE',
      });
      return true;
    } catch (error) {
      throw handleApiError(error, 'deleting job');
    }
  }
};
