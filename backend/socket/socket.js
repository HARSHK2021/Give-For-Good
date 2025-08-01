// socket/socket.js
import jwt from "jsonwebtoken";

const connectedUsers = new Map(); // userId -> socketId

export const setupSocket = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
   
    // console.log(`Socket connection attempt with token: ${token}`);
    if (!token) return next(new Error("Auth token missing"));

    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = user;
      // console.log(`Socket connected for user: ${user.id}`);
      // console.log(`Socket ID: ${socket.id}`);
      next();
    } catch (err) {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user.id;
    console.log(`socket ID:`, socket.id);
    socket.emit("welcome", "Welcome to the HelperHub chat!");
    
    connectedUsers.set(userId, socket.id);

    console.log(`User ID : ${userId}`);
  

    /// Emit a welocme message
    // JOIN private room
    socket.join(userId); // Each user joins their own room

    // Send Message
    socket.on("send_message", async ({ to, conversationId, text }) => {
      const message = {
        sender: userId,
        receiver: to,
        text,
        conversationId,
        timestamp: new Date(),
      };
  

      // Save to DB (we'll add this later)
      // Emit to receiver
      const receiverSocketId = connectedUsers.get(to);
      if (receiverSocketId) {
        io.to(to).emit("receive_message", message);
      }

      // Also send it back to sender for confirmation
      io.to(userId).emit("receive_message", message);
    });

    

    // Edit/Delete later here...

    socket.on("disconnect", () => {
      connectedUsers.delete(userId);
      console.log(`❌ ${userId} disconnected`);
    });
  });
};
