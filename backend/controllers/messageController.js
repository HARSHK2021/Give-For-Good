import Message from "../models/Message.js";
export const getMessages = async (req, res) => {
    const { conversationId } = req.params;
    
    try {
        console.log("Fetching messages for conversation:", conversationId);
        const messages = await Message.find({ conversation: conversationId })
        .populate('sender', 'name avatar') // Populate sender details
        .sort({ timestamp: -1 }); // Sort by timestamp descending
         return res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

