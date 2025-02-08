import express from 'express'
import { getLevelUserByEmail, getUserByEmail } from '../../controllers/user-service/user.controller.js'
const router = express.Router()

router.post("/getLevelUser", getLevelUserByEmail)
router.post("/getUserByEmail", getUserByEmail)

export default router