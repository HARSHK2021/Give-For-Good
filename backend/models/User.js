import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
         type: String,
  required: false, // make optional for OAuth
    },
    phone: {
        type: String,
        required: false,
        unique: true, // ensure phone number is unique
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    /// google auth
  googleUserId: {
  type: String,
}

    

}, { timestamps: true });
 const User = mongoose.model("User", userSchema);
export default User;