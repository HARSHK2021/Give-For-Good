import express from "express";
import protectUser from "../middleware/protectUser.js";
import { addItem, getAllItems } from "../controllers/itemController.js";
import { upload } from "../utils/multer.js";



const router = express.Router();

router.post("/addItem", upload.array("images", 5),addItem);
router.get("/getall" ,protectUser,getAllItems);
export default router;