import authMiddleware from "../middlewares/authMiddleware.js"
import Classroom from "../models/classroom.model.js"
import mongoose, { isObjectIdOrHexString } from "mongoose"
import AttendanceSession from "../models/attendance.model.js"
import User from "../models/user.model.js"
import { Submission } from "../models/submission.model.js"
import Notification from "../models/notification.model.js"
export const createSubmission = [ authMiddleware, async (req, res) => {
    const {classId} = req.params
    const { title, content, evidence, fromDate, toDate } = req.body;

    const userEmail = req.userEmail
    try {
        const user = await User.findOne({email: userEmail})
        const classroom = await Classroom.findById(classId)
        const newSubmission = new Submission({
            classId,
            userName: user.username,
            userEmail,
            title,
            content,
            fromDate,
            toDate,
            evidence,
            imageUrl: user.imageUrl
        });

        const message = `User ${user.username} has applied ${title} to class ${classroom.name}`
        const notification = new Notification({
            receiver: classroom?.owner,
            title: title,
            className: classroom?.name,
            sender: user.username,
            classId: classId
        })

        await notification.save()
        await newSubmission.save();


        return res.status(201).json({
            success: true,
            notification: notification,
            owner: classroom?.owner,
            submission: newSubmission
        })
    } catch (error) {
        console.error('Error creating submission:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}]

export const getSubmissions = [authMiddleware, async (req, res) => {
    const {classId} = req.params
    const userEmail = req.userEmail;
    try {
        console.log(classId, userEmail)
        const classroom = await Classroom.findById(classId)
        //nếu là owner của lớp hì thấy tất cả submission của lớp
        if (!classroom) {
            return res.status(404).json({ success: false, message: "Classroom not found" });
          }
        if(classroom.owner === userEmail) {
            const submissions = await Submission.find({classId: classId})
            return res.status(200).json({
                success: true,
                classOwner: classroom.owner,
                message: "Get submission for owner successfully",
                submissions
            })
        }
        //nếu là không owner của lớp thì chỉ thấy submission của mình

        const classObjectId= new mongoose.Types.ObjectId(classId)
        const submissions = await Submission.find({
            classId: classObjectId,
            userEmail: userEmail
        })

        if (submissions.length === 0) {
            return res.status(404).json({ success: false, message: "Submissions not found" });
          }

        return res.status(200).json({ 
            success: true, 
            classOwner: classroom.owner,
            message: "Get submission for user successfully",
            submissions : submissions
        });
    } catch (error) {
        console.error('Error fetching submissions:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}]


export const updateSubmission = [ authMiddleware, async (req, res) => {
    const { newTitle, newContent, newFromDate, newToDate, newEvidence, submissionId, newStatus } = req.body;
    try {
        // Tìm submission cần cập nhật theo submissionId
        console.log(newTitle, newContent, newFromDate, newToDate, newEvidence, submissionId, newStatus)
        const submission = await Submission.findById(submissionId);
        
        if (!submission) {
          return res.status(404).json({ message: 'Submission not found' });
        }
    
        // Cập nhật thông tin của submission
        submission.title = newTitle
        submission.content = newContent 
        submission.fromDate = newFromDate
        submission.toDate = newToDate 
        submission.status = newStatus 
        
        const classroom = await Classroom.findById(submission.classId)
        if(classroom.owner === req.userEmail) {
          const notification = new Notification({
            receiver: submission.userEmail,
            title: newTitle,
            className: classroom?.name,
            sender: req.userEmail,
            classId: classroom._id,
            isResponse: true
        })
          await notification.save()
            // Lưu lại các thay đổi
          await submission.save();

          // Trả về kết quả thành công
          return res.json({ success: true, message: 'Submission updated successfully', notification: notification });
        }
        await submission.save();

        // Trả về kết quả thành công
        return res.json({ success: true, message: 'Submission updated successfully' });
       
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
      }
    
}]

export const deleteSubmission = [authMiddleware, async (req, res) => {
      const { submissionId } = req.params; // Lấy submissionId từ body request
      try {
        // Tìm submission cần xóa theo submissionId
        const submission =  await Submission.findByIdAndDelete(submissionId);

        console.log(submission)
        if (!submission) {
          return res.status(404).json({ message: 'Submission not found' });
        }
  
        // Trả về kết quả thành công
        return res.json({ success: true, message: 'Submission deleted successfully' });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server error' });
      }
    }
  ];
  


// Lấy tất cả thông báo
export const getAllNotifications = [ authMiddleware, async (req, res) => {
    try {
        const userEmail = req.userEmail;
        const { notiId } = req.body;
        console.log("notiId", notiId)
      if (notiId) {
        // Nếu có `notiId`, cập nhật trạng thái thành "Read"
        await Notification.updateOne(
          { _id: notiId },
          { $set: { status: "Read" } }
        );
      }
        const notifications = await Notification.find({receiver: userEmail}); // Lấy tất cả thông báo
        return res.status(200).json({
            success: true,
            notifications, // Trả về danh sách thông báo
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
  }]

