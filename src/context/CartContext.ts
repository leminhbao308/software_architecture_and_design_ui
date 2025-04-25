import { createContext } from "react";
import {CartContextType} from "../types/CartContextType.ts";

// Tạo context với giá trị mặc định là undefined
const CartContext = createContext<CartContextType | undefined>(undefined);

export default CartContext;
