import Classroom from "../models/classroom.model.js"
import authMiddleware from "../middlewares/authMiddleware.js"
import mongoose from "mongoose"
export const createClassroom = [authMiddleware , async (req, res) => {
    try {
        const {name, description} = req.body

        if (!name) {
            return res.status(400).json({ success: false, message: 'Classroom name is required' });
        }

        const classroom = new Classroom({
            owner: req.userId,
            name: name,
            description: description,
            teacherId: req.userId
        })

        await classroom.save()

        return res.status(201).json({
            success: true,
            message: "Classroom created successfully",
            classroom: classroom
        })
    } catch (error) {
        console.error('Error creating classroom:', error.message);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}]

export const getClassrooms = [authMiddleware, async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.userId)
        const userRole = req.userRole
        console.log(typeof(userId))
        if (userRole == 'teacher') {
            const classrooms = await Classroom.find({teacherIds: {$in : [userId]}})
            console.log(req.userId)
            if(classrooms.length == 0) {
                return res.status(404).json({ success: false, message: 'Class not found' });
            }
    
            return res.status(200).json({
                success: true,
                message: 'Get classes successfully',
                classes: classrooms
            })
        }

        // const studentId = new mongoose.Types.ObjectId(req.userId);
        const classrooms = await Classroom.find({
            studentIds: { 
                $all: [userId]
            }
        })
        
        console.log(classrooms)
        if(classrooms.length == 0) {
            return res.status(404).json({ success: false, message: 'Class not found' });
        }

        return res.status(200).json({
            success: true,
            message: 'Get classes successfully',
            classes: classrooms
        })
        
        
        
    } catch (error) {
        console.error('Error get classroom:', error.message);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}]

export const deleteClassroom = [authMiddleware, async (req, res) => {
    try {
        const { id } = req.params
        const classroom = await Classroom.findById(id)
        if(!classroom) {
            return res.satus(404).json({
                success: "false",
                message: "Classroom not found"
            })
        }
        console.log(req.userId)
        console.log(classroom.owner.toString())
        if(classroom.owner.toString() != req.userId) {
            return res.status(403).json({ success: false, message: "You do not have permission to delete this classroom" });
        }

        await Classroom.findByIdAndDelete(id)

        return res.status(200).json({
            success: true,
            message: "Classroom deleted successfully"
        });
    } catch (error) {
        console.log("Error when delete class", error)
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}]