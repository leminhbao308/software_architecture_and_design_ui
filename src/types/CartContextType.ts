import {CartType} from "./CartType.ts";

export interface CartContextType {
    cart: CartType | null;
    loading: boolean;
    error: string | null;
    addToCart: (cartId: string, productId: string, productName: string, price: number, productThumbnail: string | null) => Promise<void>;
    removeFromCart: (productId: string) => Promise<void>;
    updateQuantity: (productId: string, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
    getCartTotal: () => number;
    getCartItemsCount: () => number;
}
