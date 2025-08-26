import { useState } from 'react';
import { ArrowLeft, Upload, Send, MapPin, Clock, DollarSign, Users, Calendar, Building, Briefcase, Award, CheckCircle, Zap } from 'lucide-react';

const ApplicationForm = ({ job, onBack, onSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    experience: '',
    coverLetter: '',
    resume: null
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
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
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.experience.trim()) newErrors.experience = 'Experience is required';
    if (!formData.coverLetter.trim()) newErrors.coverLetter = 'Cover letter is required';
    if (!formData.resume) newErrors.resume = 'Resume is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      onSubmit({ ...formData, jobId: job.id, appliedDate: new Date().toISOString(), status: 'Submitted' });
    } catch (error) {
      console.error('Error submitting application:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="px-6 mx-auto max-w-7xl">
        <div className="mb-8">
          <button onClick={onBack} className="flex items-center mb-4 text-gray-600 transition-colors hover:text-gray-900">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Jobs
          </button>
        </div>
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <div className="space-y-6">
            <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="mb-2 text-2xl font-bold text-gray-900">{job.title}</h1>
                  <p className="mb-3 text-lg text-gray-600">{job.company}</p>
                </div>
                <div className="px-3 py-1 text-sm font-medium rounded-full bg-primary-100 text-primary-800">{job.status}</div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center space-x-2"><MapPin className="w-4 h-4 text-gray-500" /><span className="text-sm text-gray-600">{job.location}</span></div>
                <div className="flex items-center space-x-2"><Clock className="w-4 h-4 text-gray-500" /><span className="text-sm text-gray-600">{job.type}</span></div>
                <div className="flex items-center space-x-2"><Users className="w-4 h-4 text-gray-500" /><span className="text-sm text-gray-600">{job.experience}</span></div>
                <div className="flex items-center space-x-2"><DollarSign className="w-4 h-4 text-gray-500" /><span className="text-sm text-gray-600">{job.salary}</span></div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500"><Calendar className="w-4 h-4" /><span>Posted on {new Date(job.postedDate).toLocaleDateString()}</span><span>•</span><span>{job.applications} applications</span></div>
            </div>
            <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl card">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Job Description</h2>
              <p className="mb-6 leading-relaxed text-gray-600">{job.description}</p>
              <div className="space-y-4">
                <div>
                  <h3 className="flex items-center mb-3 font-semibold text-gray-900"><CheckCircle className="w-5 h-5 mr-2 text-primary-600" />Requirements</h3>
                  <ul className="space-y-2">
                    {job.requirements.map((req, index) => (
                      <li key={index} className="flex items-start space-x-2"><span className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-primary-400"></span><span className="text-sm text-gray-600">{req}</span></li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="flex items-center mb-3 font-semibold text-gray-900"><Briefcase className="w-5 h-5 mr-2 text-accent-600" />Responsibilities</h3>
                  <ul className="space-y-2">
                    {job.responsibilities.map((resp, index) => (
                      <li key={index} className="flex items-start space-x-2"><span className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-accent-400"></span><span className="text-sm text-gray-600">{resp}</span></li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            {/* About, Benefits & Perks removed to streamline to job-only details */}
          </div>
          <div className="p-8 bg-white border border-gray-200 shadow-sm card h-full flex flex-col">
            <h2 className="mb-6 text-2xl font-semibold text-gray-900">Application Form</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="fullName" className="block mb-2 text-sm font-medium text-gray-700">Full Name *</label>
                  <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} className={`input-field ${errors.fullName ? 'border-red-500' : ''}`} placeholder="Enter your full name" />
                  {errors.fullName && (<p className="mt-1 text-sm text-red-500">{errors.fullName}</p>)}
                </div>
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">Email Address *</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className={`input-field ${errors.email ? 'border-red-500' : ''}`} placeholder="Enter your email" />
                  {errors.email && (<p className="mt-1 text-sm text-red-500">{errors.email}</p>)}
                </div>
                <div>
                  <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-700">Phone Number *</label>
                  <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} className={`input-field ${errors.phone ? 'border-red-500' : ''}`} placeholder="Enter your phone number" />
                  {errors.phone && (<p className="mt-1 text-sm text-red-500">{errors.phone}</p>)}
                </div>
                <div>
                  <label htmlFor="experience" className="block mb-2 text-sm font-medium text-gray-700">Years of Experience *</label>
                  <input type="text" id="experience" name="experience" value={formData.experience} onChange={handleInputChange} className={`input-field ${errors.experience ? 'border-red-500' : ''}`} placeholder="e.g., 3 years" />
                  {errors.experience && (<p className="mt-1 text-sm text-red-500">{errors.experience}</p>)}
                </div>
              </div>
              <div>
                <label htmlFor="coverLetter" className="block mb-2 text-sm font-medium text-gray-700">Cover Letter *</label>
                <textarea id="coverLetter" name="coverLetter" value={formData.coverLetter} onChange={handleInputChange} rows={6} className={`input-field ${errors.coverLetter ? 'border-red-500' : ''}`} placeholder="Tell us why you're interested in this position and why you'd be a great fit..."></textarea>
                {errors.coverLetter && (<p className="mt-1 text-sm text-red-500">{errors.coverLetter}</p>)}
              </div>
              <div>
                <label htmlFor="resume" className="block mb-2 text-sm font-medium text-gray-700">Resume/CV *</label>
                <div className="flex justify-center px-6 pt-5 pb-6 mt-1 transition-colors border-2 border-gray-300 border-dashed rounded-lg hover:border-primary-400">
                  <div className="space-y-1 text-center">
                    <Upload className="w-12 h-12 mx-auto text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="resume" className="relative font-medium bg-white rounded-md cursor-pointer text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                        <span>Upload a file</span>
                        <input id="resume" name="resume" type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="sr-only" />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PDF, DOC, or DOCX up to 5MB</p>
                    {formData.resume && (<p className="text-sm font-medium text-green-600">✓ {formData.resume.name}</p>)}
                  </div>
                </div>
                {errors.resume && (<p className="mt-1 text-sm text-red-500">{errors.resume}</p>)}
              </div>
              <div className="pt-6">
                <button type="submit" disabled={isSubmitting} className="flex items-center justify-center w-full py-3 text-lg btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
                  {isSubmitting ? (<><div className="w-5 h-5 mr-2 border-b-2 border-white rounded-full animate-spin"></div>Submitting...</>) : (<><Send className="w-5 h-5 mr-2" />Submit Application</>)}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;


