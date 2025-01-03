// import Classroom from "../../classroom-service/models/classroom.model.js";
import authMiddleware from "../middlewares/authMiddleware.js"
import Classroom from "../models/classroom.model.js"
import AttendanceSession from "../models/attendance.model.js"
import User from "../models/user.model.js"
import QRCode from "qrcode"
import bcrypt from "bcrypt"
export const createAttendance = [authMiddleware, async (req, res) => {
    const {classroomId} = req.body
    const {name, desc} = req.body
    try {
        if(!name || !desc) {
            return res.status(400).json({ success: false, message: 'Name and desc is required' });
        }

        const classroom = await Classroom.findById(classroomId)

        if(!classroom) {
            return res.status(404).json({ success: false, message: 'Class not found' });
        }

        if(classroom.owner != req.userEmail) {
            return res.status(403).json({ success: false, message: 'You dont have permission to create attendance session.'})
        }
        const emails = classroom.studentEmails
        const session = new AttendanceSession({
            owner: req.userEmail,
            classroomId,
            name,
            desc,
            nonAttendees: emails,
          });
      
          await session.save();
          res.status(201).json({sessionId: session._id, success: true });
    } catch (error) {
        console.error('Error creating attandence:', error.message);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}]

export const getFormAttendance=  async (req, res) => {
    const {id} = req.params
    try {
        const attendances = await AttendanceSession.findById(id)

        if(!attendances) {
            return res.status(404).json({success: false, message: "Classroom not found"})
        }
        // console.log(attendances.classroomId)
        const classroom = await Classroom.findById(attendances.classroomId)

        
        return res.status(200).json({ 
            success: true, 
            data: {
                classroomName: classroom.name,
                date: attendances.date
            }, 
            message: "Get attendances success" });

    } catch (error) {
        console.error('Error form attandence:', error.message);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

const checkPassword = async (email, password) => {
    try {
        // Tìm người dùng theo email
        const user = await User.findOne({ email: email });

        // Kiểm tra nếu người dùng không tồn tại
        if (!user) {
            throw new Error("User not found");
        }

        // So sánh mật khẩu với giá trị lưu trong cơ sở dữ liệu
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (isPasswordCorrect) {
            return { success: true, message: `User ${user.username} has successfully checked in. ` };
        } else {
            return { success: false, message: "Incorrect password" };
        }
    } catch (error) {
        return { success: false, message: error.message };
    }
}

export const checkAttendance = async (req, res) => {
    const {id} = req.params
    const {email, password} = req.body
    try {
        const session = await AttendanceSession.findById(id)
        if (!session.nonAttendees.includes(email)) {
            return res.status(400).json({ message: 'Email not in attendance list' });
            }

        const result = await checkPassword(email, password)
        console.log("hello")

        if (result.success) {
            session.nonAttendees = session.nonAttendees.filter(e => e !== email);
            session.attendees.push({ email});

            await session.save();
            res.status(200).json({
                success: true,
                message: result.message,
            });
        } else {
            // Đăng nhập thất bại, trả về thông báo lỗi
            res.status(400).json({
                success: false,
                message: result.message,
            });
        }

    } catch (error) {
        console.error('Error form check attandence:', error.message);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

export const getAllAttendances = [authMiddleware, async (req, res) => {
    const {id} = req.params
    try {
        const attendances = await AttendanceSession.find({classroomId: id})

        if(!attendances) {
            return res.status(404).json({success: false, message: "Classroom not found"})
        }
        return res.status(200).json({ success: true, data: attendances, message: "Get attendances success" });

    } catch (error) {
        console.error('Error creating attandence:', error.message);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}]

export const getAttendance = [authMiddleware, async (req,res) => {
    const {id} = req.params
    try {
        const attendance = await AttendanceSession.findById(id)

        if(!attendance) {
            return res.status(404).json({success: false, message: "Session not found"})
        }
        const nonAttendeesEmails = attendance.nonAttendees;
        const attendeesEmails = attendance.attendees.map(attendee => attendee.email);

        const nonAttendees = await User.find({ email: { $in: nonAttendeesEmails } })
                                    .select('email username')

        // Lấy thông tin người chưa tham gia
        const attendees = await User.find({ email: { $in: attendeesEmails } })
                                 .select('email username')
        const qrCode = await QRCode.toDataURL(`http://localhost:5173/attendance/form/${attendance._id}`)
        return res.status(200).json({
            success: true, 
            session: {
                name: attendance.name,
                desc: attendance.desc,
                nonAttendees: nonAttendees,
                attendees: attendees,
                date: attendance.date,
                qrCode: qrCode
            }})
    } catch (error) {
        console.error('Error getting attandence:', error.message);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}]