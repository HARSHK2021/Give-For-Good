import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateCodeVerifier, generateState, decodeIdToken } from "arctic";
import { Google } from "arctic";
import dotenv from "dotenv";
dotenv.config();

/// google function to generate url
const google = new Google(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "https://give-for-good.onrender.com/api/auth/google/callback"
);

export const register = async (req, res) => {
  try {
    // console.log("Registering user with data:", req.body);
    const { name, email, password, phone, avatar } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      avatar,
    });
    await newUser.save();
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res
      .status(201)
      .json({
        success: true,
        message: "User created successfully",
        user: newUser,
        token: token,
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
    console.log(error);
  }
};

// Login a user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res
      .status(200)
      .json({ success: true, message: "Login successful", user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};

// Logout a user
export const logout = async (req, res) => {
  try {
    // console.log("into the logout function")
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });
    //   console.log(" step 2 ---------------------")
    return res
      .status(200)
      .json({ success: true, message: "Logout successful" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
    console.log(error);
  }
};

export const getGoogleLoginPage = async (req, res) => {
  // console.log("Redirecting to Google login page");
  if (req.user) return res.redirect("/");
  const state = generateState();
  // console.log("Generated state:", state);
  const codeVerifier = generateCodeVerifier();
  // console.log("Generated code verifier:", codeVerifier);
  const url = google.createAuthorizationURL(state, codeVerifier, [
    "openid",
    "profile",
    "email",
  ]);
  // console.log("step 1 for Oauth completed");

  // console.log("Google authorization URL:", url.toString());
  res.cookie("google_oauth_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 1000, // 1 hour
  });
  res.cookie("google_code_verifier", codeVerifier, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 1000, // 1 hour
  });
  // console.log("Cookies set for Google OAuth state and code verifier");
  res.redirect(url.toString());
};

export const getGoogleLoginCallback = async (req, res) => {
  // console.log('reached callback function ')
  const { code, state } = req.query;
  // console.log("Google callback received with code:", code, "and state:", state);
  // console.log(req.cookies)
  const cookieState = req.cookies.google_oauth_state;
  const codeVerifier = req.cookies.google_code_verifier;

  if (!state || !code || state !== cookieState) {
    return res.redirect("/login");
  }
  let tokens;
  try {
    tokens = await google.validateAuthorizationCode(code, codeVerifier);
  } catch (error) {
    console.error("Error getting tokens:", error);
    req.flash("error", "Failed to authenticate with Google");
    return res.redirect("/login");
  }

  const claims = decodeIdToken(tokens.idToken());
  const { sub: googleUserId, email, name, picture } = claims;

  // console.log("Google user ID:", googleUserId, "Email:", email, "Name:", name, "picture",picture);
  let user = await User.findOne({ googleUserId });
  if (!user) {
    user = new User({
      googleUserId,
      email,
      name,
      password: null, // No password for OAuth users
      avatar: picture,
    });
    await user.save();
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });
  //    return  res.status(200).json({ success: true, message: "Login successful", user, token });

  return res.redirect("https://give-for-good-swart.vercel.app");
};

// verify token and provide user
export const verifyToken = async (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    // console.log("token from ",token)
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized No Token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    // console.log(user)
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    return res.status(201).json({
      success: true,
      message: "User Verified ",
      user,
      token: token,
    });
  } catch (error) {
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

/// get user

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    //    console.log(user)

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    return res
      .status(200)
      .json({ message: "Successfully fetched user", success: true, user });
  } catch (error) {
    console.error("Error in getUser:", error);
    res.status(500).json({ message: "Server error" });
  }
};
