import { login, logout, signup, verifyEmail, resendVerificationCode, loginWithGoogle, sendMailResetPassword, resetPassword } from "../controllers/auth.controller.js";
import cors from 'cors'
import express from "express"
const router = express.Router()
const FRONTEND_URL = process.env.FRONTEND_URL

const corsOptionsPublic = {
    origin: FRONTEND_URL,  // Chỉ cho phép frontend từ localhost:5173 truy cập
    methods: ['GET', 'POST'],         // Các phương thức HTTP được phép cho các route công khai
    allowedHeaders: ['Content-Type'], // Các header được phép
    credentials: false,               // Không cần gửi cookie hay token cho các route này
  };

router.post("/signup", cors(corsOptionsPublic), signup)

router.post("/login",cors(corsOptionsPublic),  login)

router.post("/logout",cors(corsOptionsPublic),  logout)

router.post("/verify-email", cors(corsOptionsPublic), verifyEmail)

router.post("/resend-verification", cors(corsOptionsPublic), resendVerificationCode)

router.post("/google-auth",cors(corsOptionsPublic),  loginWithGoogle)

router.post("/sendResetMail",cors(corsOptionsPublic) , sendMailResetPassword)
router.post("/resetPassword/:token",cors(corsOptionsPublic) , resetPassword)

export default router