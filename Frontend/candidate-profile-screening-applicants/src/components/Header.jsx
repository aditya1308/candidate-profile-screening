import React from 'react';
import { ArrowLeft } from 'lucide-react';

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
          <nav className="flex items-center space-x-6">
            <a href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
              About
            </a>
            <a href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">
              Contact
            </a>
            {showBackButton && (
              <button 
                onClick={onBackClick} 
                className="flex items-center px-4 py-2 text-sg-red hover:text-sg-red/80 font-medium transition-colors rounded-lg hover:bg-sg-red/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
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
