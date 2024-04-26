import { PrismaClient } from "@prisma/client";
import { Login, Register, User } from "../interfaces/user.interface";
import bcrypt from "bcrypt"
import HttpException from "../exceptions/HttpException";
import jwt from "jsonwebtoken";
import { emailValidator, schema } from "../middlewares/validation.middleware";
import { DataStoredInToken } from "../interfaces/auth.interface";

const prisma = new PrismaClient()
//REGISTER A USER
export const registerService = async (userData: Register): Promise<Register> => {
    const ifAlreadyExists = await prisma.user.findUnique({ where: { email: userData.email }})
    if(ifAlreadyExists) throw new HttpException(409, "This User already Exists")
    
    if (userData.username.length < 6) {
        throw new HttpException(403, "Username must be at least 6 characters long")
    } else if (!emailValidator.validate(userData.email)) {
        throw new HttpException(403, "Invalid Email Address, Email Address should be in the format foo@bar.com")
    } else if (!schema.validate(userData.password)) {
        throw new HttpException(403, "Invalid Password, password must have an uppercase letter, lowercase letter, no whitespaces and at least 2 digits")
    } else {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(userData.password, salt)
        const maxUserObject = await prisma.user.aggregate({
            _max: {
                userId: true
            }
        });
        const maxUser: string = maxUserObject._max.userId
        let newId = (maxUser ? parseInt(maxUser.split('-')[1], 10) + 1 : 1);
        let userId = `T-${newId.toString().padStart(3, '0')}`;
        while (await prisma.user.findUnique({ where: { userId } })) {
            newId++;
            userId = `T-${newId.toString().padStart(3, '0')}`;
        }
        const data = {
            userId: userId,
            username: userData.username,
            email: userData.email,
            password: hashedPassword,
            isAdmin: userData.isAdmin
        }
        const newUser = await prisma.user.create({ data: data })
        return newUser
    }
}

//LOGIN AN EXISTING USER
export const loginService = async (userData: Login): Promise<User> => {
    const user = await prisma.user.findUnique({ where: { email: userData.email }})
    if(!user) throw new HttpException(404, "User Not Found!!!")

    const isPasswordCorrect = await bcrypt.compare(userData.password, user.password)
    if(!isPasswordCorrect) throw new HttpException(401, "Username and Password don't match")
    
    const dataStoredInToken: DataStoredInToken = {
        userId: user.userId,
        isAdmin: user.isAdmin
    }
    const accessToken = jwt.sign(dataStoredInToken, process.env.JWT_SEC, { expiresIn: "24h" })
    const loginData: User = {
        userId: user.userId,
        username: user.username,
        email: user.email,
        password: user.password,
        isAdmin: user.isAdmin,
        token: accessToken
    }
    return loginData
}