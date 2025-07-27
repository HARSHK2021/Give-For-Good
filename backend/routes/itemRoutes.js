import express from "express";
import protectUser from "../middleware/protectUser.js";
import { addItem, getAllItems, getItemDetails, getItems,addToFavorites,removeFromFavorites,getFavorites, deleteItem  } from "../controllers/itemController.js";
import { upload } from "../utils/multer.js";



const router = express.Router();

router.post("/addItem", upload.array("images", 5),addItem);
router.get("/getItems" , getItems);
router.get("/getitem/:id", getItemDetails);
router.get("/getAllItems", getAllItems);


router.post("/addToFavorites",protectUser,addToFavorites);
router.post("/removeFromFavorites", protectUser, removeFromFavorites);
router.get("/getFavorites", protectUser, getFavorites);

router.delete("/deleteItem/:id", protectUser,deleteItem )




export default router;

