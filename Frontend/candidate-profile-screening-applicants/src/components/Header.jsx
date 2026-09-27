import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, LogIn, Briefcase } from 'lucide-react';
import { candidateStorageService } from '../services/candidateStorageService';
import { useNavigate } from 'react-router-dom';

const Header = ({ 
  showNavigation = true, 
  showBackButton = false, 
  backButtonText = "Back to Home",
  onBackClick,
  className = ""
}) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const handleLogoClick = () => {
    window.location.href = '/';
  };

  const user = candidateStorageService.getUser();

  const handleLogout = () => {
    candidateStorageService.clear();
    window.location.href = '/';
  };

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
    <header className={`fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-lg border-accent-200 ${className}`}>
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <div className="flex items-center space-x-4">
            <img 
              src="/src/assets/Societe-Generale-Logo.png" 
              alt="Société Générale"
              className="w-auto h-16 transition-opacity duration-200 cursor-pointer hover:opacity-80"
              onClick={handleLogoClick}
            />
          </div>
        </div>
        
        {showNavigation && (
          <nav className="flex items-center space-x-4 sm:space-x-6">
            <a href="/about" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
              About
            </a>
            <a href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
              Contact
            </a>
            
            {user && (
              <a href="/candidate/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium flex items-center">
                Job Applications
              </a>
            )}

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center p-2 space-x-3 transition-colors duration-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sg-red/50"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-sg-red">
                    <span className="text-sm font-semibold text-white">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'C'}
                    </span>
                  </div>
                  
                  <div className="text-left hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">Signed in</p>
                  </div>
                  
                  <svg 
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 z-50 w-48 py-2 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    
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
            ) : (
              <a
                href="/candidate/login"
                className="flex items-center px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white bg-sg-red hover:bg-sg-red/90 rounded-lg transition-all shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5 mr-1.5" />
                Candidate Login
              </a>
            )}
            {showBackButton && (
              <button 
                onClick={onBackClick} 
                className="flex items-center px-3 sm:px-4 py-2 text-sg-red hover:text-sg-red/80 font-medium transition-colors rounded-lg hover:bg-sg-red/10 text-xs sm:text-sm"
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                {backButtonText}
              </button>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;