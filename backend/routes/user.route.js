import express, { Router } from "express"
import { test, updateUser } from "../controllers/user.controller.js"
import { verifyToken } from "../utils/varifyUser.js"

const router = express.Router()

router.route('/test').get(test)
router.put('/update/:userId', verifyToken, updateUser)

export default router