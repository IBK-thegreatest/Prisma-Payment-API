import { CartData, Cart } from "interfaces/cart.interface";
import { PrismaClient } from "@prisma/client";
import HttpException from "../exceptions/HttpException";

const prisma = new PrismaClient()

//CREATE A CART
export const createCartService = async (userId: string, cartData: CartData): Promise<Cart> => {
    const user = await prisma.user.findUnique({ where: { userId: userId }})
    if(!user) throw new HttpException(404, "This user does not exist")
    
    const product = await prisma.product.findUnique({ where: { productName: cartData.productName }})
    if(!product) throw new HttpException(404, "This Product has been disabled")
    const maxCartObject = await prisma.cart.aggregate({
        _max: {
            cartId: true
        }
    });
    const maxCart: string = maxCartObject._max.cartId
    let newId = (maxCart ? parseInt(maxCart.split('-')[1], 10) + 1 : 1);
    let cartId = `C-${newId.toString().padStart(3, '0')}`;
    while (await prisma.cart.findUnique({ where: { cartId } })) {
        newId++;
        cartId = `C-${newId.toString().padStart(3, '0')}`;
    }
    const data: Cart = {
        cartId: cartId,
        userId: userId,
        productId: product.productId,
        quantity: cartData.quantity
    }
    const newCart = await prisma.cart.create({ data: data })
    return newCart
}

//GET ALL USER CARTS
export const getUserCartService = async (userId: string): Promise<Cart[]> => {
    const user = await prisma.user.findUnique({ where: { userId: userId }})
    if(!user) throw new HttpException(404, "This user does not exist")
    
    const userCarts = await prisma.cart.findMany({ where: { userId: userId }})
    return userCarts
}

//GET A CART
export const getCartService = async (userId: string, cartId: string): Promise<Cart> => {
    const user = await prisma.user.findUnique({ where: { userId: userId }})
    if(!user) throw new HttpException(404, "This User does not exist")
    
    const cart = await prisma.cart.findUnique({ where: { cartId: cartId }})
    if(!cart) throw new HttpException(404, "This Cart does not exist")

    return cart
}

//UPDATE A CART
export const updateCartService = async (userId: string, cartId: string, cartData: CartData): Promise<Cart> => {
    const user = await prisma.user.findUnique({ where: { userId: userId }})
    if(!user) throw new HttpException(404, "This User does not exist")
    
    const cart = await prisma.cart.findUnique({ where: { cartId: cartId }})
    if(!cart) throw new HttpException(404, "This Cart does not exist")

    const updatedUser = await prisma.cart.update({ where: { cartId: cartId }, data: cartData })
    return updatedUser
}

//DELETE A CART
export const deleteCartService = async (userId: string, cartId: string): Promise<void> => {
    const user = await prisma.user.findUnique({ where: { userId: userId }})
    if(!user) throw new HttpException(404, "This User does not exist")
    
    const cart = await prisma.cart.findUnique({ where: { cartId: cartId }})
    if(!cart) throw new HttpException(404, "This Cart does not exist")
    
    await prisma.cart.delete({ where: { cartId: cartId }})
}