// import Classroom from "../../classroom-service/models/classroom.model.js";
import authMiddleware from "../middlewares/authMiddleware.js"
import Classroom from "../models/classroom.model.js"
import AttendanceSession from "../models/attendance.model.js"
import User from "../models/user.model.js"
import QRCode from "qrcode"
import { createCanvas, loadImage } from "canvas"
import bcrypt from "bcrypt"
import { Submission } from "../models/submission.model.js"

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

        // Tìm các đơn nghỉ phép đã được duyệt có liên quan đến lớp học
        const approvedSubmissions = await Submission.find({
            classId: classroomId,
            status: 'Approved',
            fromDate: { $lte: new Date() }, // Ngày bắt đầu <= ngày tạo session
            toDate: { $gte: new Date() },   // Ngày kết thúc >= ngày tạo session
        });

        // Lấy danh sách email có đơn nghỉ phép hợp lệ
        const excusedEmails = approvedSubmissions.map(submission => submission.userEmail);

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
            nonAttendees: nonAttendees,
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

//   // Function to generate QR code with logo (assuming logo path is 'path/to/your/logo.png')
//   async function generateQRCodeWithLogo(url) {
//     try {
//         let qrCodeData;
//         try {
//             qrCodeData = await QRCode.toDataURL(url, { errorCorrectionLevel: 'H' });
//             console.log("qrCodeData:", qrCodeData.slice(0, 100)); // Chỉ in 100 ký tự đầu để tránh in quá nhiều
//         } catch (qrCodeError) {
//             console.error("Lỗi tạo QR code:", qrCodeError);
//             return null;
//         }

//         const qrCode = await Jimp.read(Buffer.from(qrCodeData.split(',')[1], 'base64'));
//         console.log("qrCode:", qrCode);
//         const __filename = fileURLToPath(import.meta.url);
//         const __dirname = path.dirname(__filename);
//         const logoPath = path.join(__dirname, '..', 'public', 'img', 'logo.png');
//         console.log("logoPath:", logoPath);
//         if (!fs.existsSync(logoPath)) {
//             throw new Error(`Lỗi: File logo không tồn tại tại đường dẫn: ${logoPath}`);
//         }

//         const logo = await Jimp.read(logoPath);
//         console.log("logo:", logo);
//         if (!logo) {
//             throw new Error(`Không thể đọc logo tại đường dẫn: ${logoPath}`);
//         }
//         if (!qrCode) {
//             throw new Error(`Không thể tạo qrCode`);
//         }

//         logo.resize(qrCode.getWidth() / 3, AUTO);

//         const x = (qrCode.getWidth() - logo.getWidth()) / 2;
//         const y = (qrCode.getHeight() - logo.getHeight()) / 2;

//         qrCode.composite(logo, x, y);

//         return await qrCode.getBase64Async(MIME_PNG);
//     } catch (error) {
//         console.error('Lỗi tạo mã QR code với logo:', error);
//         return null;
//     }
//   }

const generateQRCode = async (qrData, logoPath) => {
    try {
        const qrCodeOptions = {
            errorCorrectionLevel: 'H', // Mức độ sửa lỗi (cao nhất)
        };

        const qrCodeDataURL = await QRCode.toDataURL(qrData, qrCodeOptions);
        const qrCodeImage = await loadImage(qrCodeDataURL);

        const canvas = createCanvas(qrCodeImage.width, qrCodeImage.height);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(qrCodeImage, 0, 0);

        if (logoPath) {
            try {
                const logo = await loadImage(logoPath);

                // Tính toán vị trí và kích thước logo
                const logoSize = Math.min(canvas.width, canvas.height) * 0.25; // 25% kích thước QR code
                const x = (canvas.width - logoSize) / 2;
                const y = (canvas.height - logoSize) / 2;

                ctx.drawImage(logo, x, y, logoSize, logoSize);
            } catch (logoError) {
                console.error("Lỗi khi tải logo:", logoError);
                // Xử lý lỗi, ví dụ: bỏ qua logo hoặc trả về lỗi
            }
        }

        const qrCodeBase64 = canvas.toDataURL('image/png');
        return qrCodeBase64;

    } catch (error) {
        console.error('Lỗi tạo mã QR:', error);
        return null;
    }
};

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
                                       .select('email username');
        const attendees = await User.find({ email: { $in: attendeesEmails } })
                                    .select('email username');

        // Thêm thông tin `excused` vào danh sách nonAttendees
        const nonAttendeesWithStatus = attendance.nonAttendees.map(nonAttendee => {
            const userInfo = nonAttendees.find(user => user.email === nonAttendee.email);
            return {
                email: userInfo?.email || nonAttendee.email,
                username: userInfo?.username || null,
                excused: nonAttendee.excused
            };
        });

        const attendeesWithDetails = attendance.attendees.map(attendee => {
            const userInfo = attendees.find(user => user.email === attendee.email);
            return {
                email: attendee.email,
                username: userInfo?.username || null,
                timestamp: attendee.timestamp,
            };
        });

        // Tạo QR Code URL
        const qrData = `http://localhost:5173/attendance/form/${attendance._id}`;
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
                className: classroom.name
            }
        });
    } catch (error) {
        console.error('Error getting attendance:', error.message);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}];
