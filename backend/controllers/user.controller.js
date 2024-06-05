import { errorHandler } from "../utils/apiError.js"
import bcryptjs from "bcryptjs"
import { User } from "../models/user.model.js"

export const test = (req, res) => {
    res.send("Api is working")
}

export const updateUser = async (req, res, next) => {
    if (req.user.id != req.params.userId) {
        return next(errorHandler(403, 'You are not allowed to update user'))
    }
    const { password, username, email, profilePicture } = req.body
    if (!username && !password && !email && !profilePicture) {
        return next(errorHandler(400, "No valid fields to update"))
    }
    if (password) {
        if (req.body.password.length < 6) {
            return next(errorHandler(400, "password must be at least 6 characters"))
        }
        req.body.password = bcryptjs.hashSync(req.body.password, 10)
    }
    if (username) {
        if (username.length < 7 || username.length > 20) {
            return next(errorHandler(400, "username must be between 7 and 20 charcters"))
        }
        if (username.includes(' ')) {
            return next(errorHandler(400, "Username cannot contain spaces"))
        }
        if (username != username.toLowerCase()) {
            return next(errorHandler(400, "Username must not conatin uppercase"))
        }
        if (!username.match(/^[a-zA-Z0-9]+$/)) {
            return next(errorHandler(400, "Username only conatin letters and numbers"))
        }
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.userId,
            {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    profilePicture: req.body.profilePicture,
                    password: req.body.password,
                }
            }, { new: true }
        ).select('-password')
        res.status(200).json(updatedUser)
    } catch (error) {
        return next(error)
    }
}

export const deleteUser = async (req, res, next) => {
    if (!req.user.isAdmin && req.user.userId != req.params.userId) {
        return next(errorHandler(403, 'You are not allowed to update user'))
    }
    try {
        const deleteUser = await User.findByIdAndDelete(req.params.userId)
        res.status(200).json("User has been deleted")
    } catch (error) {
        next(error)
    }
}

export const signOut = async (req, res, next) => {
    try {
        res.clearCookie('accessToken').status(200).json("User has been signed out")
    } catch (error) {
        return next(error)
    }
}

export const getUsers = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandler(403, "You are not allowed to see all users"))
    }
    try {
        const startIndex = parseInt(req.query.startIndex) || 0
        const limit = parseInt(req.query.limit) || 5
        const sortDirection = req.query.sort === "asc" ? 1 : -1

        const users = await User.find()
            .sort({ createdAt: sortDirection })
            .skip(startIndex)
            .limit(limit)
            .select('-password')
        const totalUser = await User.countDocuments()
        const date = new Date()
        const oneMonthAgoMiliSeconds = date - 30 * 24 * 60 * 60 * 1000
        const oneMonthAgo = new Date(oneMonthAgoMiliSeconds)
        const lastMonthUsers = await User.find(
            {
                createdAt: { $gte: oneMonthAgo }
            }
        ).countDocuments()
        res.status(200).json({
            users,totalUser,lastMonthUsers
        })
    } catch (error) {
        next(error)
    }
}

