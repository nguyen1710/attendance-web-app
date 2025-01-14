import { login, getAllClients, getAllClassrooms, updateProfile} from "../controllers/admin.controller.js";

import express from "express"
const router = express.Router()

router.post("/login", login)
router.get("/getAllClients", getAllClients);
router.get("/getAllClassrooms", getAllClassrooms);
router.put("/updateProfile",updateProfile)
export default router