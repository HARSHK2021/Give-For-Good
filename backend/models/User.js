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
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    /// google auth
  googleUserId: {
  type: String,
},
///

favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item', // Reference to Product model
}],
avatar:{
    type:String,
},
//// social links
socialLinks: {
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' }, 
},
bio:{
    type:String,
    default:""
},
stats:{
    level: {
        type: String,
        default: 'Bronze',
    },
    itemsSold: {
        type: Number,
        default: 0,
    },
    totalListing: {
        type: Number,
        default: 0,
    },
    rating: {
        type: Number,
        default: 0,
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ]
    ,
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    badges: {
        type: [String],
        default: ['New Member'],
    },
    point:{
        type: Number,
        default: 0,
    }
   
    
}

    
}, { timestamps: true });
 const User = mongoose.model("User", userSchema);
export default User;

