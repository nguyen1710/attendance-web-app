import { login, getAllClients, getAllClassrooms, updateProfile, getNewClients, deleteClient, blockClient, getClientsByStatus} from "../controllers/admin.controller.js";

import express from "express"
const router = express.Router()

router.post("/login", login)
router.get("/getAllClients", getAllClients);
router.get("/getNewClients", getNewClients)
router.get("/getClientsByStatus", getClientsByStatus);
router.get("/getAllClassrooms", getAllClassrooms);
router.put("/updateProfile",updateProfile);
router.delete("/deleteClient", deleteClient);
router.put("/blockClient", blockClient);
export default router