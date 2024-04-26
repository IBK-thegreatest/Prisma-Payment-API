import { Response, NextFunction } from "express"
import { RequestWithUser } from "../interfaces/auth.interface"
import { deleteUserService, getAllUsersService, getUserService, updateUserService } from "../services/user.services"

//GET ALL USERS
export const getAllUsers = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
        const users = await getAllUsersService()
        res.status(200).json(users)
    } catch (error) {
        next(error)
    }
}

//GET A USER
export const getUser = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.params.userId
        const user = await getUserService(userId)
        res.status(200).json(user)
    } catch (error) {
        next(error)
    }
}

//UPDATE EXISTING USER
export const updateUser = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.params.userId
        const userData = req.body
        const updatedUser = await updateUserService(userId, userData)
        res.status(200).json({
            success: true,
            status: "OK",
            message: "User Information has been successfully updated",
            data: updatedUser
        })
    } catch (error) {
        next(error)
    }
}

//DELETE EXISTING USER
export const deleteUser = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.params.userId
        await deleteUserService(userId)
            .then(() => {
                res.status(200).json({
                    success: true,
                    status: "OK",
                    message: "User Information has been successfully Deleted",
                })
            })
    } catch (error) {
        next(error)
    }
}