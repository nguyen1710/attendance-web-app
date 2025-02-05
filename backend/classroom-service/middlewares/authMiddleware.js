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

        req.userEmail = decoded.userEmail // Thêm thông tin user vào request để sử dụng trong các API tiếp theo
        req.userRole = decoded.userRole
        next();
    } catch (error) {
        console.error(error);
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ success: false, message: "Token has expired" });
        }
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
};

export default authMiddleware;