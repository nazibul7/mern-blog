import { User } from "../models/user.model.js"
import bcryptjs from "bcryptjs"
import { errorHandler } from "../utils/apiError.js"
import jwt from "jsonwebtoken"

// @signup controller
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
// @signin controller
export const signin = async (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password || email == "" || password == "") {
        next(errorHandler(400, "All fields are required"))
    }
    try {
        const validUser = await User.findOne({ email })
        if (!validUser) {
            next(errorHandler(404, "User not found"))
        }
        const checkPassword = bcryptjs.compareSync(password, validUser.password)
        if (!checkPassword) {
           return next(errorHandler(400, "Invalid password"))
        }
        const token = jwt.sign(
            { userId: validUser._id, username: validUser.username },
            process.env.JWT_SECRET
        )
        const {password:pass,...rest}=validUser._doc
        res.status(200).cookie('accessToken', token, {
            httpOnly: true
        }).json({ rest })
    } catch (error) {
        next(error)
    }
}