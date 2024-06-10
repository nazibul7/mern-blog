import express from "express"
import mongoose from "mongoose";
import dotenv from "dotenv"
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js"
import postRoutes from "./routes/post.route.js"
import commentRoutes from "./routes/comment.route.js"
import cookieParser from "cookie-parser";

dotenv.config()
mongoose.connect(process.env.MONFODB_URI + '/mern-blog')
    .then(() => {
        console.log('MongoDB is connected');
    })
    .catch((err) => {
        console.log("MongoDB error", err);
    })


const app = express()

app.listen(3000, () => {
    console.log('Server is running at port 3000');
})

app.use(express.json())
app.use(cookieParser())
app.use("/api/user", userRoutes)
app.use('/api/post', postRoutes)
app.use('/api/comment', commentRoutes)
app.use('/api/auth', authRoutes)

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || "Something went wrong"
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})