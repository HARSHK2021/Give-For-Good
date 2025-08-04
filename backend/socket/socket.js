// socket/socket.js
import jwt from "jsonwebtoken";
import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";


const connectedUsers = new Map(); // userId -> socketId

export const setupSocket = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
  
    if (!token) return next(new Error("Auth token missing"));

    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = user;
      
      next();
    } catch (err) {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user.id;
    console.log(`✅ ${userId} connected`);
    console.log(`socket ID:`, socket.id);
    // Store connected user
    connectedUsers.set(userId, socket.id);
    socket.join(userId); // Each user joins their own room

    // Join conversation rooms for real-time updates
    socket.on("join_conversation", async (conversationId) => {
      const conversation = await Conversation.findById(conversationId);
      if(!conversation) {
        console.error(`Conversation ${conversationId} not found`);
        return;
      }
      socket.join(conversationId);

      const unseenMessages = await Message.find({
        conversation: conversationId,
        sender: { $ne: socket.user.id }, 
        readBy: { $ne: socket.user.id } 
      }).populate("sender", "name avatar");
      // Emit unseen messages so they show up for user
      for( const msg of unseenMessages) {
        io.to(socket.id).emit("receive_message", {
          ...msg.toObject(),
           sender: msg.sender,
           receiver: socket.user.id,
         
        });
      }
   
    });

    // markas read
    socket.on("mark_as_read", async ({ conversationId }) => {
  const userId = socket.user.id;
  
  // Update all messages in this conversation NOT read by user
  const result = await Message.updateMany(
    { conversation: conversationId, readBy: { $ne: userId }, sender: { $ne: userId } },
    { $push: { readBy: userId } }
  );

  // Optionally fetch updated messages or just notify participants
  io.to(conversationId).emit("messages_read", {
    conversationId,
    readerId: userId,
  });
});


    // Send Message
    socket.on("send_message", async ({ to, conversationId, text }) => {
      const message = new Message({
        conversation: conversationId,
        sender: userId,
        content: text,
        timestamp: new Date(),
        edited: false,
      })
      await message.save();
      // console.log(`Message sent from ${userId} to ${to}:`, text);
      // update conversation with last message
      await Conversation.findByIdAndUpdate(conversationId, {
        lastMessage:text,
        updatedAt: new Date(),
      });
      /// notify both sender and receiver in real time
      io.to(conversationId).emit("receive_message", {
        ...message.toObject(),
        sender:{
          _id: userId,
          name: socket.user.name,
          avatar: socket.user.avatar,
        },
        receiver: to,
        
      });
    });

    

    // Edit/Delete later here...
    socket.on("edit_message", async ({ messageId, newText,conversationId }) => {
      const msg = await Message.findByIdAndUpdate(
        messageId, 
        { content: newText, edited: true }, 
        { new: true }
      )
      if (msg) {
        io.to(conversationId).emit("message_edited", {
          ...msg.toObject(),
        });
      }

    });

    /// delete message
   socket.on("delete_message", async ({ messageId, conversationId }) => {
      await Message.findByIdAndDelete(messageId);
      io.to(conversationId).emit("message_deleted", { messageId });
    });

    socket.on("disconnect", () => {
      connectedUsers.delete(userId);
      console.log(`❌ ${userId} disconnected`);
    });
  });
};
