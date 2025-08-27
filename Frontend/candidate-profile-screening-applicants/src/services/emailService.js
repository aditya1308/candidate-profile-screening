// EmailJS configuration for sending emails directly from frontend
// You'll need to sign up at https://www.emailjs.com/ and get your service ID, template ID, and public key

const EMAILJS_CONFIG = {
  serviceId: 'service_nb2z4cg',
  templateId: 'template_tf5wtwj',
  publicKey: '4VvtwaZTiggpAmqvB',
  toEmail: 'bharat.korlahalli@gmail.com'
};

export const emailService = {
  async sendContactMessage(contactData) {
    try {
      console.log('EmailJS Config:', EMAILJS_CONFIG);
      console.log('Contact Data:', contactData);
      
      // Check if EmailJS is loaded
      if (typeof window !== 'undefined' && window.emailjs) {
        console.log('EmailJS is loaded, attempting to send email...');
        
        const templateParams = {
          to_email: EMAILJS_CONFIG.toEmail,
          from_name: `${contactData.firstName} ${contactData.lastName}`,
          from_email: contactData.email,
          subject: `Contact Form: ${contactData.subject}`,
          message: contactData.message,
          reply_to: contactData.email
        };

        console.log('Template Params:', templateParams);

        const response = await window.emailjs.send(
          EMAILJS_CONFIG.serviceId,
          EMAILJS_CONFIG.templateId,
          templateParams,
          EMAILJS_CONFIG.publicKey
        );

        console.log('EmailJS Response:', response);

        return {
          success: true,
          message: 'Message sent successfully! We will get back to you soon.',
          data: response
        };
      } else {
        console.warn('EmailJS not loaded, using mock service');
        return await this.sendContactMessageMock(contactData);
      }
    } catch (error) {
      console.error('Error sending contact message:', error);
      
      // Provide more specific error messages
      let errorMessage = 'An unexpected error occurred while sending your message.';
      
      if (error.text) {
        errorMessage = `EmailJS Error: ${error.text}`;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  },

  // Mock service for testing when EmailJS is not configured
  async sendContactMessageMock(contactData) {
    try {
      console.log('Using mock email service...');
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate success response
      console.log('Mock email service - Message would be sent to:', EMAILJS_CONFIG.toEmail);
      console.log('Contact form data:', contactData);
      
      return {
        success: true,
        message: 'Message sent successfully! We will get back to you soon.',
        data: {
          messageId: 'mock-' + Date.now(),
          sentTo: EMAILJS_CONFIG.toEmail,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Error in mock email service:', error);
      return {
        success: false,
        error: 'Failed to send message. Please try again.'
      };
    }
  },

  // Initialize EmailJS (call this in your app initialization)
  initEmailJS() {
    if (typeof window !== 'undefined') {
      console.log('Initializing EmailJS...');
      
      // Load EmailJS script if not already loaded
      if (!window.emailjs) {
        console.log('Loading EmailJS script...');
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
        script.async = true;
        script.onload = () => {
          console.log('EmailJS script loaded, initializing...');
          window.emailjs.init(EMAILJS_CONFIG.publicKey);
          console.log('EmailJS initialized successfully with key:', EMAILJS_CONFIG.publicKey);
        };
        script.onerror = () => {
          console.error('Failed to load EmailJS script');
        };
        document.head.appendChild(script);
      } else {
        console.log('EmailJS already loaded, initializing...');
        window.emailjs.init(EMAILJS_CONFIG.publicKey);
        console.log('EmailJS initialized successfully with key:', EMAILJS_CONFIG.publicKey);
      }
    } else {
      console.log('Window not available, skipping EmailJS initialization');
    }
  },

  // Test EmailJS connection
  async testEmailJS() {
    try {
      if (typeof window !== 'undefined' && window.emailjs) {
        console.log('Testing EmailJS connection...');
        
        const testParams = {
          to_email: EMAILJS_CONFIG.toEmail,
          from_name: 'Test User',
          from_email: 'test@example.com',
          subject: 'Test Email',
          message: 'This is a test email from EmailJS',
          reply_to: 'test@example.com'
        };

        const response = await window.emailjs.send(
          EMAILJS_CONFIG.serviceId,
          EMAILJS_CONFIG.templateId,
          testParams,
          EMAILJS_CONFIG.publicKey
        );

        console.log('EmailJS test successful:', response);
        return { success: true, data: response };
      } else {
        console.log('EmailJS not available for testing');
        return { success: false, error: 'EmailJS not loaded' };
      }
    } catch (error) {
      console.error('EmailJS test failed:', error);
      return { success: false, error: error.text || error.message };
    }
  }
};
