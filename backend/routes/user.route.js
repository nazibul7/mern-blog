import express, { Router } from "express"
import { deleteUser, getUserComment, getUsers, signOut, test, updateUser } from "../controllers/user.controller.js"
import { verifyToken } from "../utils/varifyUser.js"

const router = express.Router()

router.route('/test').get(test)
router.put('/update/:userId', verifyToken, updateUser)
router.delete('/delete/:userId', verifyToken, deleteUser)
router.post('/signout',signOut)
router.get('/getusers',verifyToken,getUsers)
router.get('/:userId',getUserComment)

export default router