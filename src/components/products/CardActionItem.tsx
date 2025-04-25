import {Button, message, Tooltip} from "antd";
import {ShoppingCartOutlined} from "@ant-design/icons";
import React from "react";
import {useCart} from "../../hooks/useCartContext.ts";

interface CardActionItemProps {
    cartId:string,
    productId: string;
    productName: string;
    productPrice: number;
    productThumbnail: string | null;
    icon?: React.ReactNode;
}

const CardActionItem: React.FC<CardActionItemProps> = ({
                                                           cartId,
                                                           productId,
                                                           productName,
                                                           productPrice,
                                                           productThumbnail,
                                                           icon
                                                       }) => {
    const { addToCart, loading } = useCart();

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await addToCart(cartId, productId, productName, productPrice, productThumbnail);
            message.success(`Đã thêm ${productName} vào giỏ hàng`);
        } catch (error) {
            message.error('Không thể thêm sản phẩm vào giỏ hàng');
            console.error(error)
        }
    };

    return (
        <div
            style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                zIndex: 10,
                background: 'white',
                padding: '8px',
                borderRadius: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                transition: 'all 0.3s ease'
            }}
        >
            <Tooltip title="Thêm vào giỏ hàng" placement="left">
                <Button
                    type="text"
                    icon={icon ? icon : <ShoppingCartOutlined />}
                    size="middle"
                    onClick={handleAddToCart}
                    loading={loading}
                />
            </Tooltip>
        </div>
    );
};

export default CardActionItem;
