import { errorHandler } from "../utils/apiError.js"
import { Post } from "../models/post.model.js"

export const creatPost = async (req, res, next) => {
    const { title, content } = req.body
    if (!req.user.isAdmin) {
        return next(errorHandler(403, "You are not allowed to creat a post"))
    }
    if (!title || !content) {
        return next(errorHandler(400, "Please provide all required fields"))
    }
    const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '')
    try {
        const newPost = await Post.create({
            title, content, slug, userId: req.user.userId
        })
        res.status(200).json(newPost)
    } catch (error) {
        next(error)
    }
}

