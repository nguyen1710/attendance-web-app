import Classroom from "../models/classroom.model.js"
import authMiddleware from "../middlewares/authMiddleware.js"

export const createClassroom = [authMiddleware , async (req, res) => {
    try {
        const {name, description} = req.body

        if (!name) {
            return res.status(400).json({ success: false, message: 'Classroom name is required' });
        }

        const classroom = new Classroom({
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
        const classrooms = await Classroom.find({teacherId: req.userId})
        console.log(req.userId)
        if(!classrooms) {
            return res.status(404).json({ success: false, message: 'Class not found' });
        }

        return res.status(200).json({
            success: false,
            message: 'Get classes successfully',
            classes: classrooms
        })
    } catch (error) {
        console.error('Error get classroom:', error.message);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}]