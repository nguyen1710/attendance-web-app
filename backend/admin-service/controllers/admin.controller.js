import User from "../models/admin.model.js";

import dotenv from 'dotenv'
dotenv.config()

export const login = async (req, res) => {
    const {email, password} = req.body
    try {
        if(!email || !password ){
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const user = await User.findOne({email})
        if(!user) {
            return res.status(404).json({
                success: false,
                message: "Admin not found",
            });
        }
        
        if (password !== user.password) {
            return res.status(400).json({ success: false, message: "Invalid password" });
        }

        if (user.role !== "admin") {
            return res.status(403).json({
              success: false,
              message: "Access denied. Only admins are allowed to login.",
            });
          }
        
        console.log(user)
        res.status(200).json(
            {
                success: true,
                message: "Login verify successfuly",
                user: {
                    _id: user._id,
                    email: user.email,
                    username: user.username,
                    isVerified: user.isVerified,
                    lastLogin: user.lastLogin,
                    createAt: user.createAt,
                    updatedAt: user.updatedAt,
                    role: user.role,  // Đảm bảo bạn trả về trường role ở đây
                }
            }
        )
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}