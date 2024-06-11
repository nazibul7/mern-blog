import { errorHandler } from "../utils/apiError.js"
import { Comment } from "../models/comment.model.js"

export const createComment = async (req, res, next) => {
    try {
        const { commentContent, postId, userId } = req.body
        if (req.user.userId != userId) {
            return errorHandler(403, "You are not allowed to create a comment!")
        }
        const newComment = await Comment.create({
            commentContent, postId, userId
        })
        res.status(200).json(newComment)
    } catch (error) {
        next(error)
    }
}

export const getPostComments = async (req, res, next) => {
    const { postId } = req.params
    if (!postId || typeof postId != 'string') {
        return next(errorHandler(400, "Invali postId parameter"))
    }
    try {
        const comments = await Comment.find({ postId })
            .sort({ createdAt: -1 })
        if (!comments) {
            return next(errorHandler(404, "No comments found for this post"))
        }
        res.status(200).json(comments)
    } catch (error) {
        next(error)
    }
}