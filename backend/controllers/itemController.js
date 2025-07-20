
import Item from "../models/Item.js";
import imagekit from "../utils/imageKit.js";

export const addItem = async (req, res) => {
  try {
    console.log("add item reached");
    console.log(req.body);
    console.log(req.files);

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
    console.log("yaya")
    const items = await Item.find({});
    res.status(200).json({ success: true, items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch items" });
  }
  
}


/// get item by filter 


// GET /api/items?limit=10&page=1
// controllers/itemController.js



export const getItems = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      title,
      sort = "newest",
      longitude,
      latitude,
    } = req.query;

    const filters = {};
    if (category) filters.category = category;
    if (title) filters.title = { $regex: title, $options: "i" };

    // Location-based filtering (within 10km radius)
    if (latitude && longitude) {
      filters.location = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: 10000, // 10km
        },
      };
    }

    // Sorting
    let sortBy = { createdAt: -1 };
    if (sort === "nearest" && latitude && longitude) {
      sortBy = {}; // already sorted by $near
    } else if (sort === "oldest") {
      sortBy = { createdAt: 1 };
    }

    const items = await Item.find(filters)
      .sort(sortBy)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate("postedBy", "name");

    const total = await Item.countDocuments(filters);

    res.json({
      items,
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

