
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        require: true,
        unique:true,
    },
    password:{
        type:String,
        require:true
    },
    phone:{ 
        type: String, 
        required: false 
    },
    address:{ 
        type: String, 
        required: false 
    },
    imageUrl:{ 
        type: String, 
        required: false 
    },
    username: {
        type:String,
        require: true
    },
    lastLogin: {
        type:Date,
        default:Date.now
    },
    createAt: {
        type:Date,
        default:Date.now
    },
    updatedAt: {
        type:Date,
        default:Date.now
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    status:{
        type: String,
        default: "Active"
    },
    role:{
        type: String, 
        // enum: ["admin", "teacher", "student"], 
        default: "student"
    },
    googleId: { type: String, unique: true }, // Thêm trường googleId
    resetPassordToken: String,
    resetPassordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,

}, {timestamp:true})

const User = mongoose.model('User', userSchema)
export default User