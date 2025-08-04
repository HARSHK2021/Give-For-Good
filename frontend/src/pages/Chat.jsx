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
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { GFG_ROUTES } from "../gfgRoutes/gfgRoutes";

const Chat = () => {
  const socket = useSocket();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [editingMessage, setEditingMessage] = useState(null);
  const [editText, setEditText] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showChatOptions, setShowChatOptions] = useState(null);

  const messagesEndRef = useRef(null);

  // Scroll chat to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load conversations on login
  useEffect(() => {
    if (!user) return;

    const fetchConvos = async () => {
      try {
        const res = await axios.get(GFG_ROUTES.GETUSERCONVERSATIONS(user._id));
        setConversations(res.data);
      } catch (err) {
        console.error("Failed to fetch conversations", err);
      }
    };
    fetchConvos();
  }, [user]);

  // Handle URL params to auto-open/create conversation
  useEffect(() => {
    if (!user || !socket) return;

    const params = new URLSearchParams(location.search);
    const productId = params.get("productId");
    const sellerId = params.get("sellerId");
    const productTitle = params.get("productTitle");

    if (productId && sellerId) {
      const createOrFetch = async () => {
        try {
          const { data } = await axios.post(GFG_ROUTES.GETCONVERSATION, {
            participantIds: [user._id, sellerId],
            product: { _id: productId, title: productTitle },
          });

          if (data.success && data.conversation) {
            // Update conversation list, avoiding duplicates
            setConversations((prev) => {
              if (prev.some((c) => c._id === data.conversation._id)) return prev;
              return [data.conversation, ...prev];
            });
            setSelectedChat(data.conversation);
          }

          // Clean URL query params
          navigate("/chat", { replace: true });
        } catch (err) {
          console.error("Failed to create or fetch conversation", err);
        }
      };
      createOrFetch();
    }
  }, [location.search, user, socket, navigate]);

  // Load messages when selected chat changes
  useEffect(() => {
    if (!selectedChat || !user || !socket) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(GFG_ROUTES.GETMESSAGES(selectedChat._id));
        const mapped = res.data
          .map((msg) => ({
            id: msg._id,
            sender: msg.sender?._id === user._id ? "me" : "other",
            content: msg.content,
            timestamp: new Date(msg.timestamp ?? msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            edited: msg.edited,
            readBy: msg.readBy ? msg.readBy.map((id) => id.toString()) : [],
            senderInfo: msg.sender,
          }))
          .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)); // optional, just to be safe

        setMessages(mapped);

        // Join socket room for realtime updates
        socket.emit("join_conversation", selectedChat._id);

        // Emit mark as read for all loaded messages to update backend
        socket.emit("mark_as_read", { conversationId: selectedChat._id });
      } catch (err) {
        console.error("Failed to fetch messages", err);
      }
    };
    fetchMessages();
  }, [selectedChat, user, socket]);

  // Listen for socket events
  useEffect(() => {
    if (!socket || !user) return;

    const onNewMessage = (msg) => {
      if (!selectedChat || selectedChat._id !== msg.conversation) return;

      // Avoid duplicates
      setMessages((old) => {
        if (old.find((m) => m.id === msg._id)) return old;
        return [
          ...old,
          {
            id: msg._id,
            sender: msg.sender._id === user._id ? "me" : "other",
            content: msg.content,
            timestamp: new Date(msg.timestamp ?? msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            edited: msg.edited,
            readBy: [], // new message is unread by recipient initially
            senderInfo: msg.sender,
          },
        ];
      });

      setConversations((old) =>
        old.map((c) =>
          c._id === msg.conversation
            ? { ...c, lastMessage: msg.content, updatedAt: new Date() }
            : c
        )
      );
    };

    const onEditedMessage = (msg) => {
      if (!selectedChat || selectedChat._id !== msg.conversation) return;
      setMessages((old) =>
        old.map((m) => (m.id === msg._id ? { ...m, content: msg.content, edited: true } : m))
      );
    };

    const onDeletedMessage = ({ messageId }) => {
      setMessages((old) => old.filter((m) => m.id !== messageId));
    };

    // Handle read receipts update
    const onMessagesRead = ({ conversationId, readerId }) => {
      if (!selectedChat || selectedChat._id !== conversationId) return;
      setMessages((old) =>
        old.map((m) => {
          // If already read by user, no change
          if (m.readBy.includes(readerId)) return m;

          // Only messages sent before this event should be updated (optional)
          // For simplicity, update all messages not sent by reader and not already marked read by reader
          if (readerId !== user._id) {
            return { ...m, readBy: [...(m.readBy || []), readerId] };
          }
          return m;
        })
      );
    };

    socket.on("receive_message", onNewMessage);
    socket.on("message_edited", onEditedMessage);
    socket.on("message_deleted", onDeletedMessage);
    socket.on("messages_read", onMessagesRead);

    return () => {
      socket.off("receive_message", onNewMessage);
      socket.off("message_edited", onEditedMessage);
      socket.off("message_deleted", onDeletedMessage);
      socket.off("messages_read", onMessagesRead);
    };
  }, [selectedChat, user, socket]);

  // Send a message
  const handleSend = () => {
    if (!message.trim() || !selectedChat || !user || !socket) return;

    const receiverId = selectedChat.participants?.find((p) => p._id !== user._id)?._id || "";

    socket.emit("send_message", {
      to: receiverId,
      conversationId: selectedChat._id,
      text: message.trim(),
    });

    setMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Editing message
  const startEdit = (msg) => {
    setEditingMessage(msg.id);
    setEditText(msg.content);
  };

  const cancelEdit = () => {
    setEditingMessage(null);
    setEditText("");
  };

  const confirmEdit = () => {
    if (!editText.trim() || !editingMessage || !socket) return;

    socket.emit("edit_message", {
      messageId: editingMessage,
      newText: editText.trim(),
      conversationId: selectedChat._id,
    });
    setEditingMessage(null);
    setEditText("");
  };

  // Delete message
  const deleteMessage = (id) => {
    if (!selectedChat || !socket) return;
    socket.emit("delete_message", { messageId: id, conversationId: selectedChat._id });
    // Optimistically update UI
    setMessages((old) => old.filter((m) => m.id !== id));
    setShowDeleteConfirm(null);
  };

  // Delete conversation
  const deleteConversation = async (id) => {
    try {
      await axios.delete(GFG_ROUTES.DELETECONVERSATION(id));
      setConversations((old) => old.filter((c) => c._id !== id));
      if (selectedChat?._id === id) {
        setSelectedChat(null);
        setMessages([]);
      }
      setShowChatOptions(null);
    } catch (err) {
      console.error("Failed to delete conversation", err);
    }
  };

  // On chat open or switch, mark current conversation as read (for read receipts)
  useEffect(() => {
    if (socket && user && selectedChat) {
      socket.emit("mark_as_read", { conversationId: selectedChat._id });
    }
  }, [selectedChat, socket, user]);

  // Format time helper
  const formatTime = (time) => time;

  // Helper to determine if current user has seen a message
  const hasRead = (msg) => {
    if (!msg.readBy) return false;
    return msg.readBy.includes(selectedChat.participants.find((p) => p._id !== user._id)?._id);
  };

  // Render

  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden">
      {/* Conversations Sidebar */}
      <div
        className={`${
          selectedChat ? "hidden md:flex" : "flex"
        } flex-col w-full md:w-80 lg:w-96 bg-slate-800 border-r border-slate-700 flex-shrink-0`}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Messages</h2>
            <button className="text-gray-400 hover:text-white" title="More options">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-white"
              // TODO: implement search filter functionality here
              // onChange={...}
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {conversations.map((conv) => {
            const otherUser = conv.participants?.find((p) => p._id !== user._id) || {};
            // Optionally: compute number of unread messages per conv here as well
            return (
              <div
                key={conv._id}
                className={`relative group p-3 sm:p-4 border-b border-slate-700 cursor-pointer hover:bg-slate-700 transition-colors ${
                  selectedChat?._id === conv._id ? "bg-slate-700" : ""
                }`}
                onClick={() => setSelectedChat(conv)}
              >
                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                  <div className="relative">
                    <img
                      src={otherUser.avatar || ""}
                      alt={otherUser.name || "User"}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-white truncate text-sm sm:text-base">
                        {otherUser.name || "Unknown"}
                      </h3>
                      <span className="text-xs text-gray-400 flex-shrink-0">
                        {new Date(conv.updatedAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-400 truncate">
                      {conv.lastMessage || ""}
                    </p>
                    <p className="text-xs text-gray-500 truncate mt-1">
                      About: {conv.product?.title || ""}
                    </p>
                  </div>

                  {/* Conversation Options */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowChatOptions(showChatOptions === conv._id ? null : conv._id);
                        }}
                        className="p-1 hover:bg-slate-600 rounded"
                        title="Chat options"
                      >
                        <MoreVertical className="w-5 h-5 text-gray-400" />
                      </button>
                      {showChatOptions === conv._id && (
                        <div className="absolute top-full right-0 mt-1 bg-slate-600 rounded-lg shadow-xl w-32 z-20">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteConversation(conv._id);
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
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat window */}
      <div
        className={`${
          selectedChat ? "flex" : "hidden md:flex"
        } flex-col w-full flex-grow bg-slate-900`}
      >
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-3 sm:p-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                <button
                  onClick={() => navigate(-1)}
                  className="text-gray-400 hover:text-white"
                  title="Back"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <img
                  src={selectedChat.participants?.find((p) => p._id !== user._id)?.avatar || ""}
                  alt={selectedChat.participants?.find((p) => p._id !== user._id)?.name || ""}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0">
                  <h3 className="font-medium text-white truncate text-base">
                    {selectedChat.participants?.find((p) => p._id !== user._id)?.name || ""}
                  </h3>
                  <p className="text-xs text-gray-400 truncate">Last seen</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="text-gray-400 hover:text-white p-1 rounded-full" title="Call">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="text-gray-400 hover:text-white p-1 rounded-full" title="Video call">
                  <Video className="w-5 h-5" />
                </button>
                <button className="text-gray-400 hover:text-white p-1 rounded-full" title="Options">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Product info */}
            <div className="p-3 bg-slate-700 border-b border-slate-600 flex items-center space-x-2">
              <div className="w-12 h-12 bg-slate-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">📱</span>
              </div>
              <div className="min-w-0">
                <h4 className="text-white font-semibold text-lg truncate">
                  {selectedChat.product?.title || ""}
                </h4>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-grow overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => {
                const isMe = msg.sender === "me";
                const otherUser = selectedChat.participants.find((p) => p._id !== user._id) || {};
                const isReadByOther = msg.readBy?.includes(otherUser._id);
                const allRead = msg.readBy?.length === selectedChat.participants.length;

                return (
                  <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"} relative`}>
                    <div className={`max-w-[70%] rounded-xl px-4 py-2 ${isMe ? "bg-teal-500 text-white" : "bg-slate-700 text-gray-100"} relative`}>
                      {editingMessage === msg.id ? (
                        <>
                          <textarea
                            className="bg-slate-600 text-white rounded w-full resize-none p-2"
                            rows={2}
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                          />
                          <div className="flex justify-end space-x-2 mt-1">
                            <button onClick={cancelEdit} title="Cancel" className="text-gray-300 hover:text-white">
                              <X />
                            </button>
                            <button onClick={confirmEdit} title="Save" className="text-teal-300 hover:text-white">
                              <Check />
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                          <div className="flex justify-between text-xs mt-1 text-gray-300">
                            <span>{msg.timestamp}{msg.edited ? " (edited)" : ""}</span>
                            {/* Read receipt ticks */}
                            {isMe && (
                              <span
                                title={
                                  allRead
                                    ? "Seen"
                                    : isReadByOther
                                    ? "Delivered"
                                    : "Sent"
                                }
                                className={`ml-2 inline-block w-4 h-4 relative`}>
                                {/* One tick */}
                                <svg
                                  className={`absolute left-0 top-0 w-4 h-4 stroke-current ${isReadByOther ? "text-blue-500" : "text-gray-400"}`}
                                  fill="none"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  viewBox="0 0 24 24"
                                
                                >
                                  <path d="M20 6L9 17l-5-5" />
                                </svg>
                                {/* Second tick */}
                                <svg
                                  className={`absolute left-1 top-0 w-4 h-4 stroke-current ${allRead ? "text-blue-500" : isReadByOther ? "text-blue-500" : "text-gray-400"}`}
                                  fill="none"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M20 6L9 17l-5-5" />
                                </svg>
                              </span>
                            )}
                          </div>
                        </>
                      )}
                      {/* Message actions */}
                      {isMe && editingMessage !== msg.id && (
                        <div className="absolute top-1 right-1 opacity-0 hover:opacity-100 flex space-x-1">
                          <button onClick={() => startEdit(msg)} title="Edit" className="text-gray-300 hover:text-white">
                            <Edit3 size={16} />
                          </button>
                          <button onClick={() => setShowDeleteConfirm(msg.id)} title="Delete" className="text-red-500 hover:text-red-700">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message input */}
            <div className="p-3 border-t border-slate-700 bg-slate-800 flex items-center space-x-3">
              <textarea
                className="flex-grow resize-none rounded bg-slate-700 p-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                rows={1}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
              />
              <button onClick={handleSend} title="Send" className="p-2 rounded bg-teal-500 hover:bg-teal-600 text-white">
                <Send size={20} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-grow flex items-center justify-center text-gray-500 text-center px-8">
            <div>
              <p>Please select a chat on the left to start messaging.</p>
            </div>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-6 rounded-lg w-80 max-w-full">
            <h2 className="text-lg font-semibold mb-4 text-white">Delete Message</h2>
            <p className="mb-6 text-gray-300">Are you sure you want to delete this message? This action cannot be undone.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMessage(showDeleteConfirm)}
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
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
