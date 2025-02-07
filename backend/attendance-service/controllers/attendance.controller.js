// import Classroom from "../../classroom-service/models/classroom.model.js";
import authMiddleware from "../middlewares/authMiddleware.js"
import Classroom from "../models/classroom.model.js"
import AttendanceSession from "../models/attendance.model.js"
import User from "../models/user.model.js"
import { Submission } from "../models/submission.model.js"
import bcryptjs from 'bcryptjs'
export const createAttendance = [authMiddleware, async (req, res) => {
    const {classroomId} = req.body
    const {name, desc, method} = req.body
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

        // Tìm các đơn nghỉ phép đã được duyệt có liên quan đến lớp học
        const approvedSubmissions = await Submission.find({
            classId: classroomId,
            status: 'Approved',
            fromDate: { $lte: new Date() }, // Ngày bắt đầu <= ngày tạo session
            toDate: { $gte: new Date() },   // Ngày kết thúc >= ngày tạo session
        });

        // Lấy danh sách email có đơn nghỉ phép hợp lệ
        const excusedEmails = approvedSubmissions.map(submission => submission.userEmail);

       
        // console.log(userMap["doxiyo2971@kelenson.com"])
        // Tạo danh sách nonAttendees, đánh dấu "excused" cho user có đơn nghỉ phép
        const nonAttendees = emails.map(email => ({
            email,
            excused: excusedEmails.includes(email),
        }));


        const session = new AttendanceSession({
            owner: req.userEmail,
            classroomId,
            name,
            desc,
            method,
            nonAttendees: nonAttendees,
          });
      
          await session.save();
          res.status(201).json({sessionId: session._id, success: true });
    } catch (error) {
        console.error('Error creating attandence:', error.message);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}]

export const deleteAttendance=  async (req, res) => {
    const {attendanceId} = req.params
    try {
        const attendances = await AttendanceSession.findById(attendanceId)

        if(!attendances) {
            return res.status(404).json({success: false, message: "Attendance not found"})
        }
        // console.log(attendances.classroomId)
        await AttendanceSession.findByIdAndDelete(attendanceId)
        
        return res.status(200).json({ 
            success: true, 
            message: "Delete attendances success"
         });

    } catch (error) {
        console.error('Error form attandence:', error.message);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}


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
        const isPasswordCorrect = await bcryptjs.compare(password, user.password);

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
        const nonAttendee = session.nonAttendees.find(nonAttendee => nonAttendee.email === email);

        if (!nonAttendee) {
            return res.status(400).json({ message: 'Email not in attendance list' });
            }

        const result = await checkPassword(email, password)
        console.log("hello")

        if (result.success) {
            session.nonAttendees = session.nonAttendees.filter(nonAttendee => nonAttendee.email !== email);
            session.attendees.push({ email, timestamp: new Date()});

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
export const checkAttendanceDirectly = async (req, res) => {
    const { id } = req.params; // ID của session
    const { email } = req.body; // Email của người cần cập nhật

    try {
        console.log("Checking attendance for email:", email);

        // Lấy session theo ID
        const session = await AttendanceSession.findById(id);
        console.log(session)
        // Nếu không tìm thấy session
        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Attendance session not found',
            });
        }

        // Kiểm tra xem email có trong danh sách nonAttendees không
        const nonAttendee = session.nonAttendees.find(
            (nonAttendee) => nonAttendee.email === email
        );

        if (!nonAttendee) {
            return res.status(400).json({
                success: false,
                message: 'Email not in non-attendance list',
            });
        }

        // Loại email khỏi danh sách nonAttendees
        session.nonAttendees = session.nonAttendees.filter(
            (nonAttendee) => nonAttendee.email !== email
        );

        // Thêm email vào danh sách attendees với timestamp hiện tại
        session.attendees.push({ email, timestamp: new Date() });

        // Lưu cập nhật vào cơ sở dữ liệu
        await session.save();

        // Trả về phản hồi thành công
        return res.status(200).json({
            success: true,
            message: 'Attendance updated successfully',
            session,
        });
    } catch (error) {
        console.error('Error from checkAttendance:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

export const checkAttendanceByIdCard = async (req, res) => {
    const { id } = req.params; // ID của session
    const { idCard } = req.body; // Email của người cần cập nhật

    try {
        console.log("Checking attendance for idCard:", idCard);

        // Lấy session theo ID
        const session = await AttendanceSession.findById(id);
        console.log(session)
        // Nếu không tìm thấy session
        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Attendance session not found',
            });
        }

        const user = await User.findOne({idCard: idCard})
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
        const email = user.email

        // Kiểm tra xem email có trong danh sách nonAttendees không
        const nonAttendee = session.nonAttendees.find(
            (nonAttendee) => nonAttendee.email === email
        );

        if (!nonAttendee) {
            return res.status(400).json({
                success: false,
                message: 'Email not in non-attendance list',
            });
        }

        // Loại email khỏi danh sách nonAttendees
        session.nonAttendees = session.nonAttendees.filter(
            (nonAttendee) => nonAttendee.email !== email
        );

        // Thêm email vào danh sách attendees với timestamp hiện tại
        session.attendees.push({ email, timestamp: new Date() });

        // Lưu cập nhật vào cơ sở dữ liệu
        await session.save();

        // Trả về phản hồi thành công
        return res.status(200).json({
            success: true,
            message: 'Attendance updated successfully',
            session,
        });
    } catch (error) {
        console.error('Error from checkAttendance:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};


export const getAllAttendances = [authMiddleware, async (req, res) => {
    const {id} = req.params
    try {
        const attendances = await AttendanceSession.find({classroomId: id})
        
        console.log(id)

        if(!attendances) {
            return res.status(404).json({success: false, message: "Classroom not found"})
        }
        return res.status(200).json({ success: true, data: attendances, message: "Get attendances success" });

    } catch (error) {
        console.error('Error creating attandence:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}]

export const getAttendance = [authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        // Tìm attendance session dựa vào ID
        const attendance = await AttendanceSession.findById(id);

        if (!attendance) {
            return res.status(404).json({ success: false, message: "Session not found" });
        }

        // Lấy danh sách email từ `nonAttendees` và `attendees`
        const nonAttendeesEmails = attendance.nonAttendees.map(item => item.email);
        const attendeesEmails = attendance.attendees.map(attendee => attendee.email);

        // Tìm thông tin người dùng từ email
        const nonAttendees = await User.find({ email: { $in: nonAttendeesEmails } })
                                       .select('email username imageUrl');
        const attendees = await User.find({ email: { $in: attendeesEmails } })
                                    .select('email username imageUrl');

        // const users = await User.find({ email: { $in: emails } }); // Giả sử bảng User chứa email và imageUrl
        // const userMap = users.reduce((map, user) => {
        //     map[user.email] = user.imageUrl || null; // Lưu imageUrl hoặc null
        //     return map;
        // }, {});

        // Thêm thông tin `excused` vào danh sách nonAttendees
        const nonAttendeesWithStatus = attendance.nonAttendees.map(nonAttendee => {
            const userInfo = nonAttendees.find(user => user.email === nonAttendee.email);
            return {
                email: userInfo?.email || nonAttendee.email,
                username: userInfo?.username || null,
                imageUrl: userInfo?.imageUrl || null,
                excused: nonAttendee.excused
            };
        });

        const attendeesWithDetails = attendance.attendees.map(attendee => {
            const userInfo = attendees.find(user => user.email === attendee.email);
            return {
                email: attendee.email,
                username: userInfo?.username || null,
                imageUrl: userInfo?.imageUrl || null,
                timestamp: attendee.timestamp,
            };
        });

        console.log(nonAttendeesWithStatus)

        // Tạo QR Code URL
        const qrData = attendance.method === "QR" ? `http://localhost:5173/attendance/form/${attendance._id}` : null;
        const classroom = await Classroom.findById(attendance.classroomId)
        // Trả về kết quả
        return res.status(200).json({
            success: true,
            session: {
                name: attendance.name,
                desc: attendance.desc,
                nonAttendees: nonAttendeesWithStatus,
                attendees: attendeesWithDetails,
                date: attendance.date,
                qrCode: qrData,
                classOwner: classroom.owner,
                className: classroom.name,
                method: attendance.method
            }
        });
    } catch (error) {
        console.error('Error getting attendance:', error.message);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}];
