import React, { useState } from 'react';
import { createPortal } from 'react-dom';

const EmailSchedulingModal = ({ 
  show, 
  onClose, 
  onSend, 
  candidateName, 
  candidateEmail, 
  round 
}) => {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);

  // Default email template
  const defaultTemplate = {
    subject: `Interview Invitation - Round ${round}`,
    body: `Dear ${candidateName},

We are pleased to invite you for Round ${round} of the interview process.

Please find the interview details below:
- Round: ${round}
- Date: [To be scheduled]
- Duration: [To be confirmed]

We will contact you shortly to schedule the exact date and time.

Best regards,
HR Team`
  };

  // Set default email template based on round
  React.useEffect(() => {
    if (round) {
      setSubject(defaultTemplate.subject);
      setBody(defaultTemplate.body);
    }
  }, [round, candidateName]);

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) {
      alert('Please fill in both subject and body');
      return;
    }

    setLoading(true);
    try {
      console.log('Sending email with subject:', subject);
      await onSend(subject, body);
      console.log('Email sent successfully!');
      // Reset form
      setSubject('');
      setBody('');
    } catch (error) {
      console.error('Error sending email:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSubject('');
    setBody('');
    onClose();
  };

  console.log('EmailSchedulingModal render:', { show, candidateName, candidateEmail, round });
  if (!show) return null;

  const modalContent = (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[99999] p-4" style={{ zIndex: 99999 }}>
      <div className="bg-white rounded-xl w-full max-w-2xl mx-auto overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-white">
                Schedule Interview Email
              </h2>
              <p className="text-blue-100 text-sm mt-1">
                Round {round} • {candidateName}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:text-blue-100 text-2xl font-bold transition-colors"
            >
              ×
            </button>
          </div>
        </div>

                 {/* Content */}
         <div className="p-4 space-y-4">
           {/* Candidate Info Card */}
           <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-3 rounded-lg border border-blue-100">
             <div className="flex items-center space-x-3">
               <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                 <span className="text-white font-bold text-base">
                   {candidateName.charAt(0).toUpperCase()}
                 </span>
               </div>
               <div>
                 <h3 className="font-semibold text-gray-800 text-sm">{candidateName}</h3>
                 <p className="text-gray-600 text-xs">{candidateEmail}</p>
                 <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                   Round {round}
                 </div>
               </div>
             </div>
           </div>

           {/* Email Form */}
           <div className="space-y-3">
                         {/* Subject Field */}
             <div>
               <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-1">
                 Email Subject *
               </label>
               <input
                 type="text"
                 id="subject"
                 value={subject}
                 onChange={(e) => setSubject(e.target.value)}
                 placeholder="Enter email subject..."
                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
               />
             </div>

             {/* Body Field */}
             <div>
               <label htmlFor="body" className="block text-sm font-semibold text-gray-700 mb-1">
                 Email Body *
               </label>
               <textarea
                 id="body"
                 value={body}
                 onChange={(e) => setBody(e.target.value)}
                 placeholder="Enter email body..."
                 rows={6}
                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical transition-all duration-200"
               />
             </div>
          </div>

                                {/* Action Buttons */}
           <div className="flex justify-end space-x-3 pt-4 pb-3 border-t border-gray-200">
             <button
               onClick={handleClose}
               disabled={loading}
               className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 transition-all duration-200 font-medium"
             >
               Cancel
             </button>
             <button
               onClick={handleSend}
               disabled={loading || !subject.trim() || !body.trim()}
               className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg"
             >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </span>
              ) : (
                'Send Email'
              )}
            </button>
          </div>
                 </div>
       </div>
     </div>
   );

  return createPortal(modalContent, document.body);
};

export default EmailSchedulingModal;
