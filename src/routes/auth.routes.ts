import { login, register } from "../controllers/auth.controller"
import express, { Router } from "express"
const router: Router = express()

//REGISTER A USER
router.post("/register", register)

//LOGIN A USER
router.post("/login", login)


export default router