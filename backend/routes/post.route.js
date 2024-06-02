import express from "express"
import { verifyToken } from "../utils/varifyUser.js"
import { creatPost, deletePost, getposts } from "../controllers/post.controller.js"

const router = express.Router()

router.post('/create', verifyToken,creatPost)
router.get('/getposts',getposts)
router.delete('/deletepost/:postId/:userId',verifyToken,deletePost)

export default router