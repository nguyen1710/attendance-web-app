import User from "../models/user.model.js";

export const getLevelUserByEmail = async (req, res) => {
    const email = req.body
    try {
        const user = await User.findOne(email)

        if(!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        return res.status(200).json({
            success:true,
            level: user.level
        })
    } catch (error) {
        console.error("Error when get level user:", error);
        return res.status(500).json({ success: false, message: "Lỗi server" });
    }
}