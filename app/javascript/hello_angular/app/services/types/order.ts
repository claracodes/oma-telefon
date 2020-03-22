import { OrderStatus } from "./order_status"
import { User } from "./user"

export class Order {
    id:	number
    list: string
    status: OrderStatus
    total: number
    owner: User
    shopper:User
}