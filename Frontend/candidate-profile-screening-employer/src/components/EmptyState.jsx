import React from 'react';
import { User } from 'lucide-react';

const EmptyState = ({ activeTabLabel }) => {
  return (
    <div className="p-8 text-center bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full">
        <User className="w-6 h-6 text-gray-400" />
      </div>
      <h3 className="mb-1 text-base font-medium text-gray-900">
        No candidates found
      </h3>
      <p className="text-sm text-gray-600">
        There are no candidates in the {activeTabLabel.toLowerCase()} stage.
      </p>
    </div>
  );
};

export default EmptyState;
