import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";  // Đảm bảo có phần mở rộng .js
import { Server } from "socket.io";
import http from 'http'

//adminn
import adminRoutes from "./routes/admin-service/admin.route.js";  // Đảm bảo có phần mở rộng .js

//user
import authRoutes from "./routes/user-service/auth.route.js";  // Đảm bảo có phần mở rộng .js
import upgradeRoutes from "./routes/user-service/upgrade.route.js"
import userRoute from "./routes/user-service/user.route.js"

import cors from 'cors';

//classroom
import classroomRoutes from "./routes/classroom-service/classroom.route.js";  // Đảm bảo có phần mở rộng .js

import cookieParser from 'cookie-parser';

//attendance
import attendanceRoutes from "./routes/attendance-service/attendance.route.js"
import submissionRotes from "./routes/attendance-service/submission.route.js"
import path from "path"
import { fileURLToPath } from 'url';

dotenv.config();
const app = express()
const port = process.env.PORT || 4001

// Cấu hình CORS để cho phép frontend ở cổng 5731
const corsOptions = {
    origin: 'https://attendance-web-app-frontend.onrender.com', // Cổng frontend của bạn
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Các phương thức HTTP bạn muốn cho phép
    credentials: true, // Cho phép gửi cookie nếu cần
    allowedHeaders: 'Content-Type, Authorization', // Các header được phép
  };
  
  // Lấy __dirname trong ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cấu hình express để phục vụ các tệp tĩnh trong thư mục public
app.use(express.static(path.join(__dirname, 'public')));

  // Sử dụng middleware CORS
app.use(cors(corsOptions));
app.use(cookieParser()); // Đảm bảo dòng này được khai báo trước các route khác
app.use(express.json())

app.get('/', (req, res) => {
    res.send("Hellooo port 4000")
})


//admin
app.use("/admin-service/api/admin", adminRoutes)

//attendance - submissions
app.use("/attendance-service/api/attendances", attendanceRoutes)
app.use("/attendance-service/api/submissions", submissionRotes)

//classroom
app.use("/classroom-service/api/classrooms", classroomRoutes)

//user
app.use("/user-service/api/auth", authRoutes)
app.use("/user-service/api/upgrade", upgradeRoutes)
app.use("/user-service/api/user", userRoute)
// app.listen(port, () => {
//     connectDB()
//     console.log(`Server is running on port ${port}`)
// })

const users = new Map();
const server = http.createServer(app);
const io = new Server(server, {
    connectionStateRecovery: {},
    cors: {
        origin: "https://attendance-web-app-frontend.onrender.com", // Cho phép kết nối từ localhost:5173
        methods: ['GET', 'POST', 'PUT', 'DELETE'], // Các phương thức HTTP bạn muốn cho phép
    }
});

io.on('connection', function(client) {
    console.log("A new user connect,", client.id)
    client.on("register", (data) => {
        users.set(data.email, client.id); // Thêm user vào Map
        console.log(`User registered: ${data.email} -> ${client.id}`);
        console.log(users)
      });
    // Xử lý gửi thông báo
    client.on("notification", async function (data) {
        console.log("Notification received:", data);
        const { title, receiver, sender, className, classId, _id, isResponse } = data.notification;

        // Tìm socketId của người nhận dựa trên email
        const recipientSocketId = users.get(receiver);
        // const message = `User ${sender} has applied ${title} to class ${className}`
        if (recipientSocketId) {
        // Gửi thông báo đến người nhận
            client.to(recipientSocketId).emit("notification", {title, receiver, sender, className, classId, _id, isResponse});
            console.log(`Notification sent to ${receiver}: ${sender}`);
        } else {
            console.log(`User with email ${receiver} not found.`);
        }
    });

    // Xử lý khi user ngắt kết nối
    client.on("disconnect", () => {
        for (const [email, id] of users.entries()) {
        if (id === client.id) {
            users.delete(email); // Xóa user khỏi Map
            console.log(`User disconnected: ${email}`);
            break;
        }
        }
    });
});


server.listen(port, '0.0.0.0', () => {
    connectDB()
    console.log("API Gateway service is listening at http://localhost:4000")
})
