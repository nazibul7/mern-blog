import { errorHandler } from "../utils/apiError.js"
import { Post } from "../models/post.model.js"

export const creatPost = async (req, res, next) => {
    const { title, content, category } = req.body
    console.log("USER", req.user);
    console.log(req.body);
    if (!req.user.isAdmin) {
        return next(errorHandler(403, "You are not allowed to creat a post"))
    }
    if (!title || !content) {
        return next(errorHandler(400, "Please provide all required fields"))
    }
    const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '')
    try {
        const newPost = await Post.create({
            title, content, category, slug, userId: req.user?.id || req.user.userId
        })
        res.status(200).json(newPost)
    } catch (error) {
        next(error)
    }
}

export const getposts = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0
        const limit = parseInt(req.query.limit) || 9
        const sortDirection = req.query.order == 'asc' ? 1 : -1
        const queryObj = {
            ...(req.query.userId && { userId: req.query.userId }),
            ...(req.query.category && { category: req.query.category }),
            ...(req.query.slug && { category: req.query.slug }),
            ...(req.query.postId && { _id: req.query.postId }),
            ...(req.query.searchTerm && {
                $or: [
                    { title: { $regex: req.query.searchTerm, $options: 'i' } },
                    { content: { $regex: req.query.searchTerm, $options: 'i' } }
                ]
            })
        }
        const post = await Post.find(queryObj).sort({ updatedAt: sortDirection })
            .skip(startIndex)
            .limit(limit)
        const totalPost = await Post.countDocuments()
        const now = new Date()
        const oneMonthAgoMiliSeconds = now - 30 * 24 * 60 * 60 * 1000 // Converted in milisecond
        const oneMonthAgo=new Date(oneMonthAgoMiliSeconds)
        const lastMonthPost = await Post.find({ createdAt: { $gte: oneMonthAgo } }).countDocuments()
        res.status(200).json({
            post, totalPost, lastMonthPost
        })
    } catch (error) {
        console.log(error);
        next(error)
    }
}
