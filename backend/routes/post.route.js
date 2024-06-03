import express from "express"
import { verifyToken } from "../utils/varifyUser.js"
import { creatPost, deletePost, getposts, updatePost } from "../controllers/post.controller.js"

const router = express.Router()

router.post('/create', verifyToken,creatPost)
router.get('/getposts',getposts)
router.delete('/deletepost/:postId/:userId',verifyToken,deletePost)
router.put('/updatepost/:postId/:userId',verifyToken,updatePost)

export default router