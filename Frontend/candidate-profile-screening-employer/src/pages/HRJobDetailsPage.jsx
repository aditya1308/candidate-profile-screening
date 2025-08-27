import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, FileText, Users } from 'lucide-react';
import JobDescription from '../components/JobDescription';
import ApplicantManagement from '../components/ApplicantManagement';
import JobAnalytics from '../components/JobAnalytics';
import { jobService } from '../services/jobService';

const HRJobDetailsPage = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('description');
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const jobData = await jobService.getJobById(parseInt(id));
      setJob(jobData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
              className="inline-flex items-center px-4 py-2 mt-4 text-white transition-colors rounded-lg bg-sg-red hover:bg-red-700"
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
            <h1 className="text-lg font-semibold text-gray-900">{job.title}</h1>
          </div>
        </div>
      </div>

      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Enhanced Navigation Tabs with Smooth Animations */}
        <div className="w-full mb-8">
          <div className="relative p-1 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
            {/* Animated Background Slider */}
            <div 
              className={`absolute top-1 bottom-1 bg-sg-red rounded-md transition-all duration-500 ease-out ${
                activeTab === 'description' 
                  ? 'left-1 w-[calc(50%-0.125rem)]' 
                  : 'left-[calc(50%+0.125rem)] w-[calc(50%-0.125rem)]'
              }`}
            />
            
            <nav className="relative flex w-full">
              <button
                onClick={() => setActiveTab('description')}
                className={`${
                  activeTab === 'description'
                    ? 'text-white'
                    : 'text-gray-600 hover:text-gray-800'
                } flex-1 py-4 px-6 rounded-md font-semibold text-sm transition-all duration-300 ease-out flex items-center justify-center space-x-2 relative z-10 hover:scale-[1.02] active:scale-[0.98]`}
              >
                <FileText className={`w-5 h-5 transition-all duration-300 ${
                  activeTab === 'description' ? 'animate-pulse' : ''
                }`} />
                <span className="transition-all duration-300">Job Description</span>
              </button>
              <button
                onClick={() => setActiveTab('applicants')}
                className={`${
                  activeTab === 'applicants'
                    ? 'text-white'
                    : 'text-gray-600 hover:text-gray-800'
                } flex-1 py-4 px-6 rounded-md font-semibold text-sm transition-all duration-300 ease-out flex items-center justify-center space-x-2 relative z-10 hover:scale-[1.02] active:scale-[0.98]`}
              >
                <Users className={`w-5 h-5 transition-all duration-300 ${
                  activeTab === 'applicants' ? 'animate-pulse' : ''
                }`} />
                <span className="transition-all duration-300">Applicants</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'description' ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <JobDescription job={job} />
            </div>
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <JobAnalytics jobId={id} />
              </div>
            </div>
          </div>
        ) : (
          <ApplicantManagement jobId={id} />
        )}
      </div>
    </div>
  );
};

export default HRJobDetailsPage;
