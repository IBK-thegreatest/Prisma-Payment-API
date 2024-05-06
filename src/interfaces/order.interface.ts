export interface OrderData {
    orderId: string
    userId: string
    productName: string
    quantity: number
    amount: number
    address: string
    status: string
}

export interface Order {
    orderId: string
    userId: string
    productId: string
    quantity: number
    amount: number
    address: string
    status: string
}