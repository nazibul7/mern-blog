import express from "express"
import mongoose from "mongoose";
import dotenv from "dotenv"
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js"

dotenv.config()
mongoose.connect(process.env.MONFODB_URI+'/mern-blog')
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
app.use("/api/user",userRoutes)
app.use('/api/auth',authRoutes)