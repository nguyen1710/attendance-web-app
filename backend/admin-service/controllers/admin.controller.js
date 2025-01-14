import User from "../models/admin.model.js";
import Classroom from "../models/classroom.model.js";
import dotenv from 'dotenv'
import bcrypt from "bcrypt"

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
                    password: user.password,
                    imageUrl: user.imageUrl || "",
                    username: user.username,
                    phone: user.phone || "",
                    address: user.address || "",
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


export const getAllClients = async (req, res) => {
    try {
        const user = await User.find();
        res.status(200).json(user);
    }catch (error) {
        console.error("Error retrieving clients:", error);
        res.status(500).json({ message: "Error retrieving clients" });
    }
}


export const getAllClassrooms = async(req, res) => {
    try {
        const classroom = await Classroom.find();
        res.status(200).json(classroom);
    }catch (error){
        console.error("Error:", error)
        res.status(500).json({message:"Error retrieving classrooms"});
    }
}


export const updateProfile = async(req, res) => {
    const { 
        _id,
        email, 
        username, 
        phone, 
        address, 
        password, 
        imageUrl
    } = req.body;

    console.log(req.body);

    try {
    // Tìm người dùng bằng email
    const user = await User.findOne({ _id });
    if (!user) {
        return res.status(404).json({ message: "User not found." });
    }

    // Cập nhật thông tin người dùng
    if (imageUrl) user.imageUrl = imageUrl;
    if (username) user.username = username;
    if(email) user.email = email;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    // Hash mật khẩu mới nếu có thay đổi
    if (password) {
        const saltRounds = 10; // Độ mạnh của salt
        user.password = await bcrypt.hash(password, saltRounds);
    }

    // Lưu thông tin người dùng vào cơ sở dữ liệu
    await user.save();

    return res.status(200).json({
        message: 'Profile updated successfully!',
        updatedUser: user
    });

    } catch (error) {
        console.error("Error updating user information:", error);
        res.status(500).json({
            success: false,
            message: "Error updating user information.",
            error: error.message,
        });
    }
}