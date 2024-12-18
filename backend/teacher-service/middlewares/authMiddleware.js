import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()
const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]
    console.log(token)
    if(!token) {
        return res.status(401).json({
            success: false,
            message: "No token is provided"
        })
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        // const user = await User.findById(decoded.userId);
        
        // if (!user) {
        //     return res.status(404).json({ success: false, message: 'User not found' });
        // }

        req.userId = decoded.userId; // Thêm thông tin user vào request để sử dụng trong các API tiếp theo
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
};

export default authMiddleware;