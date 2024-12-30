import express from "express"
import { createAttendance, getAllAttendances} from "../controllers/attendance.controller.js"
const router = express.Router()


router.post("/createAttandence", createAttendance)
router.get("/getAllAttendances/:id", getAllAttendances)

export default router