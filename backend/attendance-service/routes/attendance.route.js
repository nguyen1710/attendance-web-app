import express from "express"
import { createAttendance, getAllAttendances, getAttendance, getFormAttendance, checkAttendance, checkAttendanceDirectly} from "../controllers/attendance.controller.js"
import cors from "cors"
const router = express.Router()
const corsOptionsPublic = {
    origin: 'http://localhost:5173',  // Chỉ cho phép frontend từ localhost:5173 truy cập
    methods: ['GET', 'POST'],         // Các phương thức HTTP được phép cho các route công khai
    allowedHeaders: ['Content-Type'], // Các header được phép
    credentials: false,               // Không cần gửi cookie hay token cho các route này
  };

router.post("/createAttandence", createAttendance)
router.get("/getAllAttendances/:id", getAllAttendances)
router.get("/getAttendance/:id", getAttendance)
router.post("/checkAttendance/:id", checkAttendanceDirectly)

router.get("/getFormAttend/:id", cors(corsOptionsPublic), getFormAttendance)
router.post("/checkFormAttend/:id", cors(corsOptionsPublic), checkAttendance);



export default router