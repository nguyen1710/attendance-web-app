import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateTokenAndSetCookie.js"
import { sendVerificationEmail, sendWelcomEmail } from "../mailtrap/emails.js";
export const signup = async (req, res) => {
    const {email, password, username} = req.body

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
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000
        })
        await user.save()

        //jwt
        generateTokenAndSetCookie(res, user._id)

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

export const login = async (req, res) => {
    res.send("login")
}

export const logout = async (req, res) => {
    res.clearCookie("token")
    res.status(200).json({success: true,
        message: "Logout verify successfuly"})
}