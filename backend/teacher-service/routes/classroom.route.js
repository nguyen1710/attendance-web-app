import express from "express"
import { createClassroom, getClassrooms } from "../controllers/classroom.controller.js"
const router = express.Router()


router.post("/createClassroom", createClassroom)

// router.post("/updateClassroom", updateClassroom)

// router.post("/deleteClassroom", deleteClassroom)

router.get("/getClassrooms", getClassrooms)

export default router