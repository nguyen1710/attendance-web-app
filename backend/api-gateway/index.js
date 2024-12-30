import { createProxyMiddleware } from 'http-proxy-middleware';
import express from 'express'

const app = express()

app.use('/user-service', createProxyMiddleware({
    target: 'http://localhost:3000',
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
    target: 'http://localhost:3001',
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
    target: 'http://localhost:3002',
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

app.use('/attandence-service', createProxyMiddleware({
    target: 'http://localhost:3003',
    pathRewrite: {
        '^/attandence-service': ''
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

app.listen(4000, () => {
    console.log("API Gateway service is listening at http://localhost:4000")
})
