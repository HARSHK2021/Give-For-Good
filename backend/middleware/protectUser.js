import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protectUser = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        console.log(token)
        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized No Token" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }


        req.user = user;
        req.userId = user._id;
     
        next();
        
    } catch (error) {

        res.status(401).json({ success: false, message: "Unauthorized" });
        
    }
}
export default protectUser;