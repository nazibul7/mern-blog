import { User } from "../models/user.model.js"
import bcryptjs from "bcryptjs"
import { errorHandler } from "../utils/apiError.js"

export const signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body
        if (!username || !email || !password || username == "" || email == "" || password == "") {
            next(errorHandler(400, "All fields are required"))
        }
        const hashPassword = bcryptjs.hashSync(password, 10)
        const newUser = await User.create({
            username, email, password: hashPassword
        })
        await newUser.save()
        res.json({ message: "Signup successful" })
    } catch (error) {
        next(error)
    }
}