import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";  // Đảm bảo có phần mở rộng .js
import adminRoutes from "./routes/admin.route.js";  // Đảm bảo có phần mở rộng .js
import cors from 'cors';

dotenv.config();
const app = express()
const port = process.env.PORT || 3002

// Cấu hình CORS để cho phép frontend ở cổng 5731
const corsOptions = {
    origin: 'http://localhost:5173', // Cổng frontend của bạn
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Các phương thức HTTP bạn muốn cho phép
    credentials: true, // Cho phép gửi cookie nếu cần
  };
  
  // Sử dụng middleware CORS
app.use(cors(corsOptions));
app.use(express.json())

app.use("/api/admin", adminRoutes)

app.listen(port, () => {
    connectDB()
    console.log(`Server is running on port ${port}`)
})