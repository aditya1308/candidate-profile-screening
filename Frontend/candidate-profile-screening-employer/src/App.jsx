import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import Layout from './layouts/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import HRJobDetailsPage from './pages/HRJobDetailsPage';
import InterviewerJobDetailsPage from './pages/InterviewerJobDetailsPage';
import { useAuth } from './context/useAuth';
import './App.css';

const RoleBasedJobDetails = () => {
  const { user } = useAuth();
  return user?.role === 'HR' ? <HRJobDetailsPage /> : <InterviewerJobDetailsPage />;
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
                <DashboardPage />
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
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
