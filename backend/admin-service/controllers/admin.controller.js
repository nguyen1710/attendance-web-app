import User from "../models/admin.model.js";
import Classroom from "../models/classroom.model.js";
import AttendanceSession from "../models/attendance.model.js";

import dotenv from 'dotenv'
import bcryptjs from "bcryptjs";

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
        
        const isPasswordValid = await bcryptjs.compare(password, user.password)
        if(!isPasswordValid) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Invalid password"
                }
            )
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
        const user = await User.find({
            role: { $ne: "admin" }
        });
        res.status(200).json(user);
    }catch (error) {
        console.error("Error retrieving clients:", error);
        res.status(500).json({ message: "Error retrieving clients" });
    }
}

export const getNewClients = async (req, res) => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const newClients = await User.find({
            role: { $ne: "admin" },
            createAt: { $gte: sevenDaysAgo }
        }).select('-password') 
          .sort({ createAt: -1 }); 

        const response = {
            count: newClients.length,
            timeframe: "Last 7 days",
            clients: newClients
        };

        res.status(200).json(response);
    } catch (error) {
        console.error("Error retrieving new clients:", error);
        res.status(500).json({ 
            success: false,
            message: "Error retrieving new clients",
            error: error.message 
        });
    }
};

export const getClientsByStatus = async (req, res) => {
    try {
        const totalClients = await User.countDocuments({ role: { $ne: "admin" } });

        const inactiveCount = await User.countDocuments({ role: { $ne: "admin" }, status: "Inactive" });

        const activeCount = totalClients - inactiveCount;

        res.status(200).json({
            success: true,
            message: "Client counts by status retrieved successfully",
            active: activeCount,
            inactive: inactiveCount
            
        });
    } catch (error) {
        console.error("Error retrieving client counts by status:", error);
        res.status(500).json({ 
            success: false,
            message: "Error retrieving client counts by status",
            error: error.message 
        });
    }
};

export const getClientsByEmail = async(req, res) => {
    const {email} = req.body;
    try {
        const client = await User.findOne({ email });
        if (!client) {
          return res.status(404).json({ success: false, message: 'Client not found.' });
        }
        res.status(200).json(client);
    } catch (error) {
    console.error('Error retrieving client:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
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
    const user = await User.findOne({ _id });
    if (!user) {
        return res.status(404).json({ message: "User not found." });
    }

    if (imageUrl) user.imageUrl = imageUrl;
    if (username) user.username = username;
    if(email) user.email = email;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    if (password) {
        const saltRounds = 10; // Độ mạnh của salt
        user.password = await bcryptjs.hash(password, saltRounds);
    }

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

export const deleteClient = async (req, res) => {
    const { clientId } = req.body;  

    try {
        const result = await User.deleteOne({ _id: clientId });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Client not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Client deleted successfully!"
        });

    } catch (error) {
        console.error("Error deleting client:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting client.",
            error: error.message,
        });
    }
};


export const blockClient = async (req, res) => {
    const { clientId, status } = req.body;  


    try {
        const user = await User.findById(clientId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Client not found"
            });
        }

        if(status) user.status = status;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Client blocked successfully!",
        });
    } catch (error) {
        console.error("Error blocking client:", error);
        res.status(500).json({
            success: false,
            message: "Error blocking client.",
            error: error.message,
        });
    }
};

export const getAttendanceByClassroomId = async (req, res) => {
    const {classId} = req.body;
    try {
        
        const attendance = await AttendanceSession.find({classroomId: classId});

        if (!attendance || attendance.length === 0) {
            return res.status(404).json({ message: "No attendance data found for this classroom." });
        }

        res.status(200).json(attendance);

    }catch (error){
        console.error("Error:", error)
        res.status(500).json({message:"Error retrieving attendance"});
    }
}