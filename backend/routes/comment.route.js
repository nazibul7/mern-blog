import express from "express"
import { createComment } from "../controllers/comment.controller.js"
import { verifyToken } from "../utils/varifyUser.js"

const router = express.Router()

router.post('/create', verifyToken, createComment)

export default router