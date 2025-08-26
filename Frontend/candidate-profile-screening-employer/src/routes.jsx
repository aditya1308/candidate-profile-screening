import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AuthForm from './components/AuthForm';
import DashboardLayout from './components/DashboardLayout';
import JobListings from './components/JobListings';
import JobDetails from './components/JobDetails';
import { useState } from 'react';
import { jobOpenings } from '../../shared/data/mockData';

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
        <JobDetails job={selectedJob} onBack={handleBackToJobs} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout currentPage={currentPage}>
      <JobListings jobs={jobOpenings} onJobClick={handleJobClick} userType={currentUser.role} />
    </DashboardLayout>
  );
};

export default function AppRoutes() {
  const { currentUser } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={currentUser ? <Navigate to="/dashboard" replace /> : <Navigate to="/auth" replace />}
      />

      <Route
        path="/auth"
        element={currentUser ? <Navigate to="/dashboard" replace /> : <AuthForm />}
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['talent-acquisition', 'interview-team']}>
            <InternalTeamRoutes />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={currentUser ? <Navigate to="/dashboard" replace /> : <Navigate to="/auth" replace />} />
    </Routes>
  );
}


