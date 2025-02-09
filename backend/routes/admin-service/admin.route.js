import { login, getAllClients, getAllClassrooms, updateProfile, getNewClients, deleteClient, blockClient, getClientsByStatus, 
    getClientsByEmail, getAttendanceByClassroomId, deleteAttendance, updateAttendance} from "../../controllers/admin-service/admin.controller.js";
import cors from 'cors'
import express from "express"
const router = express.Router()

const corsOptionsPublic = {
    origin: FRONTEND_URL,  // Chỉ cho phép frontend từ localhost:5173 truy cập
    methods: ['GET', 'POST'],         // Các phương thức HTTP được phép cho các route công khai
    allowedHeaders: ['Content-Type'], // Các header được phép
    credentials: false,               // Không cần gửi cookie hay token cho các route này
  };

router.post("/login", cors(corsOptionsPublic),login)
router.get("/getAllClients", getAllClients);
router.get("/getNewClients", getNewClients)
router.get("/getClientsByStatus", getClientsByStatus);
router.get("/getAllClassrooms", getAllClassrooms);
router.post("/getClientsByEmail", getClientsByEmail);
router.put("/updateProfile",updateProfile);
router.delete("/deleteClient", deleteClient);
router.put("/blockClient", blockClient);
router.post("/getAttendanceByClassroomId", getAttendanceByClassroomId);
router.delete("/deleteAttendance", deleteAttendance);
router.put("/updateAttendance", updateAttendance)
export default router