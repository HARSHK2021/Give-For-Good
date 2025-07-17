import React, { createContext, useContext, useState } from 'react';

const ChatbotContext = createContext();

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
};

export const ChatbotProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hi! I\'m Giive Bot 🤖 How can I help you today?',
      timestamp: new Date(),
      options: [
        'How to sell an item?',
        'How to buy safely?',
        'Account issues',
        'Report a problem'
      ]
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const botResponses = {
    'how to sell': {
      content: 'To sell an item on Giive for Good:\n\n1. Click the "SELL" button\n2. Upload clear photos (up to 5)\n3. Write a detailed description\n4. Set a fair price\n5. Choose the right category\n6. Post your listing!\n\nTips: Use good lighting for photos and be honest about condition.',
      options: ['Pricing tips', 'Photo guidelines', 'Something else']
    },
    'how to buy': {
      content: 'Safe buying tips:\n\n1. Check seller ratings and reviews\n2. Ask questions before meeting\n3. Meet in public places\n4. Inspect item before paying\n5. Use our in-app chat\n6. Report any issues\n\nAlways trust your instincts!',
      options: ['Meeting safety', 'Payment methods', 'Something else']
    },
    'account issues': {
      content: 'I can help with:\n\n• Login problems\n• Profile settings\n• Verification issues\n• Password reset\n• Account deletion\n\nWhat specific issue are you facing?',
      options: ['Login problems', 'Verification', 'Password reset', 'Something else']
    },
    'report problem': {
      content: 'You can report:\n\n• Suspicious listings\n• Inappropriate behavior\n• Scam attempts\n• Technical issues\n• Fake profiles\n\nFor urgent issues, contact our support team directly.',
      options: ['Report listing', 'Report user', 'Technical issue', 'Contact support']
    },
    'pricing tips': {
      content: 'Pricing strategies:\n\n• Research similar items\n• Consider item condition\n• Factor in depreciation\n• Be open to negotiation\n• Price competitively\n\nRemember: Fair pricing leads to faster sales!',
      options: ['Market research', 'Negotiation tips', 'Something else']
    },
    'photo guidelines': {
      content: 'Great photos sell faster:\n\n• Use natural lighting\n• Show multiple angles\n• Include close-ups of details\n• Clean the item first\n• Avoid filters\n• Show any defects honestly',
      options: ['Lighting tips', 'What to avoid', 'Something else']
    },
    'default': {
      content: 'I understand you need help with that. For complex issues, I recommend:\n\n• Checking our FAQ section\n• Contacting our support team\n• Visiting our help center\n\nIs there anything else I can help you with?',
      options: ['FAQ', 'Contact support', 'Help center', 'Start over']
    }
  };

  const sendMessage = async (content, isUser = true) => {
    const newMessage = {
      id: Date.now(),
      type: isUser ? 'user' : 'bot',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);

    if (isUser) {
      setIsTyping(true);
      
      // Simulate bot thinking time
      setTimeout(() => {
        const response = getBotResponse(content.toLowerCase());
        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: response.content,
          timestamp: new Date(),
          options: response.options
        };
        
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
      }, 1500);
    }
  };

  const getBotResponse = (userInput) => {
    // Simple keyword matching - in production, use NLP/AI
    if (userInput.includes('sell') || userInput.includes('list')) {
      return botResponses['how to sell'];
    }
    if (userInput.includes('buy') || userInput.includes('safe')) {
      return botResponses['how to buy'];
    }
    if (userInput.includes('account') || userInput.includes('login') || userInput.includes('profile')) {
      return botResponses['account issues'];
    }
    if (userInput.includes('report') || userInput.includes('problem') || userInput.includes('issue')) {
      return botResponses['report problem'];
    }
    if (userInput.includes('price') || userInput.includes('pricing')) {
      return botResponses['pricing tips'];
    }
    if (userInput.includes('photo') || userInput.includes('image')) {
      return botResponses['photo guidelines'];
    }
    
    return botResponses['default'];
  };

  const handleOptionClick = (option) => {
    sendMessage(option, true);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        type: 'bot',
        content: 'Hi! I\'m Giive Bot 🤖 How can I help you today?',
        timestamp: new Date(),
        options: [
          'How to sell an item?',
          'How to buy safely?',
          'Account issues',
          'Report a problem'
        ]
      }
    ]);
  };

  const value = {
    isOpen,
    setIsOpen,
    messages,
    isTyping,
    sendMessage,
    handleOptionClick,
    clearChat
  };

  return (
    <ChatbotContext.Provider value={value}>
      {children}
    </ChatbotContext.Provider>
  );
};