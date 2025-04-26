import {OrderItemType} from "./OrderItemType.ts";

export interface OrderPayloadType {
    userId: string,
    customerName: string,
    customerEmail: string,
    customerPhone: string,
    customerAddress: string,
    items: OrderItemType[]
}
