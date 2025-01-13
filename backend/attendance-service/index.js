import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";  // Đảm bảo có phần mở rộng .js
import attendanceRoutes from "./routes/attendance.route.js"
import submissionRotes from "./routes/submission.route.js"
import cookieParser from 'cookie-parser';
import cors from 'cors'
import path from "path"
import { fileURLToPath } from 'url';
dotenv.config();
const app = express()
const port = process.env.PORT || 3004

const corsOptions = {
    origin: 'http://localhost:5173', // Chỉ cho phép frontend từ localhost:5173 truy cập
    methods: 'GET, POST, PUT, DELETE', // Các phương thức HTTP được phép
    allowedHeaders: 'Content-Type, Authorization', // Các header được phép
  };



// Lấy __dirname trong ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cấu hình express để phục vụ các tệp tĩnh trong thư mục public
app.use(express.static(path.join(__dirname, 'public')));


app.use(cors(corsOptions));
app.use(cookieParser()); // Đảm bảo dòng này được khai báo trước các route khác
app.use(express.json())


app.get('/', (req, res) => {
    res.send("Hellooo port 3001")
})

app.use("/api/attendances", attendanceRoutes)
app.use("/api/submissions", submissionRotes)
app.listen(port, () => {
    connectDB()
    console.log(`Server is running on port ${port}`)
})