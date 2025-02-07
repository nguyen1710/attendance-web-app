import express from 'express'
import { getLevelUserByEmail } from '../controllers/user.controller.js'
const router = express.Router()

router.post("/getLevelUser", getLevelUserByEmail)


export default router