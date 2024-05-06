import HttpException from "../exceptions/HttpException";
import { Order, OrderData } from "../interfaces/order.interface";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

//CREATE AN ORDER
export const createOrderService = async (userId: string, orderData: OrderData): Promise<Order> => {
    const user = await prisma.user.findUnique({ where: { userId: userId }})
    if(!user) throw new HttpException(404, "This user does not exist")
    const product = await prisma.product.findUnique({ where: { productName: orderData.productName }})
    if(!product) throw new HttpException(404, "This Product has been disabled")
    const maxOrderObject = await prisma.order.aggregate({
        _max: {
            orderId: true
        }
    });
    const maxOrder: string = maxOrderObject._max.orderId
    let newId = (maxOrder ? parseInt(maxOrder.split('-')[1], 10) + 1 : 1);
    let orderId = `ORDER-${newId.toString().padStart(3, '0')}`;
    while (await prisma.order.findUnique({ where: { orderId } })) {
        newId++;
        orderId = `ORDER-${newId.toString().padStart(3, '0')}`;
    }
    const data: Order = {
        orderId: orderId,
        userId: userId,
        productId: product.productId,
        quantity: orderData.quantity,
        amount: orderData.amount,
        address: orderData.address,
        status: orderData.status
    }
    const newOrder = await prisma.order.create({ data: data })
    return newOrder
}

//GET ALL ORDERS
export const getUserOrdersService = async (userId: string): Promise<Order[]> => {
    const user = await prisma.user.findUnique({ where: { userId: userId }})
    if(!user) throw new HttpException(404, "This user does not exist")

    const orders = await prisma.order.findMany({ where: { userId: userId }})
    return orders
}

//GET AN ORDER
export const getOrderService = async (userId: string, orderId: string): Promise<Order> => {
    const user = await prisma.user.findUnique({ where: { userId: userId }})
    if(!user) throw new HttpException(404, "This user does not exist")

    const order = await prisma.order.findUnique({ where: { orderId: orderId }})
    if(!order) throw new HttpException(404, "There are no order for this user")

    return order
}

//UPDATE ORDER INFORMATION
export const updateOrderService = async (userId: string, orderId: string, orderData: OrderData): Promise<Order> => {
    const user = await prisma.user.findUnique({ where: { userId: userId }})
    if(!user) throw new HttpException(404, "This user does not exist")

    const order = await prisma.order.findUnique({ where: { orderId: orderId }})
    if(!order) throw new HttpException(404, "There are no order for this user")
    
    if(orderData.productName) {
        const product = await prisma.product.findUnique({ where: { productName: orderData.productName }})
        if(!product) throw new HttpException(404, "This Product either does not exist and has been disabled")
        const updatedOrder = await prisma.order.update({ where: { orderId: orderId }, data: { productId: product.productId }})
        return updatedOrder
    } else {
        const updatedOrder = await prisma.order.update({ where: { orderId: orderId }, data: orderData })
        return updatedOrder
    }
}

//DELETE ORDER INFORMATION
export const deleteOrderService = async (userId: string, orderId: string): Promise<void> => {
    const user = await prisma.user.findUnique({ where: { userId: userId }})
    if(!user) throw new HttpException(404, "This user does not exist")

    const order = await prisma.order.findUnique({ where: { orderId: orderId }})
    if(!order) throw new HttpException(404, "There are no order for this user")

    await prisma.order.delete({ where: { orderId: orderId }})
}