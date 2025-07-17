import express from "express";
import { Router } from "express";
import protectUser from "../middleware/protectUser.js";
import {register,login, getGoogleLoginCallback,getGoogleLoginPage, logout, getUser} from "../controllers/authController.js";

const router = Router();
router.post("/register",register);
router.post("/login",login);
router.get("/google", getGoogleLoginPage);
router.get("/google/callback",getGoogleLoginCallback);
router.post("/logout",protectUser,logout);

router.get("/getuser",protectUser,getUser)
export default router;








