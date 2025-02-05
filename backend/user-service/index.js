import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";  // Đảm bảo có phần mở rộng .js
import authRoutes from "./routes/auth.route.js";  // Đảm bảo có phần mở rộng .js
import upgradeRoutes from "./routes/upgrade.route.js"

import cors from 'cors';

dotenv.config();
const app = express()
const port = process.env.PORT || 3001

// Cấu hình CORS để cho phép frontend ở cổng 5731
const corsOptions = {
    origin: 'http://localhost:5173', // Cổng frontend của bạn
    methods: ['GET', 'POST'], // Các phương thức HTTP bạn muốn cho phép
    credentials: true, // Cho phép gửi cookie nếu cần
  };
  
  // Sử dụng middleware CORS
app.use(cors(corsOptions));
app.use(express.json())

app.get('/', (req, res) => {
    res.send("Hellooo port 3000")
})
app.use("/api/auth", authRoutes)
app.use("/api/upgrade", upgradeRoutes)

app.listen(port, () => {
    connectDB()
    console.log(`Server is running on port ${port}`)
})