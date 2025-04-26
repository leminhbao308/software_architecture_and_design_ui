import {useContext} from "react";
import CartContext from "../context/CartContext.ts";

// Custom hook để sử dụng context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
