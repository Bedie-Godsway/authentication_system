import UserModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import Joi from "joi";

// Joi schema for user registration validation
const userValidationSchema = Joi.object({
    username: Joi.string().min(3).max(30).required().messages({
        "string.base": "Username must be a string",
        "string.min": "Username should have a minimum length of {3}",
        "string.max": "Username should have a maximum length of {30}",
        "any.required": "Username is required"
    }),
    email: Joi.string().email().required().messages({
        "string.base": "Email is required",     // Email must be string
        "string.email": "Valid email is required",
        "any.required": "Email is required"
    }),
    password: Joi.string().min(6).required().messages({
        "string.base": "Password is required",  // Password must be a string
        "string.min": "Password must be at least 6 characters long",
        "any.required": "Password is required"
    })
})

// Register a new user
export const register = async (req, res) => {
    // Extract user details from request body
    const {username, email, password} = req.body;// Can we say that the username, email and password are the cpmponents that will form the body of the request hence const {username, email, password} = req.body?

    // Validate user input using Joi Schema
    const {error} = userValidationSchema.validate({username, email, password});
    if (error) {
        return res.status(400).json({message: error.details[0].message});
    }

  
    try {
        // Check if the user already exists
        let user = await UserModel.findOne({email});

        // If user exists, return an error
        if(user) {
            return res.status(400).json({message: "User already exists"});
        }

        // Create a new user instance
        user = new UserModel({
            username, 
            email, 
            password
        });

        // Hash the password before saving

        // Generate a salt
        const salt = await bcrypt.genSalt(10);
        // Hash the password with the salt
        user.password = await bcrypt.hash(password, salt);

        // Save the user to the database
        await user.save();

        // Generate a JWT token for the user
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "1h"});

        return res.status(201).json({
            message: `User: ${username} registered successfully`,
            token
        });

    } catch (error) {
        return res.status(500).json({message: "Server error"});
    }
}

// Login a user

export const login = async (req, res) => {
    // Extract login details from request body
    const {email, password} = req.body;

    try {
        // Find the user by email
        const user = await UserModel.findOne({email});

        // If user not found, return an error
        if (!user) {
            return res.status(400).json({message: "Invalid email or password"});
        }

        // Compare the provided password with the stored hashed password
        const PasswordMatch = await bcrypt.compare(password, user.password);

        if (!PasswordMatch) {
            return res.status(400).json({message: "Invalid email or password"});
        }

        // Generate a JWT token for the user
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "1h"});

        return res.status(200).json({
            message: `User: ${user.email} logged in successfully`,
            token
        });

    } catch (error) {
        return res.status(500).json({message: "Server error"});
    }
}

// Get user profile
export const getProfile = async (req, res) => {
    try {
        // Find the user by ID, excluding the password field
        const user = await UserModel.findById(req.user.id).select("-password"); 

        // If user not found, return an error
        if (!user) {
            return res.status(400).json({message: "User not found"});
        }

        // Return the user profile
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({message: "Server error"});
    }
}

// Logout a user
export const logout = async (req, res) => {
    // For JWT, logout is typically handled on the client side by deleting the token.
    return res.status(200).json({message: "User logged out successfully"});
}