import { useState } from 'react';
import { ArrowLeft, Upload, Send, MapPin, Clock, Users, Calendar, Building, Briefcase, Award, CheckCircle, Zap, AlertCircle, X } from 'lucide-react';
import { applicationService } from '../services/applicationService.js';
import Header from './Header';
import Footer from './Footer';

const ApplicationForm = ({ job, onBack, onSubmit }) => {
  // Helper function to format date safely
  const formatPostedDate = (dateString) => {
    if (!dateString) return 'Recently';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Recently';
      }
      return date.toLocaleDateString('en-IN', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Recently';
    }
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dateOfBirth: '',
    phone: '',
    resume: null
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('error'); // 'error' or 'success'

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    // Clear submit error when user starts typing
    if (errors.submit) setErrors(prev => ({ ...prev, submit: '' }));
    // Clear popup when user starts typing
    if (showPopup) setShowPopup(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, resume: 'File size must be less than 5MB' }));
        return;
      }
      setFormData(prev => ({ ...prev, resume: file }));
      setErrors(prev => ({ ...prev, resume: '' }));
      // Clear submit error when user uploads a new file
      if (errors.submit) setErrors(prev => ({ ...prev, submit: '' }));
      // Clear popup when user uploads a new file
      if (showPopup) setShowPopup(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email address';
    
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else {
      // Validate date format (YYYY-MM-DD)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(formData.dateOfBirth)) {
        newErrors.dateOfBirth = 'Please enter date in YYYY-MM-DD format';
      } else {
        const date = new Date(formData.dateOfBirth);
        if (isNaN(date.getTime())) {
          newErrors.dateOfBirth = 'Please enter a valid date';
        } else {
          const currentYear = new Date().getFullYear();
          const birthYear = parseInt(formData.dateOfBirth.split('-')[0]);
          if (birthYear < 1950 || birthYear > currentYear) {
            newErrors.dateOfBirth = 'Birth year must be between 1950 and current year';
          }
        }
      }
    }
    
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.resume) newErrors.resume = 'Resume is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      // Prepare application data for backend
      const applicationData = {
        ...formData,
        jobId: job.id,
        appliedDate: new Date().toISOString()
      };

      // Submit to backend API
      const result = await applicationService.submitApplication(applicationData);
      
      if (result.success) {
        onSubmit({ 
          ...formData, 
          jobId: job.id, 
          appliedDate: new Date().toISOString(), 
          applicationId: result.applicationId,
          candidateId: result.candidateId
        });
      } else {
        // Check if it's a duplicate application error
        if (result.error && result.error.includes('already exists for this job description')) {
          setPopupMessage('You have already applied to this job');
          setPopupType('error');
          setShowPopup(true);
        } else {
          // Display other errors in the form
          setErrors(prev => ({ ...prev, submit: result.error }));
        }
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      setErrors(prev => ({ ...prev, submit: 'Failed to submit application. Please try again.' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-sg-gray pb-16">
      <Header showBackButton={true} backButtonText="← Back to Home" onBackClick={onBack} />
      
      <main className="pt-16">
        <div className="px-6 mx-auto max-w-7xl py-6">
          {/* Main Layout: Job Info on Left, Application Form on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left Column: Job Details and Description */}
            <div className="lg:col-span-2 space-y-6">
              {/* Job Details Card */}
              <div className="p-6 bg-white border border-gray-200 shadow-lg rounded-lg transition-all duration-300 hover:-translate-y-1 shadow-gray-400/40 hover:shadow-xl hover:shadow-gray-500/50">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="mb-2 text-2xl font-bold text-gray-900 line-clamp-2">{job.title}</h1>
                    <p className="mb-3 text-lg text-gray-600">Société Générale</p>
                  </div>
                  <div className="px-3 py-1 text-sm font-medium border rounded-full bg-sg-red/10 text-sg-red border-sg-red/20 ml-4 flex-shrink-0">Active</div>
                </div>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{job.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600">Full-time</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600">2-5 years</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span>Posted on {formatPostedDate(job.postedDate)}</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500">• Open for applications</div>
              </div>
              
              {/* Job Description Card */}
              <div className="p-6 bg-white border border-gray-200 shadow-lg rounded-lg transition-all duration-300 hover:-translate-y-1 shadow-gray-400/40 hover:shadow-xl hover:shadow-gray-500/50">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">Job Description</h2>
                <p className="mb-4 leading-relaxed text-gray-600 text-sm">{job.description}</p>
                <div>
                  <h3 className="flex items-center mb-3 font-semibold text-gray-900 text-sm">
                    <CheckCircle className="w-4 h-4 mr-2 text-sg-red flex-shrink-0" />
                    Required Skills
                  </h3>
                  {job.requiredSkills ? (
                    <div className="flex flex-wrap gap-2">
                      {job.requiredSkills.split(',').map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 text-xs font-medium border rounded-full text-sg-red bg-sg-red/10 border-sg-red/20"
                        >
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <ul className="space-y-2">
                      <li className="flex items-start space-x-2">
                        <span className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-sg-red"></span>
                        <span className="text-sm text-gray-600">Strong problem-solving skills</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-sg-red"></span>
                        <span className="text-sm text-gray-600">Excellent communication abilities</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-sg-red"></span>
                        <span className="text-sm text-gray-600">Strong analytical thinking</span>
                      </li>
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Application Form */}
            <div className="lg:col-span-3">
              <div className="p-6 bg-white border border-gray-200 shadow-lg rounded-lg transition-all duration-300 hover:-translate-y-1 shadow-gray-400/40 hover:shadow-xl hover:shadow-gray-500/50 sticky top-6 h-full min-h-[600px] flex flex-col">
                <h2 className="mb-6 text-xl font-semibold text-gray-900">Application Form</h2>
                <form onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-6">
                  {/* Personal Information */}
                  <div className="grid grid-cols-1 gap-5">
                    <div>
                      <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">Full Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sg-red focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-500">
                          <AlertCircle className="w-4 h-4 mr-1 inline-block" /> {errors.name}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">Email Address *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sg-red focus:border-transparent"
                        placeholder="Enter your email address"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-500">
                          <AlertCircle className="w-4 h-4 mr-1 inline-block" /> {errors.email}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="dateOfBirth" className="block mb-2 text-sm font-medium text-gray-700">Date of Birth *</label>
                      <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        min="1950-01-01"
                        max={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sg-red focus:border-transparent"
                      />
                      
                      {errors.dateOfBirth && (
                        <p className="mt-1 text-sm text-red-500">
                          <AlertCircle className="w-4 h-4 mr-1 inline-block" /> {errors.dateOfBirth}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-700">Phone Number *</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sg-red focus:border-transparent"
                        placeholder="Enter your phone number"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-500">
                          <AlertCircle className="w-4 h-4 mr-1 inline-block" /> {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Resume Upload */}
                  <div className="flex-1 flex flex-col">
                    <label htmlFor="resume" className="block mb-3 text-sm font-medium text-gray-700">Resume/CV *</label>
                    <div className="flex-1 flex justify-center items-center px-6 py-8 transition-colors border-2 border-gray-300 border-dashed rounded-lg hover:border-sg-red bg-gray-50">
                      <div className="space-y-1 text-center">
                        <Upload className="w-10 h-10 mx-auto text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label htmlFor="resume" className="relative font-medium bg-white rounded-md cursor-pointer text-sg-red hover:text-sg-red/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-sg-red">
                            <span>Upload a file</span>
                            <input id="resume" name="resume" type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="sr-only" />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PDF, DOC, or DOCX up to 5MB</p>
                        {formData.resume && (
                          <p className="text-sm font-medium text-green-600">✓ {formData.resume.name}</p>
                        )}
                      </div>
                    </div>
                    {errors.resume && (
                      <p className="mt-1 text-sm text-red-500">
                        <AlertCircle className="w-4 h-4 mr-1 inline-block" /> {errors.resume}
                      </p>
                    )}
                  </div>
                  
                  {errors.submit && (
                    <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-400 rounded-lg flex items-start">
                      <AlertCircle className="w-4 h-4 mr-2 text-red-500" />
                      {errors.submit}
                    </div>
                  )}
                  
                  <div className="pt-4 mt-auto">
                    <div className="relative group">
                      {/* Shadow layer */}
                      <div 
                        className={`absolute top-0 left-0 w-full h-full bg-black transition-all duration-200 group-hover:opacity-0 ${isSubmitting ? 'opacity-50' : ''}`}
                        style={{ transform: 'translate(4px, 4px)' }}
                      />
                      
                      {/* Button layer */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="relative w-full py-4 px-6 text-white font-semibold bg-sg-red hover:bg-sg-red/90 transition-all duration-200 transform group-hover:translate-x-1 group-hover:translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sg-red disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 mr-2 border-b-2 border-white rounded-full animate-spin"></div>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Submit Application
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      
      {/* Popup Notification */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`bg-white rounded-lg shadow-xl max-w-md w-full p-6 ${popupType === 'error' ? 'border-l-4 border-sg-red' : 'border-l-4 border-green-500'}`}>
            <div className="flex items-start">
              <div className={`flex-shrink-0 ${popupType === 'error' ? 'text-sg-red' : 'text-green-500'}`}>
                {popupType === 'error' ? (
                  <AlertCircle className="w-6 h-6" />
                ) : (
                  <CheckCircle className="w-6 h-6" />
                )}
              </div>
              <div className="ml-3 flex-1">
                <h3 className={`text-lg font-medium ${popupType === 'error' ? 'text-red-800' : 'text-green-800'}`}>
                  {popupType === 'error' ? 'Application Error' : 'Success'}
                </h3>
                <p className={`mt-2 text-sm ${popupType === 'error' ? 'text-red-700' : 'text-green-700'}`}>
                  {popupMessage}
                </p>
              </div>
              <button
                onClick={() => setShowPopup(false)}
                className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowPopup(false)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  popupType === 'error' 
                    ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                }`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationForm;


