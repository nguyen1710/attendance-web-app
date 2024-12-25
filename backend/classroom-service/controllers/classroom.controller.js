import Classroom from "../models/classroom.model.js"
import authMiddleware from "../middlewares/authMiddleware.js"
import mongoose from "mongoose"
import User from "../models/user.model.js"
import { sendInviteEmail } from "../nodeMailer/emails.js"
import xlsx from 'xlsx'
export const createClassroom = [authMiddleware , async (req, res) => {
    try {
        const {name, description} = req.body

        if (!name) {
            return res.status(400).json({ success: false, message: 'Classroom name is required' });
        }

        const classroom = new Classroom({
            owner: req.userId,
            name: name,
            description: description,
            teacherIds: [new mongoose.Types.ObjectId(req.userId)]
        })

        await classroom.save()

        return res.status(201).json({
            success: true,
            message: "Classroom created successfully",
            classroom: classroom
        })
    } catch (error) {
        console.error('Error creating classroom:', error.message);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}]

export const getClassrooms = [authMiddleware, async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.userId)
        const userRole = req.userRole
        console.log(typeof(userId))
        if (userRole == 'teacher') {
            const classrooms = await Classroom.find({teacherIds: {$in : [userId]}})
            console.log(req.userId)
            if(classrooms.length == 0) {
                return res.status(404).json({ success: false, message: 'Class not found' });
            }
    
            return res.status(200).json({
                success: true,
                message: 'Get classes successfully',
                classes: classrooms
            })
        }

        // const studentId = new mongoose.Types.ObjectId(req.userId);
        const classrooms = await Classroom.find({
            studentIds: { 
                $all: [userId]
            }
        })
        
        console.log(classrooms)
        if(classrooms.length == 0) {
            return res.status(404).json({ success: false, message: 'Class not found' });
        }

        return res.status(200).json({
            success: true,
            message: 'Get classes successfully',
            classes: classrooms
        })
        
        
        
    } catch (error) {
        console.error('Error get classroom:', error.message);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}]

export const deleteClassroom = [authMiddleware, async (req, res) => {
    try {
        const { id } = req.params
        const classroom = await Classroom.findById(id)
        if(!classroom) {
            return res.status(404).json({
                success: "false",
                message: "Classroom not found"
            })
        }
        console.log(req.userId)
        console.log(classroom.owner.toString())
        if(classroom.owner.toString() != req.userId) {
            return res.status(403).json({ success: false, message: "You do not have permission to delete this classroom" });
        }

        await Classroom.findByIdAndDelete(id)

        return res.status(200).json({
            success: true,
            message: "Classroom deleted successfully"
        });
    } catch (error) {
        console.log("Error when delete class", error)
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}]

export const addStudent = [authMiddleware, async (req, res) => {
    try {
        // const { id } = req.params
        const { id, email } = req.body

        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }
        const classroom = await Classroom.findById(id)
        if(!classroom) {
            return res.status(404).json({
                success: "false",
                message: "Classroom not found"
            })
        }
        console.log(req.userId)
        console.log(classroom.owner.toString())
        if(classroom.owner.toString() != req.userId) {
            return res.status(403).json({ success: false, message: "You do not have permission to delete this classroom" });
        }

        const user = await User.findOne({email})
        classroom.studentIds.push(user._id)
        await classroom.save()

        sendInviteEmail(email, user.username, classroom.name)
        return res.status(200).json({
            success: true,
            message: ` Add ${email} successfully`
        });
    } catch (error) {
        console.log("Error when add student", error)
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}]

export const handleExcelUpload = async (req, res) => {
    try {
        // Đọc file Excel từ request
        const {id} = req.body
        const file = req.file;  // Giả sử bạn sử dụng middleware như multer để tải file
        if (!file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        // Đọc file Excel
        const workbook = xlsx.read(file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];  // Chọn sheet đầu tiên
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);


        // Gửi email cho từng học sinh trong file
         // Duyệt qua từng học sinh trong file và gửi email
         for (const student of data) {
            const email = student.email.toString();  // Cột email
            const name = student.name.toString();    // Cột tên
            console.log(email)
            if (email && name) {
                const classroom = await Classroom.findById(id)
                const user = await User.findOne({email: email})
                if(!user) {
                    console.log("Cannot find user")
                }
                sendInviteEmail(email, name, classroom.name)
                classroom.studentIds.push(user._id)
                await classroom.save()
            } else {
                console.log('Missing email or name for student:', student);
            }
        }

        return res.status(200).json({
            success: true,
            message: 'Emails sent successfully',
        });
    } catch (error) {
        console.error('Error processing file:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
