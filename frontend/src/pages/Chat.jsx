import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Phone,
  Video,
  MoreVertical,
  Search,
  ArrowLeft,
  Edit3,
  Trash2,
  Check,
  X,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useSocket } from "../contexts/SocketContext";



const Chat = () => {
  const socket = useSocket();
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [editingMessage, setEditingMessage] = useState(null);
  const [editText, setEditText] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showChatOptions, setShowChatOptions] = useState(null);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

 


  useEffect(() => {
    // Load conversations from localStorage or use mock data
    console.log("hello");
    console.log("Socket ID from chat:", socket?.id); // Log the socket ID for debugging
    socket.emit("welcome", (message) => {
      console.log(message); // Log the welcome message
    });
    
    const savedConversations = localStorage.getItem("conversations");

    if (savedConversations) {
      setConversations(JSON.parse(savedConversations));
    } else {
      const mockConversations = [
        {
          id: "1",
          user: {
            name: "John Doe",
            avatar:
              "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=100",
            lastSeen: "2 min ago",
          },
          lastMessage: "Is this still available?",
          timestamp: "2:30 PM",
          unread: 2,
          product: { title: "iPhone 13 Pro Max", price: "₹85,000" },
        },
        {
          id: "2",
          user: {
            name: "Sarah Smith",
            avatar:
              "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=100",
            lastSeen: "1 hour ago",
          },
          lastMessage: "Can we meet tomorrow?",
          timestamp: "1:15 PM",
          unread: 0,
          product: { title: "Honda City 2020", price: "₹12,50,000" },
        },
        {
          id: "3",
          user: {
            name: "Mike Johnson",
            avatar:
              "https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?w=100",
            lastSeen: "3 hours ago",
          },
          lastMessage: "Thanks for the quick response!",
          timestamp: "11:45 AM",
          unread: 0,
          product: { title: "Gaming Laptop", price: "₹75,000" },
        },
      ];
      setConversations(mockConversations);
      localStorage.setItem("conversations", JSON.stringify(mockConversations));
    }
  }, []);

  useEffect(() => {
    if (selectedChat) {
      // Load messages for selected chat
      const savedMessages = localStorage.getItem(`messages_${selectedChat.id}`);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      } else {
        const mockMessages = [
          {
            id: "1",
            sender: "other",
            content: "Hi! Is this product still available?",
            timestamp: "2:25 PM",
            edited: false,
          },
          {
            id: "2",
            sender: "me",
            content: "Yes, it's available. Are you interested?",
            timestamp: "2:26 PM",
            edited: false,
          },
          {
            id: "3",
            sender: "other",
            content: "Great! Can you tell me more about the condition?",
            timestamp: "2:27 PM",
            edited: false,
          },
          {
            id: "4",
            sender: "me",
            content:
              "It's in excellent condition. Barely used, all accessories included.",
            timestamp: "2:28 PM",
            edited: false,
          },
          {
            id: "5",
            sender: "other",
            content: "Perfect! Can we meet to see it?",
            timestamp: "2:30 PM",
            edited: false,
          },
        ];
        setMessages(mockMessages);
        localStorage.setItem(
          `messages_${selectedChat.id}`,
          JSON.stringify(mockMessages)
        );
      }
    }
  }, [selectedChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const saveMessages = (updatedMessages) => {
    setMessages(updatedMessages);
    if (selectedChat) {
      localStorage.setItem(
        `messages_${selectedChat.id}`,
        JSON.stringify(updatedMessages)
      );
    }
  };

  const saveConversations = (updatedConversations) => {
    setConversations(updatedConversations);
    localStorage.setItem("conversations", JSON.stringify(updatedConversations));
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        sender: "me",
        content: message,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        edited: false,
      };

      const updatedMessages = [...messages, newMessage];
      saveMessages(updatedMessages);

      // Update conversation's last message
      const updatedConversations = conversations.map((conv) =>
        conv.id === selectedChat.id
          ? { ...conv, lastMessage: message, timestamp: newMessage.timestamp }
          : conv
      );
      saveConversations(updatedConversations);

      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleDeleteMessage = (messageId) => {
    const updatedMessages = messages.filter((msg) => msg.id !== messageId);
    saveMessages(updatedMessages);
    setShowDeleteConfirm(null);
  };

  const handleEditMessage = (messageId, newContent) => {
    const updatedMessages = messages.map((msg) =>
      msg.id === messageId ? { ...msg, content: newContent, edited: true } : msg
    );
    saveMessages(updatedMessages);
    setEditingMessage(null);
    setEditText("");
  };

  const startEditMessage = (message) => {
    setEditingMessage(message.id);
    setEditText(message.content);
  };

  const cancelEdit = () => {
    setEditingMessage(null);
    setEditText("");
  };

  const handleDeleteChat = (chatId) => {
    const updatedConversations = conversations.filter(
      (conv) => conv.id !== chatId
    );
    saveConversations(updatedConversations);

    // Remove messages for this chat
    localStorage.removeItem(`messages_${chatId}`);

    // If currently viewing this chat, clear selection
    if (selectedChat && selectedChat.id === chatId) {
      setSelectedChat(null);
      setMessages([]);
    }

    setShowChatOptions(null);
  };

  const formatTime = (timestamp) => {
    return timestamp;
  };

  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden">
      {/* Conversations List */}
      <div
        className={`${
          selectedChat ? "hidden md:flex" : "flex"
        } flex-col w-full md:w-80 lg:w-96 bg-slate-800 border-r border-slate-700 flex-shrink-0`}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Messages</h2>
            <button className="text-gray-400 hover:text-white">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-white"
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`relative group p-3 sm:p-4 border-b border-slate-700 cursor-pointer hover:bg-slate-700 transition-colors ${
                selectedChat?.id === conversation.id ? "bg-slate-700" : ""
              }`}
            >
              <div
                onClick={() => setSelectedChat(conversation)}
                className="flex items-center space-x-2 sm:space-x-3 min-w-0"
              >
                <div className="relative">
                  <img
                    src={conversation.user.avatar}
                    alt={conversation.user.name}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0"
                  />
                  {conversation.unread > 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-teal-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">
                        {conversation.unread}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-white truncate text-sm sm:text-base pr-2">
                      {conversation.user.name}
                    </h3>
                    <span className="text-xs text-gray-400 flex-shrink-0">
                      {conversation.timestamp}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-400 truncate">
                    {conversation.lastMessage}
                  </p>
                  <p className="text-xs text-gray-500 truncate mt-1">
                    About: {conversation.product.title}
                  </p>
                </div>
              </div>

              {/* Chat Options */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowChatOptions(
                        showChatOptions === conversation.id
                          ? null
                          : conversation.id
                      );
                    }}
                    className="p-1 hover:bg-slate-600 rounded"
                  >
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>

                  {showChatOptions === conversation.id && (
                    <div className="absolute top-full right-0 mt-1 bg-slate-600 rounded-lg shadow-xl w-32 z-20">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteChat(conversation.id);
                        }}
                        className="block w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-slate-500 rounded-lg"
                      >
                        Delete Chat
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div
        className={`${
          selectedChat ? "flex" : "hidden md:flex"
        } flex-col flex-1 min-w-0 overflow-hidden`}
      >
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-3 sm:p-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                <button
                  onClick={() => setSelectedChat(null)}
                  className="md:hidden text-gray-400 hover:text-white"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <img
                  src={selectedChat.user.avatar}
                  alt={selectedChat.user.name}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-white truncate text-sm sm:text-base">
                    {selectedChat.user.name}
                  </h3>
                  <p className="text-xs text-gray-400 truncate">
                    Last seen {selectedChat.user.lastSeen}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                <button className="text-gray-400 hover:text-white p-1 sm:p-2 rounded-full hover:bg-slate-700">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="text-gray-400 hover:text-white p-1 sm:p-2 rounded-full hover:bg-slate-700">
                  <Video className="w-5 h-5" />
                </button>
                <button className="text-gray-400 hover:text-white p-1 sm:p-2 rounded-full hover:bg-slate-700">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-3 bg-slate-700 border-b border-slate-600">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📱</span>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-medium text-white text-sm truncate">
                    {selectedChat.product.title}
                  </h4>
                  <p className="text-teal-400 text-sm font-medium">
                    {selectedChat.product.price}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 space-y-3 sm:space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex group ${
                    msg.sender === "me" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[75%] sm:max-w-xs lg:max-w-md relative ${
                      msg.sender === "me" ? "order-2" : "order-1"
                    }`}
                  >
                    {editingMessage === msg.id ? (
                      <div className="bg-slate-700 p-3 rounded-lg">
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full bg-slate-600 text-white p-2 rounded resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                          rows="2"
                        />
                        <div className="flex justify-end space-x-2 mt-2">
                          <button
                            onClick={cancelEdit}
                            className="p-1 text-gray-400 hover:text-white"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditMessage(msg.id, editText)}
                            className="p-1 text-teal-400 hover:text-teal-300"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`px-4 py-2 rounded-lg ${
                          msg.sender === "me"
                            ? "bg-teal-500 text-white"
                            : "bg-slate-700 text-gray-100"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-line break-words">
                          {msg.content}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <p
                            className={`text-xs ${
                              msg.sender === "me"
                                ? "text-teal-100"
                                : "text-gray-400"
                            }`}
                          >
                            {formatTime(msg.timestamp)}
                            {msg.edited && (
                              <span className="ml-1">(edited)</span>
                            )}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Message Options */}
                    {/* Message Options */}
                    {msg.sender === "me" && editingMessage !== msg.id && (
                      <div className="absolute top-1 right-2 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block z-20">
                        <div className="flex space-x-1 ml-2">
                          <button
                            onClick={() => startEditMessage(msg)}
                            className="p-1 text-gray-400 hover:text-white bg-slate-600 rounded"
                            title="Edit message"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(msg.id)}
                            className="p-1 text-gray-400 hover:text-red-400 bg-slate-600 rounded"
                            title="Delete message"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Mobile Message Options */}
                    {msg.sender === "me" && editingMessage !== msg.id && (
                      <div className="sm:hidden mt-2 flex justify-end space-x-2">
                        <button
                          onClick={() => startEditMessage(msg)}
                          className="p-1 text-gray-400 hover:text-white bg-slate-600 rounded text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(msg.id)}
                          className="p-1 text-gray-400 hover:text-red-400 bg-slate-600 rounded text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-3 sm:p-4 bg-slate-800 border-t border-slate-700">
              <div className="flex items-end space-x-2">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-1 px-3 sm:px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none text-white text-sm sm:text-base"
                  rows="1"
                  style={{ minHeight: "40px", maxHeight: "120px" }}
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-teal-500 hover:bg-teal-600 p-2 rounded-lg transition-colors flex-shrink-0"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">💬</span>
              </div>
              <h3 className="text-lg sm:text-xl font-medium text-white mb-2 px-4">
                Select a chat to view conversation
              </h3>
              <p className="text-gray-400 px-4 text-sm sm:text-base">
                Choose a conversation from the list to start chatting
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg p-4 sm:p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-white mb-4">
              Delete Message
            </h3>
            <p className="text-gray-300 mb-6 text-sm sm:text-base">
              Are you sure you want to delete this message? This action cannot
              be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-3 sm:px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg transition-colors text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteMessage(showDeleteConfirm)}
                className="px-3 sm:px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors text-sm sm:text-base"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
