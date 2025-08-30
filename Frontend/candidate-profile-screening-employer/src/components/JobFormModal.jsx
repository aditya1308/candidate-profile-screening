import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const JobFormModal = ({ isOpen, onClose, onSubmit, job = null, isLoading = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    requiredSkills: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || '',
        description: job.description || '',
        location: job.location || '',
        requiredSkills: job.requiredSkills || ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        location: '',
        requiredSkills: ''
      });
    }
    setErrors({});
  }, [job, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Job title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Job description is required';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (!formData.requiredSkills.trim()) {
      newErrors.requiredSkills = 'Required skills are required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50 p-4 pt-8 pb-8 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col my-4">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-900">
            {job ? 'Edit Job' : 'Create New Job'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content - Scrollable */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 relative">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sg-red focus:border-transparent ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter job title"
                disabled={isLoading}
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sg-red focus:border-transparent ${
                  errors.location ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter job location"
                disabled={isLoading}
              />
              {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Job Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sg-red focus:border-transparent resize-vertical ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter detailed job description"
                disabled={isLoading}
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>

            <div>
              <label htmlFor="requiredSkills" className="block text-sm font-medium text-gray-700 mb-2">
                Required Skills *
              </label>
              <textarea
                id="requiredSkills"
                name="requiredSkills"
                rows={3}
                value={formData.requiredSkills}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sg-red focus:border-transparent resize-vertical ${
                  errors.requiredSkills ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter required skills (e.g., Java, Spring Boot, React, etc.)"
                disabled={isLoading}
              />
              {errors.requiredSkills && <p className="mt-1 text-sm text-red-600">{errors.requiredSkills}</p>}
            </div>
          </div>

          {/* Scroll indicator gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>

          {/* Footer with Buttons - Fixed */}
          <div className="flex-shrink-0 px-4 py-4 border-t bg-gray-50 rounded-b-lg mt-2">
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm text-white bg-sg-red rounded-lg hover:bg-sg-red-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 mr-2 border-b-2 border-white rounded-full animate-spin"></div>
                    {job ? 'Updating...' : 'Creating...'}
                  </div>
                ) : (
                  job ? 'Update Job' : 'Create Job'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobFormModal;
