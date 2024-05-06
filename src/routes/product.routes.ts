import express, { Router } from "express"
import { verifyUser, verifyAdmin, verifyToken } from "../middlewares/auth.middleware"
import { createProduct, deleteProduct, getAllProducts, getProduct, updateProduct } from "../controllers/product.controller"
const router: Router = express()

//CREATE A PRODUCT
router.post("/:userId", verifyAdmin, createProduct)

//GET ALL PRODUCTS
router.get("/", verifyToken, getAllProducts)

//GET A PRODUCT
router.get("/:userId/:productId", verifyUser, verifyAdmin, getProduct)

//UPDATE PRODUCT INFORMATION
router.put("/:userId/:productId", verifyUser, verifyAdmin, updateProduct)

//DELETE PRODUCT INFORMATION
router.delete("/:userId/:productId", verifyUser, verifyAdmin, deleteProduct)



export default router