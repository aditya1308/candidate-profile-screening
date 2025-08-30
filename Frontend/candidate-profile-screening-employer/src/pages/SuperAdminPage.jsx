import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, Plus, UserPlus, CheckCircle, XCircle } from 'lucide-react';
import { jobService } from '../services/jobService';
import { useAuth } from '../context/useAuth';
import Button3D from '../components/Button3D';

const SuperAdminPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnboardModal, setShowOnboardModal] = useState(false);
  const [onboardData, setOnboardData] = useState({ email: '', role: '' });
  const [onboardLoading, setOnboardLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const { onboardUser } = useAuth();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const fetchedJobs = await jobService.getAllJobs();
      setJobs(fetchedJobs);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOnboardSubmit = async (e) => {
    e.preventDefault();
    setOnboardLoading(true);

    try {
      await onboardUser(onboardData);
      setToast({
        show: true,
        message: `${onboardData.role} onboarded successfully with email: ${onboardData.email}`,
        type: 'success'
      });
      setOnboardData({ email: '', role: '' });
      setShowOnboardModal(false);
    } catch (error) {
      setToast({
        show: true,
        message: error.message || 'Onboarding failed',
        type: 'error'
      });
    } finally {
      setOnboardLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen p-6 bg-gray-50">
        <div className="mx-auto max-w-7xl">
          <div className="py-12 text-center">
            <div className="w-12 h-12 mx-auto border-b-2 rounded-full animate-spin border-sg-red"></div>
            <p className="mt-4 text-gray-600">Loading jobs...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6 bg-gray-50">
        <div className="mx-auto max-w-7xl">
          <div className="py-12 text-center">
            <p className="text-red-600">Error: {error}</p>
            <button 
              onClick={fetchJobs}
              className="px-4 py-2 mt-4 text-white transition-colors rounded-lg bg-sg-red hover:bg-sg-red-dark"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="mx-auto max-w-7xl">
        {/* Toast Notification */}
        {toast.show && (
          <div className="fixed z-50 max-w-sm top-4 right-4">
            <div className={`flex items-center p-4 rounded-lg shadow-lg ${
              toast.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              <div className="flex-shrink-0">
                {toast.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
              </div>
              <div className="flex-1 ml-3">
                <p className="text-sm font-medium">{toast.message}</p>
              </div>
              <button
                onClick={() => setToast({ show: false, message: '', type: '' })}
                className="flex-shrink-0 ml-4 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Header Section */}
        <div className="flex flex-col mb-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-6 lg:mb-0">
            <h1 className="mb-2 text-3xl font-bold text-gray-900">
              SuperAdmin Dashboard
            </h1>
            <p className="text-gray-600">
              Manage jobs and onboard new users
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div>
              <input
                type="text"
                placeholder="Search jobs by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full input-field sm:w-80"
              />
            </div>
            <Button3D
              onClick={() => setShowOnboardModal(true)}
              buttonColor="bg-sg-red"
              shadowColor="bg-black"
              className="flex items-center justify-center gap-2 px-6 py-3"
            >
              <UserPlus className="w-5 h-5" />
              Onboard User
            </Button3D>
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map(job => (
            <Link
              key={job.id}
              to={`/jobs/${job.id}`}
              className="flex flex-col h-full p-6 transition-all duration-200 bg-white rounded-lg shadow-lg card hover:-translate-y-1 shadow-gray-400/40 hover:shadow-xl hover:shadow-gray-500/50"
            >
              <div className="flex-grow">
                <div className="mb-4">
                  <h3 className="mb-2 text-xl font-semibold text-gray-900 line-clamp-2">{job.title}</h3>
                </div>

                <div className="mb-4">
                  <div className="flex items-center mb-3 text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="text-sm">{job.location || 'Not specified'}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-auto">
                <Button3D 
                  buttonColor="bg-sg-red" 
                  shadowColor="bg-black"
                >
                  View Details
                </Button3D>
              </div>
            </Link>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-lg text-gray-500">No jobs found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Onboard User Modal */}
      {showOnboardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-lg bg-white shadow-2xl rounded-xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-sg-red/10">
                  <UserPlus className="w-6 h-6 text-sg-red" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Onboard New User</h2>
                  <p className="text-sm text-gray-600">Add a new HR or Interviewer to the system</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowOnboardModal(false);
                  setOnboardData({ email: '', role: '' });
                }}
                className="p-2 text-gray-400 transition-colors rounded-lg hover:text-gray-600 hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleOnboardSubmit} className="p-6 space-y-6">
              <div>
                <label htmlFor="onboardEmail" className="block mb-2 text-sm font-semibold text-gray-700">
                  Email Address
                </label>
                <input
                  id="onboardEmail"
                  type="email"
                  required
                  disabled={onboardLoading}
                  className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-sg-red/50 focus:border-sg-red/50 disabled:opacity-50"
                  placeholder="Enter email address"
                  value={onboardData.email}
                  onChange={(e) => setOnboardData(prev => ({ ...prev, email: e.target.value }))}
                />
                <p className="mt-1 text-xs text-gray-500">The user will receive an invitation to create their account</p>
              </div>

              <div>
                <label htmlFor="onboardRole" className="block mb-2 text-sm font-semibold text-gray-700">
                  Role
                </label>
                <select
                  id="onboardRole"
                  required
                  disabled={onboardLoading}
                  className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-sg-red/50 focus:border-sg-red/50 disabled:opacity-50"
                  value={onboardData.role}
                  onChange={(e) => setOnboardData(prev => ({ ...prev, role: e.target.value }))}
                >
                  <option value="">Select a role</option>
                  <option value="HR">HR Manager</option>
                  <option value="INTERVIEWER">Interviewer</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">Choose the appropriate role for the user</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowOnboardModal(false);
                    setOnboardData({ email: '', role: '' });
                  }}
                  disabled={onboardLoading}
                  className="flex-1 px-6 py-3 font-medium text-gray-700 transition-colors bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={onboardLoading}
                  className="flex items-center justify-center flex-1 gap-2 px-6 py-3 font-medium text-white transition-colors rounded-lg bg-sg-red hover:bg-sg-red-dark disabled:opacity-50"
                >
                  {onboardLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                      Onboarding...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      Onboard User
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminPage;
