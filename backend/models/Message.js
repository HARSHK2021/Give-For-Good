import mongoose from "mongoose";
const messageSchema = new mongoose.Schema({
   conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' },
  sender: { type:  mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: String,
  edited: { type: Boolean, default: false },
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

},{ timestamps: true,
}
);

const Message = mongoose.model('Message', messageSchema);
export default Message;
