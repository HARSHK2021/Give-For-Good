import express from "express";
import { Router } from "express";
import protectUser from "../middleware/protectUser.js";
import {register,login, getGoogleLoginCallback,getGoogleLoginPage, logout, getUser, verifyToken} from "../controllers/authController.js";

const router = Router();
router.post("/register",register);
router.post("/login",login);
router.get("/google", getGoogleLoginPage);
router.get("/google/callback",getGoogleLoginCallback);
router.post("/logout",logout);
router.get("/verifyToken",verifyToken);

router.get("/getuser",protectUser,getUser);
export default router;








