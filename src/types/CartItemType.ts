export interface CartItemType {
    cartId:string,
    productId: string,
    productThumbnail: string | null,
    productName: string,
    price: number,
    quantity: number
}
