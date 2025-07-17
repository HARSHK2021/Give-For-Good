// models/Item.js

import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    images: {
      type: [String], // URLs of images (e.g., from Cloudinary or other)
      required: true,
    },

    category: {
      type: String,
      required: true,
      enum: ["electronics", "clothing", "books", "furniture", "toys", "others"],
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },

    address: {
      type: String, // Optional, human-readable address
    },

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    isClaimed: {
      type: Boolean,
      default: false,
    },

    expiresAt: {
      type: Date,
       default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      required: true, // used to auto-remove expired listings
    },
  },
  { timestamps: true }
);

// Enable geospatial index
itemSchema.index({ location: "2dsphere" });

const Item = mongoose.model("Item", itemSchema);
export default Item;
