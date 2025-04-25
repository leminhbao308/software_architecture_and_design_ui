// Match the backend Cart structure
import {CartItemType} from "./CartItemType.ts";

export interface CartType {
    userId: string;
    items: { [key: string]: CartItemType };
}
