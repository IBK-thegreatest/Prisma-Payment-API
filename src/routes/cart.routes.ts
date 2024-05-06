import express, { Router } from "express"
import { verifyUser } from "../middlewares/auth.middleware"
import { createCart, deleteCart, getCart, getUserCarts, updateCart } from "../controllers/cart.controller"
const router: Router = express()

//CREATE A CART
router.post("/:userId", verifyUser, createCart)

//GET ALL CARTS
router.get("/:userId", verifyUser, getUserCarts)

//GET A CART
router.get("/:userId/:cartId", verifyUser, getCart)

//UPDATE CART INFORMATION
router.put("/:userId/:cartId", verifyUser, updateCart)

//DELETE CART INFORMATION
router.delete("/:userId/:cartId", verifyUser, deleteCart)


export default router