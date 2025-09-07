const API_BASE_URL = 'http://localhost:8092';

export const chatService = {
  async sendMessage(message) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chatbot/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.reply || 'Sorry, I could not process your request.';
    } catch (error) {
      console.error('Error sending message to chatbot:', error);
      return 'Sorry, I am having trouble connecting. Please try again later.';
    }
  },

  async getInitialMessage() {
    // Send an empty message or a specific trigger to get the initial greeting
    return this.sendMessage('');
  }
};
