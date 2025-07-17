import React, { useState, useEffect, useRef } from 'react';
import { Send, Phone, Video, MoreVertical, Search, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Chat = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    // Mock conversations
    const mockConversations = [
      {
        id: '1',
        user: { name: 'John Doe', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=100', lastSeen: '2 min ago' },
        lastMessage: 'Is this still available?',
        timestamp: '2:30 PM',
        unread: 2,
        product: { title: 'iPhone 13 Pro Max', price: '₹85,000' }
      },
      {
        id: '2',
        user: { name: 'Sarah Smith', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=100', lastSeen: '1 hour ago' },
        lastMessage: 'Can we meet tomorrow?',
        timestamp: '1:15 PM',
        unread: 0,
        product: { title: 'Honda City 2020', price: '₹12,50,000' }
      },
      {
        id: '3',
        user: { name: 'Mike Johnson', avatar: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?w=100', lastSeen: '3 hours ago' },
        lastMessage: 'Thanks for the quick response!',
        timestamp: '11:45 AM',
        unread: 0,
        product: { title: 'Gaming Laptop', price: '₹75,000' }
      }
    ];
    setConversations(mockConversations);
  }, []);

  useEffect(() => {
    if (selectedChat) {
      // Mock messages for selected chat
      const mockMessages = [
        { id: '1', sender: 'other', content: 'Hi! Is this product still available?', timestamp: '2:25 PM' },
        { id: '2', sender: 'me', content: 'Yes, it\'s available. Are you interested?', timestamp: '2:26 PM' },
        { id: '3', sender: 'other', content: 'Great! Can you tell me more about the condition?', timestamp: '2:27 PM' },
        { id: '4', sender: 'me', content: 'It\'s in excellent condition. Barely used, all accessories included.', timestamp: '2:28 PM' },
        { id: '5', sender: 'other', content: 'Perfect! Can we meet to see it?', timestamp: '2:30 PM' }
      ];
      setMessages(mockMessages);
    }
  }, [selectedChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        sender: 'me',
        content: message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-slate-900">
      {/* Conversations List */}
      <div className={`${selectedChat ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-1/3 bg-slate-800 border-r border-slate-700`}>
        {/* Header */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Messages</h2>
            <button className="text-gray-400 hover:text-white">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setSelectedChat(conversation)}
              className={`p-4 border-b border-slate-700 cursor-pointer hover:bg-slate-700 transition-colors ${
                selectedChat?.id === conversation.id ? 'bg-slate-700' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={conversation.user.avatar}
                    alt={conversation.user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {conversation.unread > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">{conversation.unread}</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-white truncate">{conversation.user.name}</h3>
                    <span className="text-xs text-gray-400">{conversation.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-400 truncate">{conversation.lastMessage}</p>
                  <p className="text-xs text-gray-500 truncate mt-1">
                    About: {conversation.product.title}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`${selectedChat ? 'flex' : 'hidden md:flex'} flex-col flex-1`}>
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setSelectedChat(null)}
                  className="md:hidden text-gray-400 hover:text-white"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <img
                  src={selectedChat.user.avatar}
                  alt={selectedChat.user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-medium text-white">{selectedChat.user.name}</h3>
                  <p className="text-xs text-gray-400">Last seen {selectedChat.user.lastSeen}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-slate-700">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-slate-700">
                  <Video className="w-5 h-5" />
                </button>
                <button className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-slate-700">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-3 bg-slate-700 border-b border-slate-600">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-slate-600 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📱</span>
                </div>
                <div>
                  <h4 className="font-medium text-white text-sm">{selectedChat.product.title}</h4>
                  <p className="text-teal-400 text-sm font-medium">{selectedChat.product.price}</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.sender === 'me'
                        ? 'bg-teal-500 text-white'
                        : 'bg-slate-700 text-gray-100'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p className={`text-xs mt-1 ${msg.sender === 'me' ? 'text-teal-100' : 'text-gray-400'}`}>
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 bg-slate-800 border-t border-slate-700">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-teal-500 hover:bg-teal-600 p-2 rounded-lg transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">💬</span>
              </div>
              <h3 className="text-xl font-medium text-white mb-2">Select a chat to view conversation</h3>
              <p className="text-gray-400">Choose a conversation from the list to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;