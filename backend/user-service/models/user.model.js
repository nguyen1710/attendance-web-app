
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
    role:{
        type: String, 
        enum: ["admin", "teacher", "student"], 
        default: "teacher"
    },
    resetPassordToken: String,
    resetPassordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,

}, {timestamp:true})

const User = mongoose.model('User', userSchema)
export default User