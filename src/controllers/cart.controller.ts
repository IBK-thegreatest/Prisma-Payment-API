import { Response, NextFunction } from "express";
import { RequestWithUser } from "../interfaces/auth.interface";
import { createCartService, deleteCartService, getCartService, getUserCartService, updateCartService } from "../services/cart.services";

export const createCart = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.params.userId
        const cartData = req.body
        const newCartData = await createCartService(userId, cartData)
        res.status(200).json({
            success: true,
            status: "OK",
            message: "Product has been added to Cart",
            data: newCartData
        })
    } catch (error) {
        next(error)
    }
}

export const getUserCarts = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.params.userId
        const userCarts = await getUserCartService(userId)
        res.status(200).json(userCarts)
    } catch (error) {
        next(error)
    }
}

export const getCart = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.params.userId
        const cartId = req.params.cartId
        const cart = await getCartService(userId, cartId)
        res.status(200).json(cart)
    } catch (error) {
        next(error)
    }
}

export const updateCart = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.params.userId
        const cartId = req.params.cartId
        const cartData = req.body
        const updatedCart = await updateCartService(userId, cartId, cartData)
        res.status(200).json({
            success: true,
            status: "OK",
            message: "Product Information in the Cart has been Successfully updated",
            data: updatedCart
        })
    } catch (error) {
        next(error)
    }
}

export const deleteCart = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.params.userId
        const cartId = req.params.cartId
        await deleteCartService(userId, cartId)
            .then(() => {
                res.status(200).json({
                    success: true,
                    status: "OK",
                    message: "Product has been Removed from the Cart"
                })
            })
    } catch (error) {
        next(error)
    }
}