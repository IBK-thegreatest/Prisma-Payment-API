import { Response, NextFunction } from "express";
import { RequestWithUser } from "../interfaces/auth.interface";
import { createProductService, deleteProductService, getAllProductsService, getProductService, updateProductService } from "../services/product.services";

//CREATE A PRODUCT
export const createProduct = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.params.userId
        const productData = req.body
        const newProductData = await createProductService(userId, productData)
        res.status(200).json({
            success: true,
            status: "OK",
            message: "New Product has been Successfully added",
            data: newProductData
        })
    } catch (error) {
        next(error)
    }
}

//GET ALL PRODUCTS
export const getAllProducts = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
        const products = await getAllProductsService()
        res.status(200).json(products)
    } catch (error) {
        next(error)
    }
}

//GET A PRODUCT
export const getProduct = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.params.userId
        const productId = req.params.productId
        const product = await getProductService(userId, productId)
        res.status(200).json(product)
    } catch (error) {
        next(error)
    }
}

//UPDATE A PRODUCT
export const updateProduct = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.params.userId
        const productId = req.params.productId
        const productData = req.body
        const updatedProduct = await updateProductService(userId, productId, productData)
        res.status(200).json({
            success: true,
            status: "OK",
            message: "Product Information has been Updated",
            data: updatedProduct
        })
    } catch (error) {
        next(error)
    }
}

//DELETE A PRODUCT
export const deleteProduct = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.params.userId
        const productId = req.params.productId
        await deleteProductService(userId, productId)
            .then(() => {
                res.status(200).json({
                    success: true,
                    status: "OK",
                    message: "Product Information has been Deleted"
                })
            })
    } catch (error) {
        next(error)
    }
}