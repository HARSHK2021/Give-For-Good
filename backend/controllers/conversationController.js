import Conversation from "../models/Conversation.js";
import mongoose from 'mongoose';
export const getUserConversations = async (req, res) => {
    const {userId} = req.params; // Assuming user ID is stored in req.user

    try {
        console.log("Fetching conversations for user:", userId);
        const conversations = await Conversation.find({ participants: userId })
            .populate('participants', 'name avatar') // Populate participant details
            .sort({ updatedAt: -1 }); // Sort by last updated time descending
       return res.status(200).json(conversations);
    } catch (error) {
        console.error("Error fetching conversations:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const createConversation = async (req, res) => {
  const { participantIds, product } = req.body;

  try {
    const participantObjIds = participantIds.map(id => new mongoose.Types.ObjectId(String(id)));
    let conversation = await Conversation.findOne({
      participants: { $all: participantObjIds },
      $expr: { $eq: [{ $size: "$participants" }, participantObjIds.length] },
      "product._id": product._id
    });

    if (conversation) {
      // <-- populate before sending!
      conversation = await conversation.populate('participants', 'name avatar');
      return res.status(200).json({ success: true, conversation });
    }

    conversation = new Conversation({
      participants: participantObjIds,
      product: { _id: product._id, title: product.title }
    });
    await conversation.save();
    // <-- populate before sending!
    const populatedConversation = await Conversation.findById(conversation._id)
      .populate('participants', 'name avatar');
    return res.status(201).json({ success: true, conversation: populatedConversation });
  } catch (error) {
    // error handling...
  }
};


export const deleteConversation = async (req, res) => {
    const { conversationId } = req.params;
    
    try {
        const conversation = await Conversation.findByIdAndDelete(conversationId);
        if (!conversation) {
        return res.status(404).json({ success: false, message: "Conversation not found" });
        }
        return res.status(200).json({ success: true, message: "Conversation deleted successfully" });
    } catch (error) {
        console.error("Error deleting conversation:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}