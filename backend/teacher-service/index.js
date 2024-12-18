import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";  // Đảm bảo có phần mở rộng .js
import classroomRoutes from "./routes/classroom.route.js";  // Đảm bảo có phần mở rộng .js
import cookieParser from 'cookie-parser';
dotenv.config();
const app = express()
const port = process.env.PORT || 3002

app.use(cookieParser()); // Đảm bảo dòng này được khai báo trước các route khác
app.use(express.json())
app.get('/', (req, res) => {
    res.send("Hellooo port 3001")
})
app.use("/api/teacher", classroomRoutes)
app.listen(port, () => {
    connectDB()
    console.log(`Server is running on port ${port}`)
})