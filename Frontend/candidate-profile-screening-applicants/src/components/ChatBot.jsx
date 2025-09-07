import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User, Trash2 } from 'lucide-react';
import { chatService } from '../services/chatService.js';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingMessage, setTypingMessage] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatStatusMessage = (message) => {
    // Replace status codes with user-friendly text based on backend Status enum
    const statusReplacements = {
      'HIRED': 'Congratulations! You have been hired',
      'IN_PROCESS': 'Application is being processed',
      'IN_PROCESS_ROUND1': 'Interview Round 1 - In Progress',
      'IN_PROCESS_ROUND2': 'Interview Round 2 - In Progress',
      'IN_PROCESS_ROUND3': 'Interview Round 3 - In Progress',
      'ON_HOLD': 'Under Consideration for Hiring',
      'REJECTED': 'Application Not Selected'
    };

    let formattedMessage = message;
    
    // Replace all status codes with user-friendly text
    Object.entries(statusReplacements).forEach(([status, friendlyText]) => {
      const regex = new RegExp(`\\b${status}\\b`, 'g');
      formattedMessage = formattedMessage.replace(regex, friendlyText);
    });

    return formattedMessage;
  };

  const sendMenuPrompt = (callback) => {
    // Send a small button message for main menu
    const menuPrompt = 'Show Main Menu';
    
    setTimeout(() => {
      const menuMessage = { 
        text: menuPrompt, 
        isBot: true, 
        timestamp: new Date(),
        isMenuButton: true 
      };
      setMessages(prev => [...prev, menuMessage]);
      if (callback) callback();
    }, 1000); // 1 second delay after the main response
  };

  const handleMenuButtonClick = () => {
    // Clear screen and show main menu
    setMessages([]);
    setTypingMessage('');
    setIsTyping(false);
    setIsLoading(false);
    
    // Get initial message (main menu)
    setIsLoading(true);
    chatService.getInitialMessage()
      .then(response => {
        const formattedResponse = formatStatusMessage(response);
        typeMessage(formattedResponse, () => {
          setMessages([{ text: formattedResponse, isBot: true, timestamp: new Date() }]);
          setIsLoading(false);
        });
      })
      .catch(error => {
        console.error('Error getting initial message:', error);
        const fallbackMessage = 'Hi! How can I help you today?';
        typeMessage(fallbackMessage, () => {
          setMessages([{ text: fallbackMessage, isBot: true, timestamp: new Date() }]);
          setIsLoading(false);
        });
      });
  };

  const typeMessage = (message, callback) => {
    setIsTyping(true);
    setTypingMessage('');
    
    // Scroll to bottom before starting typing animation
    setTimeout(() => {
      scrollToBottom();
    }, 100);
    
    let currentIndex = 0;
    
    const typingInterval = setInterval(() => {
      if (currentIndex < message.length) {
        setTypingMessage(message.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
        if (callback) callback();
      }
    }, 30); // Adjust speed here (lower = faster typing)
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Get initial message when chat opens
      setIsLoading(true);
      chatService.getInitialMessage()
        .then(response => {
          const formattedResponse = formatStatusMessage(response);
          typeMessage(formattedResponse, () => {
            setMessages([{ text: formattedResponse, isBot: true, timestamp: new Date() }]);
            setIsLoading(false);
          });
        })
        .catch(error => {
          console.error('Error getting initial message:', error);
          const fallbackMessage = 'Hi! How can I help you today?';
          typeMessage(fallbackMessage, () => {
            setMessages([{ text: fallbackMessage, isBot: true, timestamp: new Date() }]);
            setIsLoading(false);
          });
        });
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    
    // Add user message
    const newUserMessage = { text: userMessage, isBot: false, timestamp: new Date() };
    setMessages(prev => [...prev, newUserMessage]);
    
    setIsLoading(true);

    try {
      const response = await chatService.sendMessage(userMessage);
      const formattedResponse = formatStatusMessage(response);
      
      typeMessage(formattedResponse, () => {
        const botMessage = { text: formattedResponse, isBot: true, timestamp: new Date() };
        setMessages(prev => [...prev, botMessage]);
        setIsLoading(false);
        
        // Send menu prompt after main response (except for initial greeting)
        const initialGreeting = 'Hi! Please select an option:';
        if (!formattedResponse.includes(initialGreeting)) {
          sendMenuPrompt();
        }
      });
    } catch (error) {
      console.error('Error sending message:', error);
      const errorResponse = 'Sorry, I encountered an error. Please try again.';
      typeMessage(errorResponse, () => {
        const errorMessage = { text: errorResponse, isBot: true, timestamp: new Date() };
        setMessages(prev => [...prev, errorMessage]);
        setIsLoading(false);
        
        // Send menu prompt after error message
        sendMenuPrompt();
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setTypingMessage('');
    setIsTyping(false);
    setIsLoading(false);
    // Get initial message again after clearing
    setIsLoading(true);
    chatService.getInitialMessage()
      .then(response => {
        const formattedResponse = formatStatusMessage(response);
        typeMessage(formattedResponse, () => {
          setMessages([{ text: formattedResponse, isBot: true, timestamp: new Date() }]);
          setIsLoading(false);
        });
      })
      .catch(error => {
        console.error('Error getting initial message:', error);
        const fallbackMessage = 'Hi! How can I help you today?';
        typeMessage(fallbackMessage, () => {
          setMessages([{ text: fallbackMessage, isBot: true, timestamp: new Date() }]);
          setIsLoading(false);
        });
      });
  };

  const TypingIndicator = () => (
    <div className="flex justify-start">
      <div className="flex items-start space-x-2 max-w-xs">
        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-sg-red text-white">
          <Bot className="w-4 h-4" />
        </div>
        <div className="px-3 py-2 rounded-lg bg-gray-100 text-gray-800">
          <p className="text-sm whitespace-pre-wrap">
            {typingMessage}
            <span className="inline-block w-2 h-4 bg-gray-400 ml-1 animate-pulse"></span>
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed bottom-20 right-6 z-50 w-14 h-14 bg-sg-red hover:bg-sg-red/90 text-white rounded-full shadow-lg transition-all duration-300 flex items-center justify-center"
          aria-label="Open chat"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-40 w-[28rem] h-[32rem] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 bg-sg-red text-white rounded-t-lg">
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5" />
              <span className="font-semibold">SG Assistant</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleClearChat}
                className="text-white hover:text-gray-200 transition-colors p-1 rounded hover:bg-white/10"
                title="Clear chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200 transition-colors p-1 rounded hover:bg-white/10"
                title="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`flex items-start space-x-2 max-w-xs ${
                    message.isBot ? 'flex-row' : 'flex-row-reverse space-x-reverse'
                  }`}
                >
                  {!message.isMenuButton && (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.isBot ? 'bg-sg-red text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {message.isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>
                  )}
                  {message.isMenuButton ? (
                    <button
                      onClick={handleMenuButtonClick}
                      className="text-sg-red text-xs underline hover:text-sg-red/80 transition-colors duration-200"
                    >
                      {message.text}
                    </button>
                  ) : (
                    <div
                      className={`px-3 py-2 rounded-lg ${
                        message.isBot
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-sg-red text-white'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.isBot ? 'text-gray-500' : 'text-red-100'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && <TypingIndicator />}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sg-red/50 focus:border-transparent text-sm"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="px-3 py-2 bg-sg-red text-white rounded-lg hover:bg-sg-red/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
