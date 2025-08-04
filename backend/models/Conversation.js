import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
     participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
   product: {
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    title: String,
  },
  lastMessage: String,
  updatedAt: { type: Date, default: Date.now }

},{ timestamps: true });
const Conversation = mongoose.model('Conversation', conversationSchema);
export default Conversation;