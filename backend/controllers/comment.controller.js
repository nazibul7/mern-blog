import { errorHandler } from "../utils/apiError.js"
import { Comment } from "../models/comment.model.js"

export const createComment = async (req, res, next) => {
    try {
        const { commentContent, postId, userId } = req.body
        if (req.user.userId != userId) {
            return errorHandler(403, "You are not allowed to create a comment!")
        }
        const newComment = await Comment.create({
            commentContent,postId,userId
        })
        res.status(200).json(newComment)
    } catch (error) {
        next(error)
    }
}