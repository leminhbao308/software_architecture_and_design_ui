import {OrderItemType} from "./OrderItemType.ts";

export interface OrderType {
    id: number,
    userId: string,
    customerName: string,
    customerEmail: string,
    customerPhone: string,
    customerAddress: string,
    totalAmount: number,
    status: "CANCELLED" | "PAID" | "AWAITING_PAYMENT",
    paymentOrderCode: string,
    paymentUrl: string,
    paymentMethod: string | null,
    paymentTransactionId: string | null,
    items: OrderItemType[],
    createdAt: string,
    updatedAt: string
}
