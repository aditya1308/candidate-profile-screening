import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Send, MapPin, Clock, Users, Calendar, Building, Briefcase, Award, CheckCircle, Zap, AlertCircle, Info, X } from 'lucide-react';
import { applicationService } from '../services/applicationService.js';
import { useCandidateAuth } from '../context/useCandidateAuth';
import Header from './Header';
import Footer from './Footer';

const ApplicationForm = ({ job, onBack, onSubmit }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useCandidateAuth();
  const candidateIsAuthenticated = isAuthenticated();
  const resumeInputRef = useRef(null);

  const handleLoginToApply = () => {
    navigate('/candidate/login', {
      state: {
        from: { pathname: '/apply' },
        selectedJob: job
      }
    });
  };

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

  const profileValues = {
    name: user?.name?.trim() || '',
    email: user?.email?.trim() || '',
    dateOfBirth: user?.dateOfBirth || user?.dob || '',
    phone: user?.phoneNumber && user.phoneNumber !== '0000000000'
      ? user.phoneNumber.replace(/\D/g, '').slice(-10)
      : ''
  };
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dateOfBirth: '',
    phone: '',
    resume: null
  });
  const [errors, setErrors] = useState({});
  const [autofillError, setAutofillError] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [isFillingDetails, setIsFillingDetails] = useState(false);
  const [isAutofilled, setIsAutofilled] = useState(false);
  const [resumeDetails, setResumeDetails] = useState(null);
  const [consentGiven, setConsentGiven] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('error'); // 'error' or 'success'

  const mismatchedFields = [];
  const normalizeName = (value) => value.trim().replace(/\s+/g, ' ').toLocaleLowerCase();
  const normalizePhone = (value) => value.replace(/\D/g, '').slice(-10);
  const normalizeEmail = (value) => value.trim().toLocaleLowerCase();
  const emailMismatch = Boolean(resumeDetails?.email && profileValues.email
    && normalizeEmail(resumeDetails.email) !== normalizeEmail(profileValues.email));
  if (resumeDetails?.name && profileValues.name
      && normalizeName(resumeDetails.name) !== normalizeName(profileValues.name)) {
    mismatchedFields.push('Full Name');
  }
  if (resumeDetails?.phoneNumber && profileValues.phone
      && normalizePhone(resumeDetails.phoneNumber) !== normalizePhone(profileValues.phone)) {
    mismatchedFields.push('Phone Number');
  }

  const missingFields = [
    ['Full Name', formData.name],
    ['Email', formData.email],
    ['Date of Birth', formData.dateOfBirth],
    ['Phone Number', formData.phone]
  ].filter(([, value]) => !value?.trim()).map(([label]) => label);

  const fieldIssues = {
    name: mismatchedFields.includes('Full Name')
      ? 'The resume name does not match the name on your account. Update your account details or upload a matching resume.'
      : isAutofilled && !formData.name.trim()
        ? 'Full name was not found in the resume or account. Enter it manually.'
        : '',
    email: emailMismatch
      ? 'The email on the resume does not match your account email. Update your account email or upload a resume with the matching email.'
      : isAutofilled && !formData.email.trim()
        ? 'Email was not found in the resume or account. Enter it manually.'
        : isAutofilled && !resumeDetails?.email
          ? 'Email was not found in the resume. Your account email is being used as a fallback.'
      : '',
    dateOfBirth: isAutofilled && !formData.dateOfBirth
      ? 'Date of birth was not found in the resume or account. Enter it manually.'
      : isAutofilled && !resumeDetails?.dateOfBirth
        ? 'Date of birth was not found in the resume. The account value is being used as a fallback.'
      : '',
    phone: mismatchedFields.includes('Phone Number')
      ? 'The resume phone number does not match the number on your account. Update your account details or upload a matching resume.'
      : isAutofilled && !formData.phone.trim()
        ? 'Phone number was not found in the resume or account. Enter it manually.'
        : ''
  };

  const inputClassName = (field, disabled) => (
    `w-full rounded-lg border px-3 py-2 pr-10 text-gray-700 ${
      fieldIssues[field]
        ? field === 'email' && emailMismatch
          ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-300'
          : 'border-yellow-500 bg-yellow-50 focus:border-yellow-500 focus:ring-yellow-300'
        : 'border-gray-300 focus:border-sg-red focus:ring-sg-red'
    } ${disabled ? 'bg-gray-100 text-gray-600 disabled:cursor-not-allowed disabled:opacity-70' : 'bg-white'}`
  );

  const renderFieldIssue = (field) => fieldIssues[field] ? (
    <span className="group absolute right-3 top-1/2 -translate-y-1/2">
      <Info
        className={`h-5 w-5 cursor-help ${field === 'email' && emailMismatch ? 'text-red-700' : 'text-yellow-700'}`}
        aria-label={fieldIssues[field]}
        title={fieldIssues[field]}
        tabIndex={0}
      />
      <span role="tooltip" className="pointer-events-none absolute bottom-full right-0 z-20 mb-2 hidden w-64 rounded-md bg-gray-900 px-3 py-2 text-left text-xs font-normal text-white shadow-lg group-hover:block group-focus-within:block">
        {fieldIssues[field]}
      </span>
    </span>
  ) : null;

  const updateFormField = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: name === 'phone' ? value.replace(/\D/g, '').slice(0, 10) : value
    }));
    setErrors((previous) => ({ ...previous, [name]: '', submit: '' }));
  };

  const resetAutofill = (resume) => {
    setIsAutofilled(false);
    setResumeDetails(null);
    setConsentGiven(false);
    setAutofillError('');
    setFormData({
      name: '',
      email: '',
      dateOfBirth: '',
      phone: '',
      resume
    });
    setErrors((previous) => ({ ...previous, resume: '', submit: '' }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      resetAutofill(null);
      setAutofillError('Unsupported file type. Please upload a PDF resume.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      resetAutofill(null);
      setAutofillError('The PDF must be 5MB or smaller.');
      return;
    }
    resetAutofill(file);
    if (showPopup) setShowPopup(false);
  };

  const handleResumeDrop = (e) => {
    e.preventDefault();
    if (isParsing) return;
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      resetAutofill(null);
      setAutofillError('Unsupported file type. Please upload a PDF resume.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      resetAutofill(null);
      setAutofillError('The PDF must be 5MB or smaller.');
      return;
    }
    resetAutofill(file);
  };

  const handleAutofill = async () => {
    if (!candidateIsAuthenticated || !formData.resume || isParsing) return;
    setAutofillError('');
    setIsParsing(true);
    setIsAutofilled(false);
    setResumeDetails(null);
    setConsentGiven(false);
    try {
      const extracted = await applicationService.autofillResume(formData.resume, job.id);
      const extractedName = extracted.name?.trim() || '';
      const extractedPhone = (extracted.phoneNumber || '').replace(/\D/g, '').slice(-10);
      const extractedDob = extracted.dateOfBirth || extracted.dob || '';
      setResumeDetails({
        name: extractedName,
        phoneNumber: extractedPhone,
        dateOfBirth: extractedDob,
        email: extracted.email?.trim() || ''
      });
      const targetValues = {
        name: extractedName || profileValues.name,
        email: extracted.email?.trim() || profileValues.email,
        dateOfBirth: extractedDob || profileValues.dateOfBirth,
        phone: extractedPhone || profileValues.phone
      };

      setIsFillingDetails(true);
      for (const field of ['name', 'email', 'dateOfBirth', 'phone']) {
        const value = targetValues[field];
        for (let index = 1; index <= value.length; index++) {
          const partialValue = value.slice(0, index);
          setFormData((previous) => ({ ...previous, [field]: partialValue }));
          await new Promise((resolve) => setTimeout(resolve, 22));
        }
        await new Promise((resolve) => setTimeout(resolve, 120));
      }
      setIsFillingDetails(false);
      setIsAutofilled(true);
    } catch (error) {
      setAutofillError(error.message || 'Resume information could not be extracted. Please try again or upload another PDF.');
    } finally {
      setIsFillingDetails(false);
      setIsParsing(false);
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
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else {
      // Check if it's more than 10 digits
      if (formData.phone.length > 10) {
        newErrors.phone = 'Enter valid phone number';
      } else if (formData.phone.length < 10) {
        newErrors.phone = 'Phone number must be exactly 10 digits';
      } else if (!/^\d{10}$/.test(formData.phone)) {
        newErrors.phone = 'Phone number must contain only digits';
      }
    }
    if (!formData.resume) newErrors.resume = 'Resume is required';
    if (!consentGiven) newErrors.consent = 'Please agree to the processing of your personal data';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!candidateIsAuthenticated) return;
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      // Prepare application data for backend
      const applicationData = {
        ...formData,
        jobId: job.id,
        appliedDate: new Date().toISOString(),
        consent: consentGiven
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
      <Header showBackButton={true} backButtonText="Home" onBackClick={onBack} />
      
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
                  <div className="px-3 py-1 text-sm font-medium border rounded-full bg-green-500/10 text-green-600 border-green-500/20 ml-4 flex-shrink-0">Active</div>
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
                      {job.requiredSkills.split(/[\n,]+/).map(skill => skill.trim()).filter(skill => skill.length > 0).map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 text-xs font-medium border rounded-full text-sg-red bg-sg-red/10 border-sg-red/20"
                        >
                          {skill}
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
                <div className="mb-6 flex items-center justify-between gap-4">
                  <h2 className="text-xl font-semibold text-gray-900">Application Form</h2>
                  {!candidateIsAuthenticated && (
                    <button
                      type="button"
                      onClick={handleLoginToApply}
                      className="shrink-0 rounded-lg bg-sg-red px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-sg-red/90 focus:outline-none focus:ring-2 focus:ring-sg-red focus:ring-offset-2"
                    >
                      Login / Register
                    </button>
                  )}
                </div>
                {!candidateIsAuthenticated && (
                  <p className="mb-5 rounded-lg border border-gray-200 bg-gray-100 p-3 text-sm text-gray-600">
                    Sign in or register to complete and submit your application. You can review the job details while browsing.
                  </p>
                )}
                <form onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-6">
                  <fieldset
                    disabled={!candidateIsAuthenticated}
                    className="m-0 flex min-w-0 flex-1 flex-col space-y-6 border-0 p-0 disabled:opacity-50"
                  >
                  <div className="flex flex-1 flex-col gap-6">
                    {/* Resume upload and autofill */}
                    <section className="flex flex-1 flex-col">
                      <label htmlFor="resume" className="mb-3 block text-sm font-medium text-gray-700">
                        Resume/CV <span className="text-xs font-normal text-gray-500">(Mandatory)</span>
                      </label>
                      <div
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={handleResumeDrop}
                        className="flex flex-1 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-6 text-center transition-colors hover:border-sg-red"
                      >
                        <Upload className="mb-2 h-10 w-10 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label htmlFor="resume" className="cursor-pointer font-medium text-sg-red hover:text-sg-red/80">
                            <span>{formData.resume ? 'Replace file' : 'Upload a PDF'}</span>
                            <input
                              ref={resumeInputRef}
                              id="resume"
                              name="resume"
                              type="file"
                              accept="application/pdf,.pdf"
                              disabled={isParsing}
                              onChange={handleFileChange}
                              className="sr-only"
                            />
                          </label>
                          <span className="pl-1">or drag and drop</span>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">PDF up to 5MB</p>
                        {formData.resume && (
                          <div className="mt-3 flex items-center gap-3">
                            <span className="max-w-full truncate text-sm font-medium text-green-700">{formData.resume.name}</span>
                            <button
                              type="button"
                              disabled={isParsing}
                              onClick={() => {
                                resetAutofill(null);
                                if (resumeInputRef.current) resumeInputRef.current.value = '';
                              }}
                              className="text-sm font-medium text-sg-red hover:underline"
                            >
                              Remove
                            </button>
                          </div>
                        )}
                      </div>
                      {errors.resume && (
                        <p className="mt-1 text-sm text-red-500">
                          <AlertCircle className="mr-1 inline-block h-4 w-4" /> {errors.resume}
                        </p>
                      )}
                      <button
                        type="button"
                        onClick={handleAutofill}
                        disabled={!formData.resume || !candidateIsAuthenticated || isParsing}
                        className="mt-4 w-full rounded-lg bg-sg-red px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-sg-red/90 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isFillingDetails ? 'Filling details...' : isParsing ? 'Parsing resume...' : 'Autofill Info'}
                      </button>
                      {autofillError && (
                        <p role="alert" className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                          <AlertCircle className="mr-1 inline-block h-4 w-4" /> {autofillError}
                        </p>
                      )}
                    </section>

                    {/* Personal information */}
                    <section className="flex-1">
                      <div className="grid grid-cols-1 gap-5">
                        <div>
                          <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
                            Full Name <span className="text-xs font-normal text-gray-500">(Mandatory)</span>
                          </label>
                          <div className="relative">
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={updateFormField}
                            disabled={!isAutofilled || Boolean(resumeDetails?.name || profileValues.name)}
                            className={inputClassName('name', !isAutofilled || Boolean(resumeDetails?.name || profileValues.name))}
                            placeholder="Filled after resume autofill"
                          />
                            {renderFieldIssue('name')}
                          </div>
                        </div>
                        <div>
                          <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                            Email Address <span className="text-xs font-normal text-gray-500">(Mandatory)</span>
                          </label>
                          <div className="relative">
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={updateFormField}
                            disabled={!isAutofilled || Boolean(resumeDetails?.email || profileValues.email)}
                            className={inputClassName('email', !isAutofilled || Boolean(resumeDetails?.email || profileValues.email))}
                            placeholder="Your account email"
                          />
                            {renderFieldIssue('email')}
                          </div>
                        </div>
                        <div>
                          <label htmlFor="dateOfBirth" className="mb-2 block text-sm font-medium text-gray-700">
                            Date of Birth <span className="text-xs font-normal text-gray-500">(Mandatory)</span>
                          </label>
                          <div className="relative">
                          <input
                            type="date"
                            id="dateOfBirth"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={updateFormField}
                            disabled={!isAutofilled || Boolean(resumeDetails?.dateOfBirth || profileValues.dateOfBirth)}
                            min="1950-01-01"
                            max={new Date().toISOString().split('T')[0]}
                            className={inputClassName('dateOfBirth', !isAutofilled || Boolean(resumeDetails?.dateOfBirth))}
                          />
                            {renderFieldIssue('dateOfBirth')}
                          </div>
                        </div>
                        <div>
                          <label htmlFor="phone" className="mb-2 block text-sm font-medium text-gray-700">
                            Phone Number <span className="text-xs font-normal text-gray-500">(Mandatory)</span>
                          </label>
                          <div className="relative">
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={updateFormField}
                            disabled={!isAutofilled || Boolean(resumeDetails?.phoneNumber || profileValues.phone)}
                            className={inputClassName('phone', !isAutofilled || Boolean(resumeDetails?.phoneNumber || profileValues.phone))}
                            placeholder="Filled after resume autofill"
                          />
                            {renderFieldIssue('phone')}
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>

                  {isAutofilled && (
                    <div className="pt-1">
                      <label className="flex items-start gap-3 text-sm text-gray-700">
                        <input
                          type="checkbox"
                          checked={consentGiven}
                          onChange={(event) => setConsentGiven(event.target.checked)}
                          className="mt-1 h-4 w-4 rounded border-gray-300 text-sg-red focus:ring-sg-red"
                        />
                        <span>
                          I agree to the processing of my personal data for this job application.
                          <span className="ml-1 text-xs text-gray-500">(Mandatory)</span>
                        </span>
                      </label>
                      {errors.consent && <p className="mt-1 text-sm text-red-500">{errors.consent}</p>}
                    </div>
                  )}
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
                        disabled={isSubmitting || isParsing || !candidateIsAuthenticated || !isAutofilled || missingFields.length > 0 || emailMismatch || !consentGiven || !formData.name.trim() || !formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email) || !formData.dateOfBirth || !/^\d{10}$/.test(formData.phone) || !formData.resume}
                        className="relative w-full py-4 px-6 text-white font-semibold bg-sg-red hover:bg-sg-red/90 transition-all duration-200 transform group-hover:translate-x-1 group-hover:translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sg-red disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center">
                            <div className="w-4 h-4 mr-2 border-b-2 border-white rounded-full animate-spin"></div>
                            Submitting...
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            <Send className="w-4 h-4 mr-2" />
                            Submit Application
                          </div>
                        )}
                      </button>
                    </div>
                  </div>
                  </fieldset>
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
