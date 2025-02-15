import authMiddleware from "../middlewares/authMiddleware.js"
import mongoose from "mongoose"
import User from "../models/user.model.js";
import Classroom from "../models/classroom.model.js";
import { sendInviteEmail } from "../nodeMailer/emails.js"
import xlsx from 'xlsx'
import AttendanceSession from "../models/attendance.model.js";
export const createClassroom = [authMiddleware , async (req, res) => {
    try {
        const {name, description} = req.body

        if (!name) {
            return res.status(400).json({ success: false, message: 'Classroom name is required' });
        }

        const classroom = new Classroom({
            owner: req.userEmail,
            name: name,
            description: description,
            teacherEmails: [req.userEmail]
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

export const getAllClassrooms = [authMiddleware, async (req, res) => {
    try {
        const userEmail = req.userEmail;

        // Lấy tất cả các lớp mà user thuộc một trong các vai trò
        const classrooms = await Classroom.find({
            $or: [
                { teacherEmails: { $in: [userEmail] } }, // Là teacher
                { studentEmails: { $all: [userEmail] } }, // Là student
                { owner: userEmail } // Là owner
            ]
        });

        // Kiểm tra nếu danh sách lớp trống
        if (classrooms.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No classes found',
                classes: []
            });
        }

         // Lấy thông tin avatar của owner cho mỗi lớp
         const populatedClassrooms = await Promise.all(
            classrooms.map(async (classroom) => {
                const user = await User.findOne({ email: classroom.owner });
                return {
                    ...classroom._doc, // Chuyển đổi dữ liệu lớp học từ mongoose document
                    ownerAvatar: user?.imageUrl || null, // Thêm trường ownerAvatar
                };
            })
        );

        // Trả về danh sách các lớp học
        return res.status(200).json({
            success: true,
            message: 'Get classes successfully',
            classes: populatedClassrooms
        });

    } catch (error) {
        console.error('Error getting classrooms:', error.message);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}]

export const deleteClassroom = [authMiddleware, async (req, res) => {
    try {
        const { classId } = req.params
        const objectId = new mongoose.Types.ObjectId(classId); // Chuyển đổi id sang ObjectId
        
        const classroom = await Classroom.findById(classId)
        if(!classroom) {
            return res.status(404).json({
                success: "false",
                message: "Classroom not found"
            })
        }
        console.log(req.userEmail)
        console.log(classroom.owner.toString())
        if(classroom.owner.toString() != req.userEmail) {
            return res.status(403).json({ success: false, message: "You do not have permission to delete this classroom" });
        }

        // const attendances = await AttendanceSession.find({classroomId: id})
        await AttendanceSession.deleteMany({ classroomId: objectId });

        await Classroom.findByIdAndDelete(classId)

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
        console.log(req.userEmail)
        console.log(classroom.owner.toString())
        if(classroom.owner.toString() != req.userEmail) {
            return res.status(403).json({ success: false, message: "You do not have permission to delete this classroom" });
        }

        console.log(email)
        // const user = await User.findOne({email: email})
        classroom.studentEmails.push(email)
        await classroom.save()

        sendInviteEmail(email,classroom.name)
        return res.status(200).json({
            success: true,
            message: ` Add ${email} successfully`
        });
    } catch (error) {
        console.log("Error when add student", error)
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}]

export const addTeacher = [authMiddleware, async (req, res) => {
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

        if(classroom.owner.toString() != req.userEmail) {
            return res.status(403).json({ success: false, message: "You do not have permission to delete this classroom" });
        }

        // const user = await User.findOne({email: email})
        classroom.teacherEmails.push(email)
        await classroom.save()
        return res.status(200).json({
            success: true,
            message: ` Add ${email} successfully`
        });
    } catch (error) {
        console.log("Error when add student", error)
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}]

export const deleteStudentInClass = [authMiddleware, async (req, res) => {
    const {classId, userEmail} = req.body
    try {
        await Classroom.updateOne(
            { _id: classId },
            {
                $pull: {
                    teacherEmails: userEmail,  // Xóa khỏi danh sách teacherEmails nếu có
                    studentEmails: userEmail  // Xóa khỏi danh sách teacherEmails nếu có
                }
            }
        );
        return res.status(200).json({
            success: true,
            message: ` Delete ${userEmail} out of classroom successfully`
        });
    } catch (error) {
        console.error('Lỗi khi xóa user:', error);
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
                sendInviteEmail(email, classroom.name)
                classroom.studentEmails.push(user.email)
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

export const getDetailClass = [authMiddleware, async (req, res) => {
    try {
        // const { id } = req.params
        const { classId } = req.params

        const classroom = await Classroom.findById(classId)
        if(!classroom) {
            return res.status(404).json({
                success: "false",
                message: "Classroom not found"
            })
        }
        console.log(classroom.owner)

        return res.status(200).json({
            success: true,
            message: ` Get classroom success`,
            classroom: classroom
            
        });
    } catch (error) {
        console.log("Error when add student", error)
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}]

export const getUserFromClass = [authMiddleware, async (req, res) => {
    try {
        // const { id } = req.params
        const { classId } = req.params

        const classroom = await Classroom.findById(classId)
        if(!classroom) {
            return res.status(404).json({
                success: "false",
                message: "Classroom not found"
            })
        }
        // console.log(req.userEmail)
        // console.log(classroom.owner.toString())
        // if(classroom.owner.toString() != req.userEmail) {
        //     return res.status(403).json({ success: false, message: "You do not have permission to delete this classroom" });
        // }

        console.log(classroom.studentEmails)
        const students = []

        const teachers = []

        for (const email of classroom.studentEmails) {
            const student = await User.findOne({email: email})
            students.push(student)
        }
        // classroom.studentEmails.push(email)
        // await classroom.save()
        for (const email of classroom.teacherEmails) {
            const teacher = await User.findOne({email: email})
            teachers.push(teacher)
        }
        // sendInviteEmail(email,classroom.name)
        return res.status(200).json({
            success: true,
            message: ` Get classroom success`,
            students: students,
            teachers: teachers,
            owner: classroom.owner
            
        });
    } catch (error) {
        console.log("Error when add student", error)
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}]
