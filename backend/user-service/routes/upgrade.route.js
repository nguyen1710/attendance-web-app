import express from 'express'
import { callBackUpgrade, upgradeAccount, upgradeStatus } from '../controllers/upgrade.controller.js'
const router = express.Router()

router.post("/payment", upgradeAccount)
router.post("/callback", callBackUpgrade)
router.post("/upgradeStatus", upgradeStatus)


export default router