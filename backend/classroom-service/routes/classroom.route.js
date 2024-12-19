import express from "express"
import { createClassroom, getClassrooms, deleteClassroom } from "../controllers/classroom.controller.js"
const router = express.Router()


router.post("/createClassroom", createClassroom)

// router.post("/updateClassroom", updateClassroom)

router.post("/deleteClassroom/:id", deleteClassroom)

router.get("/getClassrooms", getClassrooms)

export default router