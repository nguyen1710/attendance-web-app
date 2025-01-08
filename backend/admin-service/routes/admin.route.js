import { login, getAllClients} from "../controllers/admin.controller.js";

import express from "express"
const router = express.Router()

router.post("/login", login)
router.get("/getAllClients", getAllClients);

export default router