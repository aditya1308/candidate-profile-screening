import React from 'react';

const Header = ({ 
  showNavigation = true, 
  showBackButton = false, 
  backButtonText = "← Back to Home",
  onBackClick,
  className = ""
}) => {
  return (
    <header className={`bg-white shadow-sm border-b border-gray-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src="/src/assets/Societe-Generale-Logo.png" 
              alt="Société Générale Logo"
              className="h-16 w-auto object-contain"
            />
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
                  className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
                >
                  {backButtonText}
                </button>
              )}
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
