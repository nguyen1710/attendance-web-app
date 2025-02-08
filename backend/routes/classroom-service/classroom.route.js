import express from "express"
import { createClassroom, 
    getAllClassrooms, 
    deleteClassroom, 
    addStudent, 
    handleExcelUpload, 
    getDetailClass, 
    getUserFromClass, 
    deleteStudentInClass, 
    addTeacher} from "../../controllers/classroom-service/classroom.controller.js"
import multer from "multer";
const router = express.Router()

// Cấu hình multer để xử lý file
const upload = multer({
    storage: multer.memoryStorage(), // Lưu file trong bộ nhớ
    limits: { fileSize: 10 * 1024 * 1024 }, // Giới hạn kích thước file (10MB)
}).single('file'); // Chỉ xử lý 1 file tại một thời điểm

router.post("/createClassroom", createClassroom)

// router.post("/updateClassroom", updateClassroom)

router.post("/deleteClassroom/:classId", deleteClassroom)

router.get("/getClassrooms", getAllClassrooms)

router.post("/add-student", addStudent)
router.post("/add-teacher", addTeacher)

router.get("/getClassroom/:classId", getDetailClass)

router.get("/getUserFromClass/:classId", getUserFromClass)

// Route xử lý file Excel
router.post('/upload-excel', upload, handleExcelUpload);

router.post("/deleteUserInClass", deleteStudentInClass)
export default router