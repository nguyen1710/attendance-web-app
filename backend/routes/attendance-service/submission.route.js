import express from 'express'
import { createSubmission, 
    getAllNotifications,
    getSubmissions, 
    updateSubmission, 
    deleteSubmission } from '../../controllers/attendance-service/submission.controller.js'
const router = express.Router()

router.post("/createSubmission/:classId", createSubmission)
router.get("/getSubmissions/:classId", getSubmissions)
router.get("/getNotification", getAllNotifications)
router.post("/getNotification", getAllNotifications)
router.delete("/deleteSubmission/:submissionId", deleteSubmission)
router.put("/updateSubmission", updateSubmission)
export default router