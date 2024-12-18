import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";  // Đảm bảo có phần mở rộng .js
import authRoutes from "./routes/auth.route.js";  // Đảm bảo có phần mở rộng .js

dotenv.config();
const app = express()
const port = process.env.PORT || 3002

app.use(express.json())

app.use("/api/auth", authRoutes)
app.listen(port, () => {
    connectDB()
    console.log(`Server is running on port ${port}`)
})