import { PrismaClient } from "@prisma/client"
import HttpException from "../exceptions/HttpException"
import { Product } from "../interfaces/product.interface"

const prisma = new PrismaClient()

//CREATE A PRODUCT
export const createProductService = async (userId: string, productData: Product): Promise<Product> => {
    const user = await prisma.user.findUnique({ where: { userId: userId }})
    if(!user) throw new HttpException(404, "This user does not exist")
    
    const maxProductObject = await prisma.product.aggregate({
        _max: {
            productId: true
        }
    });
    const maxProduct: string = maxProductObject._max.productId
    let newId = (maxProduct ? parseInt(maxProduct.split('-')[1], 10) + 1 : 1);
    let productId = `P-${newId.toString().padStart(3, '0')}`;
    while (await prisma.product.findUnique({ where: { productId } })) {
        newId++;
        productId = `P-${newId.toString().padStart(3, '0')}`;
    }
    const data: Product = {
        productId: productId,
        productName: productData.productName,
        description: productData.description,
        image: productData.image,
        size: productData.size,
        color: productData.color,
        price: productData.price
    }
    const newProduct = await prisma.product.create({ data: data })
    return newProduct
}

//GET ALL PRODUCTS
export const getAllProductsService = async (): Promise<Product[]> => {
    const products = await prisma.product.findMany()
    return products
}

//GET A PRODUCT
export const getProductService = async (userId: string, productId: string): Promise<Product> => {
    const user = await prisma.user.findUnique({ where: { userId: userId }})
    if(!user) throw new HttpException(404, "This user does not exist")
    
    const product = await prisma.product.findUnique({ where: { productId: productId }})
    if(!product) throw new HttpException(404, "This Product does not exist")
    return product
}

//UPDATE A PRODUCT
export const updateProductService = async (userId: string, productId: string, productData: Product): Promise<Product> => {
    const user = await prisma.user.findUnique({ where: { userId: userId }})
    if(!user) throw new HttpException(404, "This user does not exist")
    
    const product = await prisma.product.findUnique({ where: { productId: productId }})
    if(!product) throw new HttpException(404, "This Product does not exist")

    const updatedProduct = await prisma.product.update({ where: { productId: productId }, data: productData })
    return updatedProduct
}

//DELETE A PRODUCT
export const deleteProductService = async (userId: string, productId: string): Promise<void> => {
    const user = await prisma.user.findUnique({ where: { userId: userId }})
    if(!user) throw new HttpException(404, "This user does not exist")
    
    const product = await prisma.product.findUnique({ where: { productId: productId }})
    if(!product) throw new HttpException(404, "This Product does not exist")

    await prisma.product.delete({ where: { productId: productId }})
}