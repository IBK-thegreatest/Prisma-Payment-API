import { Response, NextFunction } from "express"
import { RequestWithUser } from "../interfaces/auth.interface"
import { createOrderService, deleteOrderService, getOrderService, getUserOrdersService, updateOrderService } from "../services/order.services"

//CREATE AN ORDER
export const createOrder = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.params.userId
        const orderData = req.body
        const newOrderdata = await createOrderService(userId, orderData)
        res.status(200).json({
            success: true,
            status: "OK",
            message: "A new order has been Added to your list of orders",
            data: newOrderdata
        })
    } catch (error) {
        next(error)
    }
}

//GET ALL USER ORDERS
export const getUserOrders = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.params.userId
        const userOrders = await getUserOrdersService(userId)
        res.status(200).json(userOrders)
    } catch (error) {
        next(error)
    }
}

//GET AN ORDER
export const getOrder = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.params.userId
        const orderId = req.params.orderId
        const order = await getOrderService(userId, orderId)
        res.status(200).json(order)
    } catch (error) {
        next(error)
    }
}

//UPDATE AN ORDER
export const updateOrder = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.params.userId
        const orderId = req.params.orderId
        const orderData = req.body
        const updatedOrder = await updateOrderService(userId, orderId, orderData)
        res.status(200).json({
            success: true,
            status: "OK",
            message: "A new order has been Added to your list of orders",
            data: updatedOrder
        })
    } catch (error) {
        next(error)
    }
}

//DELETE AN ORDER
export const deleteOrder = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.params.userId
        const orderId = req.params.orderId
        await deleteOrderService(userId, orderId)
            .then(() => {
                res.status(200).json({
                    success: true,
                    status: "OK",
                    message: "A new order has been Added to your list of orders"
                })
            })
    } catch (error) {
        next(error)
    }
}