import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes.jsx';

// Applicant Routes Component - These are orphan routes that can be accessed directly
const ApplicantRoutes = () => {
  const [currentPage, setCurrentPage] = useState('landing');
  const [selectedJob, setSelectedJob] = useState(null);
  const [submittedApplication, setSubmittedApplication] = useState(null);

  const handleExploreClick = () => {
    setCurrentPage('jobs');
  };

  const handleJobClick = (job) => {
    setSelectedJob(job);
    setCurrentPage('apply');
  };

  const handleBackToJobs = () => {
    setCurrentPage('jobs');
    setSelectedJob(null);
  };

  const handleApplicationSubmit = (application) => {
    setSubmittedApplication(application);
    setCurrentPage('success');
  };

  const handleBackToLanding = () => {
    setCurrentPage('landing');
    setSelectedJob(null);
    setSubmittedApplication(null);
  };

  if (currentPage === 'landing') {
    return <LandingPage onExploreClick={handleExploreClick} />;
  }

  if (currentPage === 'jobs') {
    return (
      <div>
        {/* Navigation Header for Applicant Pages */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">T</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">TechCorp Solutions</h1>
                  <p className="text-sm text-gray-600">Career Opportunities</p>
                </div>
              </div>
              <button
                onClick={handleBackToLanding}
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                ← Back to Home
              </button>
            </div>
          </div>
        </div>
        
        <JobListings
          jobs={jobOpenings}
          onJobClick={handleJobClick}
          userType="applicant"
        />
      </div>
    );
  }

  if (currentPage === 'apply' && selectedJob) {
    return (
      <div>
        {/* Navigation Header for Application Form */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">T</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">TechCorp Solutions</h1>
                  <p className="text-sm text-gray-600">Apply for {selectedJob.title}</p>
                </div>
              </div>
              <button
                onClick={handleBackToJobs}
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                ← Back to Jobs
              </button>
            </div>
          </div>
        </div>
        
        <ApplicationForm
          job={selectedJob}
          onBack={handleBackToJobs}
          onSubmit={handleApplicationSubmit}
        />
      </div>
    );
  }

  if (currentPage === 'success' && submittedApplication) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your application. We've received your submission and will review it carefully.
          </p>
          <button
            onClick={handleBackToLanding}
            className="btn-primary w-full"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return <LandingPage onExploreClick={handleExploreClick} />;
};

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

// Internal Team Routes Component - This is the main dashboard for talent acquisition and interview teams
const InternalTeamRoutes = () => {
  const { currentUser } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedJob, setSelectedJob] = useState(null);

  const handleJobClick = (job) => {
    setSelectedJob(job);
    setCurrentPage('details');
  };

  const handleBackToJobs = () => {
    setCurrentPage('dashboard');
    setSelectedJob(null);
  };

  if (currentPage === 'details' && selectedJob) {
    return (
      <DashboardLayout currentPage="dashboard">
        <JobDetails
          job={selectedJob}
          onBack={handleBackToJobs}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout currentPage={currentPage}>
      <JobListings
        jobs={jobOpenings}
        onJobClick={handleJobClick}
        userType={currentUser.role}
      />
    </DashboardLayout>
  );
};

// Root App Component with Auth Provider
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;
