// import Classroom from "../../classroom-service/models/classroom.model.js";
import authMiddleware from "../middlewares/authMiddleware.js"
import Classroom from "../models/classroom.model.js"
import AttendanceSession from "../models/attendance.model.js"
import QRCode from "qrcode"
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
        const emails = classroom.studentEmails
        const session = new AttendanceSession({
            owner: req.userEmail,
            classroomId,
            name,
            desc,
            nonAttendees: emails,
          });
      
          await session.save();
          const qrCode = await QRCode.toDataURL(`http://localhost:3003/attendance/form/${session._id}`);
          res.status(201).json({ qrCode, sessionId: session._id, success: true });
        // const session = new 

        // console.log(name, desc)
        // console.log(emails)
        // res.status(201).json({ qrCode, sessionId: session._id });
    } catch (error) {
        console.error('Error creating attandence:', error.message);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}]

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