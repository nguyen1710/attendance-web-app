import express from 'express'
import { createSubmission, getSubmissions, updateSubmission } from '../controllers/submission.controller.js'
const router = express.Router()

router.post("/createSubmission/:classId", createSubmission)
router.get("/getSubmissions/:classId", getSubmissions)
router.post("/updateSubmission", updateSubmission)
export default router