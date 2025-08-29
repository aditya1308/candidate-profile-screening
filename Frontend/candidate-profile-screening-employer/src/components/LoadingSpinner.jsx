import React from 'react';

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-8 h-8 border-b-2 rounded-full animate-spin border-sg-red"></div>
      <span className="ml-2 text-gray-600">{message}</span>
    </div>
  );
};

export default LoadingSpinner;
