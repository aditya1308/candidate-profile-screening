import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { useState, useRef, useEffect } from 'react';
import SGLogo from '../assets/SG.svg';
import { stringUtils } from '../services/utilityService';
import Footer from '../components/Footer';
import { UserPlus } from 'lucide-react';
import { authService } from '../services/authService';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Get email from JWT token if not available in user object
  const getUserEmail = () => {
    if (user?.email) {
      return user.email;
    }
    
    // Try to get email from JWT token directly
    try {
      const token = authService.getToken();
      if (token) {
        const decoded = authService.decodeToken(token);
        return decoded?.sub || decoded?.email || 'No email available';
      }
    } catch (error) {
      console.error('Error extracting email from token:', error);
    }
    
    return 'No email available';
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-lg border-accent-200">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Link to="/dashboard">
            <img src={SGLogo} alt="Societe Generale" className="w-auto h-8 transition-opacity duration-200 cursor-pointer hover:opacity-80" />
          </Link>
        </div>
        {user && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center p-2 space-x-3 transition-colors duration-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sg-red/50"
            >
              {/* User Avatar */}
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-sg-red">
                <span className="text-sm font-semibold text-white">
                  {stringUtils.generateInitials(user.name)}
                </span>
              </div>
              
              {/* User Info */}
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">Signed in</p>
              </div>
              
              {/* Dropdown Arrow */}
              <svg 
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 z-50 w-48 py-2 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                {/* User Info in Dropdown */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{getUserEmail()}</p>
                </div>
                
                {/* Menu Items */}
                <div className="py-1">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 space-x-2 text-sm text-left text-gray-700 transition-colors duration-200 hover:bg-red-50 hover:text-sg-red"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-sg-gray pb-16">
      <Header />
      <main className="pt-16">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
