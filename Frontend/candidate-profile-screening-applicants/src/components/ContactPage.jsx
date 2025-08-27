import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Clock, Send, Building, Globe, Users, AlertCircle, CheckCircle } from 'lucide-react';
import Header from './Header';
import { emailService } from '../services/emailService.js';

const ContactPage = ({ onBackToLanding }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', or null

  // Initialize EmailJS when component mounts
  useEffect(() => {
    emailService.initEmailJS();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    // Clear submit status when user starts typing
    if (submitStatus) setSubmitStatus(null);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.subject) newErrors.subject = 'Please select a subject';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      // Use real EmailJS service
      const result = await emailService.sendContactMessage(formData);
      
      if (result.success) {
        setSubmitStatus('success');
        // Reset form on success
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        setSubmitStatus('error');
        setErrors(prev => ({ ...prev, submit: result.error }));
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setSubmitStatus('error');
      setErrors(prev => ({ ...prev, submit: 'Failed to send message. Please try again.' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-accent-50">
      <Header 
        showBackButton={true}
        onBackClick={onBackToLanding}
      />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">Have questions about our services or want to learn more about joining our team? We'd love to hear from you. Reach out to us through any of the channels below.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-xl text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4"><Mail className="w-8 h-8 text-primary-600" /></div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Email Us</h3>
            <p className="text-gray-600 mb-4">Send us a message and we'll get back to you within 24 hours.</p>
            <a href="mailto:gsc-recruitment-support@socgen.com" className="text-primary-600 hover:text-primary-700 font-medium">gsc-recruitment-support@socgen.com</a>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-xl text-center">
            <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4"><Phone className="w-8 h-8 text-accent-600" /></div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Call Us</h3>
            <p className="text-gray-600 mb-4">Speak directly with our team during business hours.</p>
            <a href="tel:+918028037000" className="text-accent-600 hover:text-accent-700 font-medium">+91 80 2803 7000</a>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-xl text-center">
            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4"><MapPin className="w-8 h-8 text-secondary-600" /></div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Visit Us</h3>
            <p className="text-gray-600 mb-4">Drop by our headquarters for a face-to-face meeting.</p>
            <p className="text-secondary-600 font-medium">Voyager Building, 10F, ITPB<br />Whitefield Road<br />560 066 Bangalore</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="bg-white rounded-2xl p-8 shadow-xl lg:order-2 card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            
            {/* Success Message */}
            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-100 border border-green-400 rounded-lg flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-green-800 font-medium">Message sent successfully!</p>
                  <p className="text-green-700 text-sm">We will get back to you soon.</p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {submitStatus === 'error' && errors.submit && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 rounded-lg flex items-start">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-red-800 font-medium">Failed to send message</p>
                  <p className="text-red-700 text-sm">{errors.submit}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <input 
                    type="text" 
                    id="firstName" 
                    name="firstName" 
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`input-field ${errors.firstName ? 'border-red-500' : ''}`}
                    placeholder="Enter your first name" 
                    required 
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  <input 
                    type="text" 
                    id="lastName" 
                    name="lastName" 
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`input-field ${errors.lastName ? 'border-red-500' : ''}`}
                    placeholder="Enter your last name" 
                    required 
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="Enter your email" 
                  required 
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                <select 
                  id="subject" 
                  name="subject" 
                  value={formData.subject}
                  onChange={handleInputChange}
                  className={`input-field ${errors.subject ? 'border-red-500' : ''}`}
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="careers">Career Opportunities</option>
                  <option value="partnership">Partnership</option>
                  <option value="support">Technical Support</option>
                  <option value="other">Other</option>
                </select>
                {errors.subject && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.subject}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                <textarea 
                  id="message" 
                  name="message" 
                  rows={4} 
                  value={formData.message}
                  onChange={handleInputChange}
                  className={`input-field ${errors.message ? 'border-red-500' : ''}`}
                  placeholder="Tell us how we can help you..." 
                  required
                ></textarea>
                {errors.message && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.message}
                  </p>
                )}
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="btn-primary w-full py-3 text-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 mr-2 border-b-2 border-white rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
          <div className="space-y-8 lg:order-1">
            <div className="bg-white rounded-2xl p-8 shadow-xl card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Office Hours</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3"><Clock className="w-5 h-5 text-primary-600" /><div><p className="font-medium text-gray-900">Monday - Friday</p><p className="text-gray-600">9:00 AM - 6:00 PM IST</p></div></div>
                <div className="flex items-center space-x-3"><Clock className="w-5 h-5 text-primary-600" /><div><p className="font-medium text-gray-900">Saturday</p><p className="text-gray-600">10:00 AM - 4:00 PM IST</p></div></div>
                <div className="flex items-center space-x-3"><Clock className="w-5 h-5 text-primary-600" /><div><p className="font-medium text-gray-900">Sunday</p><p className="text-gray-600">Closed</p></div></div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-xl card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Global Presence</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3"><Building className="w-5 h-5 text-accent-600" /><div><p className="font-medium text-gray-900">Headquarters</p><p className="text-gray-600">Bangalore, India</p></div></div>
                <div className="flex items-center space-x-3"><Globe className="w-5 h-5 text-accent-600" /><div><p className="font-medium text-gray-900">Regional Offices</p><p className="text-gray-600"> Chennai</p></div></div>
                <div className="flex items-center space-x-3"><Users className="w-5 h-5 text-accent-600" /><div><p className="font-medium text-gray-900">Global Teams</p><p className="text-gray-600">25+ countries worldwide</p></div></div>
              </div>
            </div>
            {/* Emergency Support removed as per requirement */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;


