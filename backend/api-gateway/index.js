import { createProxyMiddleware } from 'http-proxy-middleware';
import express from 'express'
import { Server } from "socket.io";
import http from 'http'
import cors from 'cors'
const app = express()

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true, // Cho phép cookie
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));

app.use('/user-service', createProxyMiddleware({
    target: 'http://user-service:3000',
    pathRewrite: {
        '^/user-service': ''
    },
    changeOrigin: true, // Để thay đổi nguồn của yêu cầu đến
    cookieDomainRewrite: {
        "*": "localhost", // Đảm bảo cookie có thể truy cập từ localhost
    },
    onProxyReq: (proxyReq, req, res) => {
        // Nếu bạn sử dụng token trong cookie, bạn cần chắc chắn rằng token được gửi đi
        if (req.cookies.token) {
            proxyReq.setHeader('Cookie', `token=${req.cookies.token}`);
        }
    }
}))

app.use('/classroom-service', createProxyMiddleware({
    target: 'http://classroom-service:3001',
    pathRewrite: {
        '^/classroom-service': ''
    },
    changeOrigin: true, // Để thay đổi nguồn của yêu cầu đến
    cookieDomainRewrite: {
        "*": "localhost", // Đảm bảo cookie có thể truy cập từ localhost
    },
    onProxyReq: (proxyReq, req, res) => {
        // Thêm token vào header nếu cần
        if (req.cookies.token) {
            proxyReq.setHeader('Cookie', `token=${req.cookies.token}`);
        }
    }
}))

app.use('/admin-service', createProxyMiddleware({
    target: 'http://admin-service:3002',
    pathRewrite: {
        '^/admin-service': ''
    },
    changeOrigin: true, // Để thay đổi nguồn của yêu cầu đến
    cookieDomainRewrite: {
        "*": "localhost", // Đảm bảo cookie có thể truy cập từ localhost
    },
    onProxyReq: (proxyReq, req, res) => {
        // Thêm token vào header nếu cần
        if (req.cookies.token) {
            proxyReq.setHeader('Cookie', `token=${req.cookies.token}`);
        }
    }
}))

app.use('/attendance-service', createProxyMiddleware({
    target: 'http://attendance-service:3003',
    pathRewrite: {
        '^/attendance-service': ''
    },
    changeOrigin: true, // Để thay đổi nguồn của yêu cầu đến
    cookieDomainRewrite: {
        "*": "localhost", // Đảm bảo cookie có thể truy cập từ localhost
    },
    onProxyReq: (proxyReq, req, res) => {
        // Thêm token vào header nếu cần
        if (req.cookies.token) {
            proxyReq.setHeader('Cookie', `token=${req.cookies.token}`);
        }
    }
}))
const users = new Map();
const server = http.createServer(app);
const io = new Server(server, {
    connectionStateRecovery: {},
    cors: {
        origin: "http://localhost:5173", // Cho phép kết nối từ localhost:5173
        methods: ["GET", "POST"],
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


server.listen(4000, () => {
    console.log("API Gateway service is listening at http://localhost:4000")
})