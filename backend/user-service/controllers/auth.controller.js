import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateTokenAndSetCookie.js"
import { sendResetPassword, sendVerificationEmail, sendWelcomEmail } from "../nodeMailer/emails.js";
import crypto from "crypto"
import { OAuth2Client } from "google-auth-library";
import dotenv from 'dotenv'
dotenv.config()

const GG_CLIENT_ID = process.env.GG_CLIENT_ID
const GG_CLIENT_SECRET = process.env.GG_CLIENT_SECRET
export const signup = async (req, res) => {
    const {email, password, username, role} = req.body

    try{
        if(!email || !password || !username){
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const userAlreadyExist = await User.findOne({email})
        if(userAlreadyExist) {
            return res.status(400).json({success:false, message:"User already exists"})
        }

        const hashedPassword = await bcryptjs.hash(password, 10)
        const verificationToken = Math.floor(10000 + Math.random() * 900000).toString()
        const user = new User({
            email, 
            password: hashedPassword, 
            username,
            role,
            verificationToken,
            verificationTokenExpiresAt: Date.now() +  60 * 1000
        })
        await user.save()

        //jwt
        generateTokenAndSetCookie(res, user.email, user.role)

        await sendVerificationEmail(user.email, verificationToken)

        res.status(201).json({
            success: true,
            message: "User create successfully",
            user: {
                ...user._doc,
                password: undefined
            }
        })
    }catch(error) {
        console.error(error);
        res.status(500).json({ success: false, message: error });
    }
}

export const verifyEmail = async (req, res) => {
    const {code} = req.body
    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: {$gt: Date.now() }
    })

    if(!user) {
        return res.status(400).json({success: false, message: "Invalid or expired verification code"})
    }

    user.isVerified = true
    user.verificationToken = undefined
    user.verificationTokenExpiresAt = undefined
    await user.save()

    await sendWelcomEmail(user.email, user.username)
    
    return res.status(200).json({success: true,
         message: "Emaill verify successfuly",
          user: {
        ...user._doc,
        password: undefined
    }})

    } catch (error) {
        
    }
}

export const resendVerificationCode = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Kiểm tra xem mã xác minh có hết hạn không
        if (user.verificationTokenExpiresAt > Date.now()) {
            return res.status(400).json({ success: false, message: "Verification code is still valid. Please try again later." });
        }

        // Tạo mã xác minh mới
        const newVerificationToken = Math.floor(10000 + Math.random() * 900000).toString();

        // Cập nhật mã xác minh mới và thời gian hết hạn
        user.verificationToken = newVerificationToken;
        user.verificationTokenExpiresAt = Date.now() + 60 * 1000; // Mã mới có hiệu lực trong 1 phút
        await user.save();

        // Gửi email với mã xác minh mới
        await sendVerificationEmail(user.email, newVerificationToken);

        return res.status(200).json({ success: true, message: "Verification code has been resent successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};


export const login = async (req, res) => {
    const {email, password} = req.body
    try {
        if(!email || !password ){
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const user = await User.findOne({email})
        if(!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        
        const isPasswordValid = await bcryptjs.compare(password, user.password)
        if(!isPasswordValid) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Invalid password"
                }
            )
        }
        //jwt
        
        const token = generateTokenAndSetCookie(res, user.email, user.role)

        console.log(user)
        res.status(200).json(
            {
                success: true,
                message: "Login verify successfuly",
                token: token,
                user: {
                    _id: user._id,
                email: user.email,
                username: user.username,
                isVerified: user.isVerified,
                lastLogin: user.lastLogin,
                createAt: user.createAt,
                updatedAt: user.updatedAt,
                role: user.role.role,  // Đảm bảo bạn trả về trường role ở đây
                imageUrl: user.imageUrl
                }
            }
        )
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

const client = new OAuth2Client(GG_CLIENT_ID);
export const loginWithGoogle = async (req, res) => {
    const { token, profile } = req.body;
    console.log(process.env.GG_CLIENT_ID)
    if (!token) {
        return res.status(400).json({ success: false, message: "Google token is required" });
    }

    try {
        // Xác thực token với Google
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: GG_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        if (!payload) {
            return res.status(400).json({ success: false, message: "Invalid Google token" });
        }

        const { email, name, sub } = payload;

        // Kiểm tra người dùng có tồn tại không
        let user = await User.findOne({ email });

        if (!user) {
            // Nếu chưa tồn tại, tạo người dùng mới
            user = new User({
                email,
                username: name,
                googleId: sub,
                isVerified: true, // Mặc định xác thực cho Google
            });

            await user.save();
        }

        // Tạo token JWT và set cookie
        const token_web = generateTokenAndSetCookie(res, user.email, user.role);

        res.status(200).json({
            success: true,
            message: "Login with Google successful",
            token: token_web,
            user: {
                _id: user._id,
                email: user.email,
                username: user.username,
                isVerified: user.isVerified,
                createAt: user.createAt,
                updatedAt: user.updatedAt,
                role: user.role.role,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const sendMailResetPassword = async (req, res) => {
    const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "Invalid email" });

    // Tạo token reset
    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordTokenExpiresAt = Date.now() + 15 * 60 * 1000; // Hết hạn sau 15 phút
    await user.save();

    // Gửi email reset
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    await sendResetPassword(user.email, resetLink)

    res.json({ success: true, message: "Email has been send!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
}

export const resetPassword = async (req,res) => {
    const { token } = req.params;
  const { password } = req.body;
  try {
    console.log(token)
    const user = await User.findOne({ resetPasswordToken: token, resetPasswordTokenExpiresAt: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ succecss: false, message: "Invalid token or expires" });

    // Băm mật khẩu mới
    user.password = await bcryptjs.hash(password, 10)
    user.resetPasswordToken = ""; // Xóa token
    user.resetPasswordTokenExpiresAt = undefined;

    await user.save();
    res.json({ success: true, message: "Reset password successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
}

export const logout = async (req, res) => {
    res.clearCookie("token")
    res.status(200).json({success: true,
        message: "Logout verify successfuly"})
}

