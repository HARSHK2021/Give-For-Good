
import Item from "../models/Item.js";
import imagekit from "../utils/imageKit.js";

export const addItem = async( req,res)=>{
    try {
        const { title, description, category, latitude, longitude,address} = req.body;
        const files = req.files; // from multer middleware
        const folderPath = `items/${category}`; // category-wise folder
         if (!files || files.length === 0) {
      return res.status(400).json({ message: "Images are required" });
    }
    const imageUrls = [];
       for (const file of files) {
      const uploaded = await imagekit.upload({
        file: file.buffer,
        fileName: file.originalname,
        folder: folderPath,
      });

      imageUrls.push(uploaded.url);
    }
    const item = await Item.create({
        title,
        description,
        images:imageUrls,
         category,
          location: {
        type: "Point",
        coordinates: [longitude, latitude],
        
      },
      address,
      postedBy:req.user._id,

    
    });
     return res.status(201).json({ message: "Item added", item });
        
    } catch (error) {
        console.error(error); 
         res.status(500).json({ message: "Something went wrong Can't add item" });
         

    }

}

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

