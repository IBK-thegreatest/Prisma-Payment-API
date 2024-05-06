import express, { Router } from "express"
import { verifyUser, verifyAdmin } from "../middlewares/auth.middleware"
import { deleteUser, getAllUsers, getUser, updateUser } from "../controllers/user.controller"
const router: Router = express()

//GET ALL USERS
router.get("/", verifyAdmin, getAllUsers)

//GET A USER
router.get("/:userId", verifyUser, getUser)

//UPDATE USER INFORMATION
router.put("/:userId", verifyUser, updateUser)

//DELETE USER INFORMATION
router.delete("/:userId", verifyUser, deleteUser)


export default router