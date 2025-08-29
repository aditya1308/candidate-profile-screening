import React from 'react';

const Button3D = ({ 
  children, 
  onClick, 
  type = 'button', 
  disabled = false,
  buttonColor = 'bg-blue-500',
  shadowColor = 'bg-blue-700',
  className = '',
  ...props 
}) => {
  return (
    <div className="relative group">
      {/* Shadow layer - positioned to the right and bottom with thicker shadow */}
      <div 
        className={`absolute top-0 left-0 w-full h-full ${shadowColor} transition-all duration-200 group-hover:opacity-0 ${disabled ? 'opacity-50' : ''}`}
        style={{ transform: 'translate(4px, 4px)' }}
      />
      
      {/* Button layer */}
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`
          relative w-full py-4 px-6 text-white font-semibold
          ${buttonColor} 
          transition-all duration-200 
          transform group-hover:translate-x-1 group-hover:translate-y-1
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
        {...props}
      >
        {children}
      </button>
    </div>
  );
};

export default Button3D;
