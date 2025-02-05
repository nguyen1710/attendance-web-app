import authMiddleware from "../middlewares/authMiddleware.js"
import Classroom from "../models/classroom.model.js"
import AttendanceSession from "../models/attendance.model.js"
import User from "../models/user.model.js"
import { Submission } from "../models/submission.model.js"
import bcryptjs from 'bcryptjs'

export const upgradeAccount =  [ authMiddleware, async (req, res) => {
    const token = req.header.authorization || ''
    const result = token.replace('Apikey ', '')

    const privateKey = ''

    const {description, transferAccount} = req.body

    if (!transferAccount || isNaN(transferAccount)) {
        return res.status(400).json({ success: false, message: "Invalid transfer amount" })
    }
    

    if(result !== privateKey) {
        return res.status(401).json({success: false})
    } else {
        const match = description.split(" ")
        if (!match) {
            return res.status(400).json({ success: false, message: "Invalid description format" })
        }
        const emailUser = match[0]
        const level = match.at(-1)
        const dataUser = await User.findOne({email: emailUser})
        if(dataUser) {
            dataUser.balance += transferAccount
            dataUser.level = level
            await dataUser.save()
            return res.status(200).json({success:true})
        } else {
            return res.status(400).json({success: false})
        }

    }
}]