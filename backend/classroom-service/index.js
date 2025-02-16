import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";  // Đảm bảo có phần mở rộng .js
import classroomRoutes from "./routes/classroom.route.js";  // Đảm bảo có phần mở rộng .js
import cookieParser from 'cookie-parser';
import multer from 'multer';
import cors from 'cors'
dotenv.config();
const app = express()
const port = process.env.PORT || 3002
const FRONTEND_URL = process.env.FRONTEND_URL

const corsOptions = {
    origin: FRONTEND_URL, // Chỉ cho phép frontend từ localhost:5173 truy cập
    methods: 'GET, POST, PUT, DELETE', // Các phương thức HTTP được phép
    allowedHeaders: 'Content-Type, Authorization', // Các header được phép
  };

app.use(cors(corsOptions));
app.use(cookieParser()); // Đảm bảo dòng này được khai báo trước các route khác
app.use(express.json())


app.get('/', (req, res) => {
    res.send("Hellooo port 3001")
})
app.use("/api/classrooms", classroomRoutes)
app.listen(port, () => {
    connectDB()
    console.log(`Server is running on port ${port}`)
})