import { Mail, Phone, MapPin, Clock, Send, Building, Globe, Users } from 'lucide-react';

const ContactPage = ({ onBackToLanding }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-accent-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-secondary-900 rounded-lg flex items-center justify-center"><span className="text-white font-bold text-lg">SG</span></div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Société Générale</h1>
                <p className="text-sm text-gray-600">Contact Us</p>
              </div>
            </div>
            <button onClick={onBackToLanding} className="text-primary-600 hover:text-primary-700 font-medium transition-colors">← Back to Home</button>
          </div>
        </div>
      </header>

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
            <a href="mailto:info@techcorp.com" className="text-primary-600 hover:text-primary-700 font-medium">info@techcorp.com</a>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-xl text-center">
            <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4"><Phone className="w-8 h-8 text-accent-600" /></div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Call Us</h3>
            <p className="text-gray-600 mb-4">Speak directly with our team during business hours.</p>
            <a href="tel:+1-555-0123" className="text-accent-600 hover:text-accent-700 font-medium">+1 (555) 012-3456</a>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-xl text-center">
            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4"><MapPin className="w-8 h-8 text-secondary-600" /></div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Visit Us</h3>
            <p className="text-gray-600 mb-4">Drop by our headquarters for a face-to-face meeting.</p>
            <p className="text-secondary-600 font-medium">123 Tech Street<br />San Francisco, CA 94105</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="bg-white rounded-2xl p-8 shadow-xl lg:order-2 card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <input type="text" id="firstName" name="firstName" className="input-field" placeholder="Enter your first name" required />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  <input type="text" id="lastName" name="lastName" className="input-field" placeholder="Enter your last name" required />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input type="email" id="email" name="email" className="input-field" placeholder="Enter your email" required />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                <select id="subject" name="subject" className="input-field" required>
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="careers">Career Opportunities</option>
                  <option value="partnership">Partnership</option>
                  <option value="support">Technical Support</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                <textarea id="message" name="message" rows={4} className="input-field" placeholder="Tell us how we can help you..." required></textarea>
              </div>
              <button type="submit" className="btn-primary w-full py-3 text-lg flex items-center justify-center"><Send className="w-5 h-5 mr-2" />Send Message</button>
            </form>
          </div>
          <div className="space-y-8 lg:order-1">
            <div className="bg-white rounded-2xl p-8 shadow-xl card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Office Hours</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3"><Clock className="w-5 h-5 text-primary-600" /><div><p className="font-medium text-gray-900">Monday - Friday</p><p className="text-gray-600">9:00 AM - 6:00 PM PST</p></div></div>
                <div className="flex items-center space-x-3"><Clock className="w-5 h-5 text-primary-600" /><div><p className="font-medium text-gray-900">Saturday</p><p className="text-gray-600">10:00 AM - 4:00 PM PST</p></div></div>
                <div className="flex items-center space-x-3"><Clock className="w-5 h-5 text-primary-600" /><div><p className="font-medium text-gray-900">Sunday</p><p className="text-gray-600">Closed</p></div></div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-xl card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Global Presence</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3"><Building className="w-5 h-5 text-accent-600" /><div><p className="font-medium text-gray-900">Headquarters</p><p className="text-gray-600">San Francisco, CA</p></div></div>
                <div className="flex items-center space-x-3"><Globe className="w-5 h-5 text-accent-600" /><div><p className="font-medium text-gray-900">Regional Offices</p><p className="text-gray-600">New York, London, Tokyo, Sydney</p></div></div>
                <div className="flex items-center space-x-3"><Users className="w-5 h-5 text-accent-600" /><div><p className="font-medium text-gray-900">Remote Teams</p><p className="text-gray-600">25+ countries worldwide</p></div></div>
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


