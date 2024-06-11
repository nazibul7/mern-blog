import express from "express"
import { createComment, getPostComments } from "../controllers/comment.controller.js"
import { verifyToken } from "../utils/varifyUser.js"

const router = express.Router()

router.post('/create', verifyToken, createComment)
router.get('/getPostComments/:postId', getPostComments)

export default router