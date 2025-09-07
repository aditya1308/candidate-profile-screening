import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, FileText, Users, Upload } from 'lucide-react';
import JobDescription from '../components/JobDescription';
import ApplicantManagement from '../components/ApplicantManagement';
import JobAnalytics from '../components/JobAnalytics';
import BulkUploadModal from '../components/BulkUploadModal';
import Button3D from '../components/Button3D';
import { jobService } from '../services/jobService';
import { useAuth } from '../context/useAuth';

const HRJobDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  
  // Load initial activeTab from localStorage or use default
  const getInitialActiveTab = () => {
    try {
      const savedTab = localStorage.getItem(`hrJobDetails_activeTab_${id}`);
      return savedTab || 'description';
    } catch (error) {
      console.warn('Error loading saved tab state:', error);
      return 'description';
    }
  };

  const [activeTab, setActiveTab] = useState(getInitialActiveTab);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);

  // Check if user can access bulk upload feature (HR and SUPERADMIN only)
  const canAccessBulkUpload = () => {
    return user?.role === 'HR' || user?.role === 'SUPERADMIN';
  };

  // Function to save active tab to localStorage
  const saveActiveTab = (tab) => {
    try {
      localStorage.setItem(`hrJobDetails_activeTab_${id}`, tab);
    } catch (error) {
      console.warn('Error saving tab state to localStorage:', error);
    }
  };

  const fetchJob = useCallback(async () => {
    try {
      setLoading(true);
      const jobData = await jobService.getJobById(parseInt(id));
      setJob(jobData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchJob();
  }, [fetchJob]);

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
        <div className="flex items-center justify-between h-20 px-6 sm:px-8 lg:px-12">
          <div className="flex items-center space-x-6">
            <Link 
              to="/dashboard"
              className="flex items-center text-gray-600 transition-colors duration-200 hover:text-sg-red"
            >
              <ArrowLeft className="w-5 h-5 mr-3" />
              Back to Jobs
            </Link>
            <div className="w-px h-8 bg-gray-300"></div>
            <h1 className="text-xl font-semibold text-gray-900">{job.title}</h1>
          </div>
          {canAccessBulkUpload() && (
            <div className="flex items-center space-x-4">
              <div className="w-44">
                <Button3D
                  onClick={() => setShowBulkUploadModal(true)}
                  buttonColor="bg-sg-red"
                  shadowColor="bg-black"
                  className="py-3 px-6 text-sm font-medium"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Upload className="w-4 h-4" />
                    <span>Bulk Upload</span>
                  </div>
                </Button3D>
              </div>
            </div>
          )}
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
                onClick={() => {
                  setActiveTab('description');
                  saveActiveTab('description');
                }}
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
                onClick={() => {
                  setActiveTab('applicants');
                  saveActiveTab('applicants');
                }}
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

      {/* Bulk Upload Modal - Only show if user has access */}
      {canAccessBulkUpload() && (
        <BulkUploadModal
          isOpen={showBulkUploadModal}
          onClose={() => setShowBulkUploadModal(false)}
          jobId={parseInt(id)}
          jobTitle={job.title}
          onUploadSuccess={() => {
            // Refresh the applicants tab if it's currently active
            if (activeTab === 'applicants') {
              // The ApplicantManagement component will handle refreshing its own data
              // We could also trigger a refresh here if needed
            }
          }}
        />
      )}
    </div>
  );
};

export default HRJobDetailsPage;
