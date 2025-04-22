import {Button, Tooltip} from "antd";
import {ShoppingCartOutlined} from "@ant-design/icons";
import React from "react";

interface CardActionItemProps {
    productId: string
}

const CardActionItem: React.FC<CardActionItemProps> = ({productId}) => {

    function handleAddToCart(e) {
        e.stopPropagation();
        console.log(`Product id ${productId} is added to cart!`)
    }

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
                    icon={<ShoppingCartOutlined/>}
                    size="middle"
                    onClick={handleAddToCart}
                />
            </Tooltip>
        </div>
    );
};
export default CardActionItem;
