import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import Layout from './layouts/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import SuperAdminPage from './pages/SuperAdminPage';
import HRJobDetailsPage from './pages/HRJobDetailsPage';
import InterviewerJobDetailsPage from './pages/InterviewerJobDetailsPage';
import InterviewerDashboardPage from './pages/InterviewerDashboardPage';
import { useAuth } from './context/useAuth';
import './App.css';

const RoleBasedJobDetails = () => {
  const { user } = useAuth();
  return user?.role === 'INTERVIEWER' ? <InterviewerJobDetailsPage /> : <HRJobDetailsPage />;
};

const RoleBasedDashboard = () => {
  const { user } = useAuth();
  if (user?.role === 'SUPERADMIN') {
    return <SuperAdminPage />;
  }
  if (user?.role === 'INTERVIEWER') {
    return <InterviewerDashboardPage />;
  }
  return <DashboardPage />;
};

const ProtectedLayout = ({ children }) => {
  return (
    <ProtectedRoute>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  );
};

function App() {
  return (
    <Router future={{ v7_startTransition: true }}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedLayout>
                <RoleBasedDashboard />
              </ProtectedLayout>
            }
          />
          <Route
            path="/jobs/:id"
            element={
              <ProtectedLayout>
                <RoleBasedJobDetails />
              </ProtectedLayout>
            }
          />
          <Route
            path="/onboard"
            element={
              <ProtectedLayout>
                <SuperAdminPage />
              </ProtectedLayout>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
