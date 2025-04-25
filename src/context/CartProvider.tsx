import React, {useEffect, useState} from "react";
import {CartItemType} from "../types/CartItemType.ts";
import CartContext from "./CartContext.ts";
import useUserContext from "../hooks/useUserContext.ts";
import CartService from "../services/cart/CartService.ts";
import {CartType} from "../types/CartType.ts";

interface CartProviderProps {
    children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({children}) => {
    const [cart, setCart] = useState<CartType | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const {userId} = useUserContext();
    const accessToken: string = localStorage.getItem("access_token") || sessionStorage.getItem("access_token") || "";

    // Fetch cart on component mount
    useEffect(() => {
        console.log(userId)
        if (userId) {
            fetchCart();
        }
    }, [userId]);

    const fetchCart = async () => {
        setLoading(true);
        try {
            const cartData = await CartService.getCart(accessToken, userId);
            setCart(cartData);
            setError(null);
        } catch (err) {
            console.error("Error fetching cart:", err);
            // Initialize an empty cart if none exists
            setCart({
                userId,
                items: {}
            });
            setError('Failed to fetch cart');
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (
        cartId: string,
        productId: string,
        productName: string,
        price: number,
        productThumbnail: string | null
    ) => {
        setLoading(true);
        try {
            const cartItem: CartItemType = {
                cartId,
                productId,
                productThumbnail,
                productName,
                price,
                quantity: 1
            };

            await CartService.addToCart(accessToken, userId, cartItem);

            // Update local state
            await fetchCart(); // Refetch the cart to ensure it's in sync with backend
            setError(null);
        } catch (err) {
            console.error("Error adding item to cart:", err);
            setError('Failed to add item to cart');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const removeFromCart = async (productId: string) => {
        setLoading(true);
        try {
            await CartService.removeFromCart(accessToken, userId, productId);

            // Update local state
            if (cart) {
                const updatedItems = {...cart.items};
                delete updatedItems[productId];
                setCart({
                    ...cart,
                    items: updatedItems
                });
            }

            setError(null);
        } catch (err) {
            console.error("Error removing item from cart:", err);
            setError('Failed to remove item from cart');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (productId: string, quantity: number) => {
        setLoading(true);
        try {
            await CartService.updateCartItem(accessToken, userId, productId, quantity);

            // Update local state
            if (cart && cart.items[productId]) {
                const updatedItems = {...cart.items};
                updatedItems[productId] = {
                    ...updatedItems[productId],
                    quantity: quantity
                };

                setCart({
                    ...cart,
                    items: updatedItems
                });
            }

            setError(null);
        } catch (err) {
            console.error("Error updating item quantity:", err);
            setError('Failed to update item quantity');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const clearCart = async () => {
        setLoading(true);
        try {
            await CartService.clearCart(accessToken, userId);

            // Update local state
            setCart({
                userId,
                items: {}
            });

            setError(null);
        } catch (err) {
            console.error("Error clearing cart:", err);
            setError('Failed to clear cart');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getCartTotal = (): number => {
        if (!cart) return 0;

        return Object.values(cart.items).reduce(
            (total, item) => total + (item.price * item.quantity),
            0
        );
    };

    const getCartItemsCount = (): number => {
        if (!cart) return 0;

        return Object.values(cart.items).reduce(
            (count, item) => count + item.quantity,
            0
        );
    };

    const value = {
        cart,
        loading,
        error,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemsCount
    };

    return <CartContext.Provider value={value}>
        {children}
    </CartContext.Provider>;
};

export default CartProvider;
