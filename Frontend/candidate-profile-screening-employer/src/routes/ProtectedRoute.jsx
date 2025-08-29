import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export const ProtectedRoute = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-sg-red font-semibold text-lg">Loading...</div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!user || !isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
