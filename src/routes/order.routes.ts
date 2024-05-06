import { createOrder, deleteOrder, getOrder, getUserOrders, updateOrder } from "../controllers/order.controller"
import express, { Router } from "express"
import { verifyUser } from "../middlewares/auth.middleware"
const router: Router = express()

//CREATE A CART
router.post("/:userId", verifyUser, createOrder)

//GET ALL CARTS
router.get("/:userId", verifyUser, getUserOrders)

//GET A CART
router.get("/:userId/:cartId", verifyUser, getOrder)

//UPDATE CART INFORMATION
router.put("/:userId/:cartId", verifyUser, updateOrder)

//DELETE CART INFORMATION
router.delete("/:userId/:cartId", verifyUser, deleteOrder)



export default router