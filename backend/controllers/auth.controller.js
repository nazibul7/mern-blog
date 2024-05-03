import { User } from "../models/user.model.js"
import bcryptjs from "bcryptjs"

export const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body
        if (!username || !email || !password || username == "" || email == "" || password == "") {
            return res.status(400).json({ message: "All fields are required" })
        }
        const hashPassword = bcryptjs.hashSync(password, 10)
        const newUser = await User.create({
            username, email, password:hashPassword
        })
        await newUser.save()
        res.json({ message: "Signup successful" })
    } catch (error) {
        res.send(error.message)
    }
}