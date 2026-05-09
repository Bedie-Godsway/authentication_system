import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";
import "dotenv/config";


// Middleware to authenticate user using JWT || protected routes

export const protect = async (req, res, next) => {
    // Get token from header s.
    let token;

    // Check if authorization header is present and starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            // Get token from header and split it
            token = req.headers.authorization.split(" ")[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token and attach to request object
            req.user = await UserModel.findById(decoded.id).select("-password");

            // Proceed to the next middleware or route handler
            next();

        } catch (error) {
            return res.status(401).json({message: "Not authorized, token failed"});
        }
    }
}


















