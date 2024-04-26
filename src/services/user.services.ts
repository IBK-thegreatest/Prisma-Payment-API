import { PrismaClient } from "@prisma/client"
import { Register } from "../interfaces/user.interface"
import HttpException from "../exceptions/HttpException"
import bcrypt from "bcrypt"
import { emailValidator, schema } from "../middlewares/validation.middleware"

const prisma = new PrismaClient()
//GET ALL USERS
export const getAllUsersService = async (): Promise<Register[]> => {
    const users = await prisma.user.findMany()
    if(users.length === 0) throw new HttpException(403, "There are no users registered yet!!")
    return users
}

//GET A USER
export const getUserService = async (userId: string): Promise<Register> => {
    const user = await prisma.user.findUnique({ where: { userId: userId }})
    if(!user) throw new HttpException(401, "This user does not exist")
    return user
}

//UPDATE AN EXISTING USER
export const updateUserService = async (userId: string, userData: Register): Promise<Register> => {
    const user = await prisma.user.findUnique({ where: { userId: userId }})
    if(!user) throw new HttpException(401, "This user does not exist")

    if(userData.email)  {
        if(!emailValidator.validate(userData.email)) throw new HttpException(403, "Invalid Email Address, Email Address should be in the format foo@bar.com")
        const updatedUser = await prisma.user.update({ where: { userId: userId }, data: { email: userData.email }})
        return updatedUser
    } else if (userData.password) {
        if(!schema.validate(userData.password)) throw new HttpException(403, "Invalid Password, password must have an uppercase letter, lowercase letter, no whitespaces and at least 2 digits")
        const salt = await bcrypt.genSalt(10)
        userData.password = await bcrypt.hash(userData.password, salt) as unknown as string
        const updatedUser = await prisma.user.update({ where: { userId: userId }, data: { password: userData.password }})
        return updatedUser
    } else {
        const updatedUser = await prisma.user.update({ where: { userId: userId }, data: userData})
        return updatedUser
    }
}

//DELETING AN EXISTING USER
export const deleteUserService = async (userId: string): Promise<void> => {
    const user = await prisma.user.findUnique({ where: { userId: userId }})
    if(!user) throw new HttpException(401, "This user does not exist")
    
    await prisma.user.delete({ where: { userId: userId }})
}