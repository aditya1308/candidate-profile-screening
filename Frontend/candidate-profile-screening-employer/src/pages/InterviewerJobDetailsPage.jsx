import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { jobService } from '../services/jobService';
import InterviewerCandidateManagement from '../components/InterviewerCandidateManagement';
import LoadingSpinner from '../components/LoadingSpinner';

const InterviewerJobDetailsPage = () => {
  const { id } = useParams();
  const jobId = parseInt(id);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        setError(null);
        const jobData = await jobService.getJobById(jobId);
        setJob(jobData);
      } catch (err) {
        setError(err.message || 'Failed to fetch job details');
        console.error('Error fetching job:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="py-12 text-center">
            <div className="w-12 h-12 mx-auto border-b-2 rounded-full animate-spin border-sg-red"></div>
            <p className="mt-4 text-gray-600">Loading job details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="py-12 text-center">
            <p className="text-red-600">Error: {error || 'Job not found'}</p>
            <Link 
              to="/dashboard"
              className="inline-flex items-center px-4 py-2 mt-4 text-white transition-colors rounded-lg bg-sg-red hover:bg-sg-red-dark"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Jobs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Full-width Navigation Bar with Back Button - Sticky below header */}
      <div className="sticky z-40 w-full bg-white border-b border-gray-200 shadow-sm top-16">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <Link 
              to="/dashboard"
              className="flex items-center text-gray-600 transition-colors duration-200 hover:text-sg-red"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Jobs
            </Link>
            <div className="w-px h-6 bg-gray-300"></div>
            <h1 className="text-lg font-semibold text-gray-900">{job.title} - Interview Candidates</h1>
          </div>
        </div>
      </div>

      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <InterviewerCandidateManagement />
      </div>
    </div>
  );
};

export default InterviewerJobDetailsPage;
