
import Item from "../models/Item.js";
import User from "../models/User.js";
import imagekit from "../utils/imageKit.js";

export const addItem = async (req, res) => {
  try {
    // console.log("add item reached");
    // console.log(req.body);
    // console.log(req.files);

    const {
      title,
      description,
      category,
      condition,
      whyIamSharing,
      postedBy,
      address,
      location
    } = req.body;

    const files = req.files;
    const safeCategory = category.replace(/[^a-zA-Z0-9]/g, '_'); 
    const folderPath = `items/${safeCategory}`;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "Images are required" });
    }

    // 🔧 Parse and validate address and location
    const parsedAddress = JSON.parse(address); // stringified from frontend
    const parsedLocation = JSON.parse(location); // also stringified

    if (
      !parsedLocation ||
      !Array.isArray(parsedLocation.coordinates) ||
      parsedLocation.coordinates.length !== 2
    ) {
      return res.status(400).json({ message: "Invalid location coordinates" });
    }

    const coordinates = parsedLocation.coordinates.map(coord => parseFloat(coord));
    if (coordinates.some(isNaN)) {
      return res.status(400).json({ message: "Coordinates must be numbers" });
    }

    // 🔧 Upload images
    const imageUrls = [];
    for (const file of files) {
      const uploaded = await imagekit.upload({
        file: file.buffer,
        fileName: file.originalname,
        folder: folderPath,
      });
      imageUrls.push(uploaded.url);
    }

    // 🔧 Create item in DB
    const item = await Item.create({
      title,
      description,
      condition,
      category,
      whyIamSharing,
      images: imageUrls,
      address: parsedAddress,
      location: {
        type: "Point",
        coordinates: coordinates, // [lng, lat]
      },
      postedBy,
    });

    return res.status(201).json({ message: "Item added", item });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong. Can't add item" });
  }
};


/// get all items 

export const getAllItems = async (req,res)=>{
  try {
    // console.log("get all items reached");
    const items = await Item.find({});
    res.status(200).json({ success: true, items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch items" });
  }
  
}






export const getItems = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      title,
      sortBy = 'newest',
      lat,
      lng,
    } = req.query;

    const query = {
      isClaimed: false,
      expiresAt: { $gt: new Date() },
    };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (title) {
      query.title = { $regex: title, $options: 'i' };
    }

    const skip = (page - 1) * limit;
    const parsedLimit = parseInt(limit);

    let sortOption = { createdAt: -1 };

    if (sortBy === 'nearest' && lat && lng) {
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: 20000, // 20km
        },
      };
      sortOption = {}; // No sort; geospatial gives by proximity
    }

    const items = await Item.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(parsedLimit);

    const totalCount = await Item.countDocuments(query);
    const totalPages = Math.ceil(totalCount / parsedLimit);

    res.status(200).json({
      page: Number(page),
      totalPages,
      items,
    });
  } catch (err) {
    console.error('Error in getItems:', err);
    res.status(500).json({ error: 'Server Error' });
  }
};




/// get item details by id
export const getItemDetails = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Item ID is required" });
    }

    const item = await Item.findById(id).populate('postedBy'); /// claimedBy  laater
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json({ success: true, item });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch item details" });
}
}


/// add to favorites

export const addToFavorites = async (req, res) => {
  try {               
    // console.log("add to favorites reached");
    // console.log(req.body);
    // console.log(req.userId); // from protectUser middleware
    const userId = req.userId; // from protectUser middleware
    const { itemId } = req.body;

    if (!userId || !itemId) {
      return res.status(400).json({ message: "User ID and Item ID are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const alreadyFavorite = user.favorites.some(fav => fav.toString() === itemId);
    if (alreadyFavorite) {
      return res.status(201).json({
        success: true,
        favorites: user.favorites, // return clean array of favorite IDs
         message: "Item already in favorites" });
    }

    user.favorites.push(itemId);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Item added to favorites",
      favorites:user.favorites // return clean array of favorite IDs
    });
    // console.log("Item added to favorites", user.favorites);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong. Can't add to favorites" });
  }
};



/// removve favorites
export const removeFromFavorites = async (req, res) => {
  try {
    // console.log("remove from favorites reached");
    const userId = req.userId; // again from protectUser middleware
    const { itemId } = req.body;

    if (!userId || !itemId) {
      return res.status(400).json({ message: "User ID and Item ID are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.favorites = user.favorites.filter(fav => fav.toString() !== itemId);
    await user.save();

    // console.log("Item removed from favorites", user.favorites);

    res.status(200).json({
      success: true,
      message: "Item removed from favorites",
      favorites: user.favorites // again, return clean array
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong. Can't remove from favorites" });
  }
};



/// get favorites/:userId
export const getFavorites = async (req, res) => {
 
  /// get favrotes item of user and return array of whole items
  try {
    const userId = req.userId; // from protectUser middleware

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId).populate('favorites');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      favorites: user.favorites // this will return an array of item objects
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch favorites" });
  }
  
};



/// delete item by id
export const deleteItem = async (req, res) => {
  try {
    console.log(
      "delete item reached"
    )
    const { id } = req.params;
    const userId = req.userId; // from protectUser middleware
    console.log("Deleting item ID:", id);
    console.log("User ID:", userId);

    if (!id || !userId) {
      return res.status(400).json({ success:false, message: "Item ID and User ID are required" });
    }

    const item = await Item.findById(id).populate('postedBy');
    if (!item) {
      return res.status(404).json({ success:false,message: "Item not found" });
    }
    

    if (!item.postedBy._id.equals(userId)) {
      return res.status(403).json({success:false, message: "You can only delete your own items" });
    }

    await Item.findByIdAndDelete(id);
    await User.updateMany(
      { favorites:id },// remove from all users' favorites
      { $pull: { favorites: id } } // remove from user's favorites
    );
    res.status(200).json({ success: true, message: "Item deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to delete item" });
  }
};  