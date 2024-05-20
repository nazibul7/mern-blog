import express from "express"
import { verifyToken } from "../utils/varifyUser.js"
import { creatPost } from "../controllers/post.controller.js"

const router = express.Router()

router.post('/create', verifyToken,creatPost)

export default router