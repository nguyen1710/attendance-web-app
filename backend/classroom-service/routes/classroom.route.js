import express from "express"
import { createClassroom, getClassrooms, deleteClassroom, addStudent, handleExcelUpload } from "../controllers/classroom.controller.js"
import multer from "multer";
const router = express.Router()

// Cấu hình multer để xử lý file
const upload = multer({
    storage: multer.memoryStorage(), // Lưu file trong bộ nhớ
    limits: { fileSize: 10 * 1024 * 1024 }, // Giới hạn kích thước file (10MB)
}).single('file'); // Chỉ xử lý 1 file tại một thời điểm

router.post("/createClassroom", createClassroom)

// router.post("/updateClassroom", updateClassroom)

router.post("/deleteClassroom/:id", deleteClassroom)

router.get("/getClassrooms", getClassrooms)

router.post("/add-student", addStudent)

// Route xử lý file Excel
router.post('/upload-excel', upload, handleExcelUpload);

export default router