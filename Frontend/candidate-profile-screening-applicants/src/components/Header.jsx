import React from 'react';
import { ArrowLeft, User, LogIn } from 'lucide-react';
import { candidateStorageService } from '../services/candidateStorageService';

const Header = ({ 
  showNavigation = true, 
  showBackButton = false, 
  backButtonText = "Back to Home",
  onBackClick,
  className = ""
}) => {
  const handleLogoClick = () => {
    window.location.href = '/';
  };

  const user = candidateStorageService.getUser();

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
            {user ? (
              <a
                href="/candidate/dashboard"
                className="flex items-center px-3 py-1.5 text-xs sm:text-sm font-semibold text-sg-red bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200"
              >
                <User className="w-3.5 h-3.5 mr-1.5" />
                {user.name ? user.name.split(' ')[0] : 'Dashboard'}
              </a>
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
