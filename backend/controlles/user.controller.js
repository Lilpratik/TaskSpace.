const User = require("../models/User.js");
const generateToken = require("../utils/generateToken.js");
const bcrypt = require("bcryptjs");

/* 
Register user controller
*/

const registerUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required!"
            });
        }

        // checking existing user in the db
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // save the user in the database 
        const user = await User.create({
            email,
            password
        });

        // generate token 
        const token = generateToken(user._id);

        return res.status(201).json({
            message: "User created successfully",
            user: {
                email: user.email,
            },
            token,
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};


/* 
Login user controller 
*/

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required!"
            });
        }

        // find the user 
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "User not found!"
            });
        }

        // compare the password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid Password"
            });
        }

        const token = generateToken(user._id);

        return res.status(200).json({
            message: "User login successfully",
            user: {
                _id: user._id,
                email: user.email,
            },
            token,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    registerUser,
    loginUser
};