import express from "express"
import { verifyToken } from "../utils/varifyUser.js"
import { creatPost, getposts } from "../controllers/post.controller.js"

const router = express.Router()

router.post('/create', verifyToken,creatPost)
router.get('/getposts',getposts)

export default router