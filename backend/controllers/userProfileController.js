import Item from "../models/Item.js";
import User from "../models/User.js";

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id; // Use the ID from request params or authenticated user
    const userProfile = await User.findById(userId)
      .populate("favorites")
      .populate("stats.followers")
      .populate("stats.following")
      .select("-password -__v"); // Exclude sensitive fields

    if (!userProfile) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res
      .status(200)
      .json({ success: true, message: "user profile fetched", userProfile });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.userId; // Use the authenticated user's ID
    const user = await User.findById(userId).select("-password -__v");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const fields = ["name", "avatar", "bio", "phone", "socialLinks"];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//// follow a user
export const followUser = async (req, res) => {
  const targetUser = await User.findById(req.params.id);
  const currentUser = await User.findById(req.user._id);
  if (!targetUser || !currentUser)
    return res.status(404).json({ message: "User not found" });

  if (targetUser._id.equals(currentUser._id)) {
    return res.status(400).json({ message: "Cannot follow yourself" });
  }
  if (!currentUser.stats.following.includes(targetUser._id)) {
    currentUser.stats.following.push(targetUser._id);
    targetUser.stats.followers.push(currentUser._id);

    await currentUser.save();
    await targetUser.save();
  }
  res.status(200).json({
    success: true,
    message: "User followed successfully",
  });
};

/// unfollow a user
export const unfollowUser = async (req, res) => {
  try {
    const target = await User.findById(req.params.id);
    const current = await User.findById(req.userId);

    if (!target || !current) return res.status(404).json({ message: "User not found" });

    current.stats.following.pull(target._id);
    target.stats.followers.pull(current._id);

    await current.save();
    await target.save();

    res.status(200).json({ success: true, message: "User unfollowed" });
  } catch (err) {
    console.error("Unfollow error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


/// get my listings of user by return array of items that user has listed 
// controllers/itemController.js


export const getItemsByUser = async (req, res) => {
  const { id } = req.params;
  console.log("Fetching items for user ID:", id);
  console.log(id);

  try {
    const items = await Item.find({ postedBy: id })
      .sort({ createdAt: -1 })
      .populate("postedBy", "name avatar"); // Optional: populate user info

    res.status(200).json({ success: true, items });
  } catch (error) {
    console.error("Error fetching user items:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
