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

export const likeComment = async (req, res, next) => {
    const { commentId } = req.params
    try {
        const likeComment = await Comment.findById(commentId)
        if (!likeComment) {
            return next(errorHandler(404, "Comment not found"))
        }
        const userIndex = likeComment.likes.indexOf(req.user.userId)
        if (userIndex == -1) {
            likeComment.numberOfLikes += 1
            likeComment.likes.push(req.user.userId)
        }
        else {
            if(likeComment.numberOfLikes>0){
                likeComment.numberOfLikes -= 1
            }
            likeComment.likes.splice(userIndex, 1)
        }
        await likeComment.save()
        res.status(200).json(likeComment)
    } catch (error) {
        next(error)
    }
}

// The method comment.save() is used to save the changes made to the comment document in the database. Here's why this is necessary and why Comment.save() wouldn't work in this context:
// Saving Changes to a Document:
// When you modify a Mongoose document (like updating the numberOfLikes or modifying the likes array), those changes are only made in memory. To persist these changes to the database, you need to call the save() method on the document instance. This method ensures that the updated state of the document is written to the database.

// Instance Method vs. Model Method:

// comment.save(): This is an instance method called on a specific document instance. It saves the current state of that particular document to the database.
// Comment.save(): This would imply calling save() on the Model itself, which is not valid. The save() method is meant to be called on document instances, not on the Model constructor. The Model (in this case, Comment) provides static methods to create, read, update, and delete documents, but it doesn't have a save() method applicable to the Model as a whole.

export const editComment = async (req, res, next) => {
    console.log(req.body);
    console.log(req.params);
    console.log(req.user);
    try {
        const comment = await Comment.findById(req.params.commentId)
        if (!comment) {
            return next(errorHandler(404, "Comment not found"))
        }
        if (comment.userId != req.user.userId && !req.user.isAdmin) {
            return next(errorHandler(403, "You are not allowed to to edit this comment"))
        }
        const editedComment = await Comment.findByIdAndUpdate(req.params.commentId,
            {
                $set: {
                    commentContent: req.body.content
                }
            }, { new: true })
        res.status(200).json(editedComment)
    } catch (error) {
        next(error)
    }
}

export const deleteComment=async(req,res,next)=>{
    try {
        const comment=await Comment.findById(req.params.commentId)
        if(!comment){
            return next(errorHandler(404,"Comment not found"))
        }
        if(req.user.userId!=comment.userId && !req.user.isAdminr){
            return next(errorHandler(403,"You are not allowed to delete this comment"))
        }
        await Comment.findByIdAndDelete(req.params.commentId)
        res.status(200).json('Comment has been deleted')
    } catch (error) {
        next(error)
    }
}