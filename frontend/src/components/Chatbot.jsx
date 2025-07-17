import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, RotateCcw } from 'lucide-react';
import { useChatbot } from '../contexts/ChatbotContext';

const Chatbot = () => {
  const {
    isOpen,
    setIsOpen,
    messages,
    isTyping,
    sendMessage,
    handleOptionClick,
    clearChat
  } = useChatbot();
  
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      sendMessage(inputMessage.trim());
      setInputMessage('');
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg transition-all duration-300 z-50 flex items-center justify-center ${
          isOpen 
            ? 'bg-red-500 hover:bg-red-600' 
            : 'bg-teal-500 hover:bg-teal-600 animate-pulse'
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-slate-800 rounded-lg shadow-2xl z-50 flex flex-col border border-slate-700">
          {/* Header */}
          <div className="bg-teal-500 p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-teal-500" />
              </div>
              <div>
                <h3 className="font-medium text-white">Giive Bot</h3>
                <p className="text-xs text-teal-100">Always here to help</p>
              </div>
            </div>
            <button
              onClick={clearChat}
              className="text-white hover:text-teal-100 transition-colors"
              title="Clear chat"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                  <div
                    className={`px-3 py-2 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-teal-500 text-white'
                        : 'bg-slate-700 text-gray-100'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.type === 'user' ? 'text-teal-100' : 'text-gray-400'
                    }`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>

                  {/* Quick Options */}
                  {message.type === 'bot' && message.options && (
                    <div className="mt-2 space-y-1">
                      {message.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleOptionClick(option)}
                          className="block w-full text-left px-3 py-1 text-xs bg-slate-600 hover:bg-slate-500 text-gray-200 rounded transition-colors"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'user' ? 'order-1 mr-2 bg-teal-500' : 'order-2 ml-2 bg-slate-600'
                }`}>
                  {message.type === 'user' ? (
                    <User className="w-3 h-3 text-white" />
                  ) : (
                    <Bot className="w-3 h-3 text-gray-300" />
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-slate-600 rounded-full flex items-center justify-center">
                    <Bot className="w-3 h-3 text-gray-300" />
                  </div>
                  <div className="bg-slate-700 px-3 py-2 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-700">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-white placeholder-gray-400 text-sm"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isTyping}
                className="bg-teal-500 hover:bg-teal-600 disabled:bg-slate-600 p-2 rounded-lg transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;