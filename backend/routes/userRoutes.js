import express from 'express';
import { Router } from "express";
import protectUser from "../middleware/protectUser.js";
import { followUser, getItemsByUser, getUserProfile, unfollowUser, updateUserProfile } from '../controllers/userProfileController.js';


const router = Router();

router.get("/get/:id", protectUser, getUserProfile);
router.put("/update", protectUser, updateUserProfile);
router.post("/follow/:id", protectUser, followUser);

router.post("/unfollow/:id", protectUser, unfollowUser);

router.get("/mylistings/:id", protectUser,getItemsByUser)


export default router;



