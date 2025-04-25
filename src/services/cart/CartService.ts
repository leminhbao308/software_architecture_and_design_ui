import axios from "axios";
import APIConst from "../../consts/APIConst.ts";
import {CartType} from "../../types/CartType.ts";
import {CartItemType} from "../../types/CartItemType.ts";

const CartService = {
    getCart: async (access_token: string, userId: string): Promise<CartType> => {
        try {
            const response = await axios.get(
                `${APIConst.API_CONTEXT}${APIConst.GET_CART}/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log(response.data.data)
            return response.data.data;
        } catch (error) {
            console.error("Error fetching cart:", error);
            // Return an empty cart structure if there's an error
            return {
                userId,
                items: {}
            };
        }
    },

    addToCart: async (access_token: string, userId: string, cartItem: CartItemType) => {
        try {
            // Convert frontend price (number) to match backend BigDecimal format
            const backendCartItem = {
                ...cartItem,
                price: cartItem.price
            };

            const response = await axios.post(
                `${APIConst.API_CONTEXT}${APIConst.GET_CART}/${userId}`,
                backendCartItem,
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error adding item to cart:", error);
            throw error;
        }
    },

    updateCartItem: async (access_token: string, userId: string, productId: string, quantity: number) => {
        try {
            const response = await axios.put(
                `${APIConst.API_CONTEXT}/${userId}/cart/${productId}?quantity=${quantity}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error updating cart item:", error);
            throw error;
        }
    },

    removeFromCart: async (access_token: string, userId: string, productId: string) => {
        try {
            const response = await axios.delete(
                `${APIConst.API_CONTEXT}/${userId}/cart/${productId}`,
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log(response.data)
            return response.data;
        } catch (error) {
            console.error("Error removing item from cart:", error);
            throw error;
        }
    },

    clearCart: async (access_token: string, userId: string) => {
        try {
            const response = await axios.delete(
                `${APIConst.API_CONTEXT}/cart/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error clearing cart:", error);
            throw error;
        }
    },

    getCartTotal: async (access_token: string, userId: string) => {
        try {
            const response = await axios.get(
                `${APIConst.API_CONTEXT}/total/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error getting cart total:", error);
            throw error;
        }
    }
};

export default CartService;
