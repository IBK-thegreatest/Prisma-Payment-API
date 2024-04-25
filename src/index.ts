import express, { Application, Request, Response, NextFunction } from "express"
import compression from "compression"
import morgan from "morgan"
import helmet from "helmet"
import cors from "cors"
import authRoutes from "./routes/auth.routes"
import userRoutes from "./routes/user.routes"
import cartRoutes from "./routes/cart.routes"
import orderRoutes from "./routes/order.routes"
import productRoutes from "./routes/product.routes"
import HttpException from "./exceptions/HttpException"

const app: Application = express()
app.use(express.json())
app.use(compression())
app.use(morgan("dev"))
app.use(helmet())
app.use(cors())
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/users", userRoutes)
app.use("/api/v1/carts", cartRoutes)
app.use("/api/v1/orders", orderRoutes)
app.use("/api/v1/products", productRoutes)
app.use((err: HttpException, req: Request, res: Response, next: NextFunction) => {
    const errorStatus = err.status || 500
    const errorMessage = err.message || "Something went wrong!!!"
    return res.status(errorStatus).json({
        success: false,
        status: "OK",
        message: errorMessage,
        stack: err.stack
    })
})

const PORT: number = 5000
app.listen(PORT, () => {
    console.log(`Backend Server is currently listening on port ${PORT}`);
})