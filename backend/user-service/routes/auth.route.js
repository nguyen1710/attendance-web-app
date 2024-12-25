import { login, logout, signup, verifyEmail, resendVerificationCode, loginWithGoogle } from "../controllers/auth.controller.js";

import express from "express"
const router = express.Router()


router.post("/signup", signup)

router.post("/login", login)

router.post("/logout", logout)

router.post("/verify-email", verifyEmail)

router.post("/resend-verification", resendVerificationCode)

router.post("/google-auth", loginWithGoogle)

export default router