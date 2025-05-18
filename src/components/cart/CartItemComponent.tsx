import React from 'react';
import {Avatar, Button, InputNumber, Space, Typography} from 'antd';
import {DeleteOutlined, MinusOutlined, PlusOutlined} from '@ant-design/icons';
import {useCart} from "../../hooks/useCartContext.ts";

const {Text} = Typography;

interface CartItemProps {
    id: string;
    name: string;
    price: string;
    imageUrl: string;
    quantity: number;
    showQuantityControls?: boolean;
    isBigger?: boolean;
}


const CartItemComponent: React.FC<CartItemProps> = ({
                                                        id,
                                                        name,
                                                        price,
                                                        imageUrl,
                                                        quantity,
                                                        showQuantityControls = false,
                                                        isBigger = false
                                                    }) => {
    const {removeFromCart, updateQuantity, loading} = useCart();

    const handleRemoveItem = (e: React.MouseEvent) => {
        e.stopPropagation();
        removeFromCart(id);
    };

    const handleQuantityChange = (value: number | null) => {
        if (value !== null && value > 0) {
            updateQuantity(id, value);
        }
    };

    const handleIncrement = () => {
        updateQuantity(id, quantity + 1);
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            updateQuantity(id, quantity - 1);
        } else {
            removeFromCart(id);
        }
    };

    const flexAlign = isBigger ? "top" : "center"
    const flexGap = isBigger ? 40 : 16;

    const productTitleStyle = isBigger ? {fontWeight: 500, fontSize: 18} : {fontWeight: 500}
    const productPriceStyle = isBigger ? {fontSize: 18} : {}
    const productQuantityStyle = isBigger ? {width: 80, margin: '0 8px'} : {width: 50, margin: '0 8px'}

    return (
        <div style={{display: 'flex', width: '100%', alignItems: flexAlign, gap: flexGap}}>
            <Avatar
                size={isBigger ? 128 : 48}
                src={imageUrl}
                shape="square"
            />
            <div style={{flex: 1, overflow: 'hidden'}}>
                <Space direction="vertical" size={0} style={{width: '100%'}}>
                    <Text ellipsis style={productTitleStyle}>{name}</Text>
                    <Text type="danger" style={productPriceStyle}>{price}</Text>
                    {showQuantityControls && (
                        <div style={{display: 'flex', alignItems: 'center', marginTop: 8}}>
                            <Button
                                icon={<MinusOutlined/>}
                                size={isBigger ? "large" : "small"}
                                onClick={handleDecrement}
                                disabled={loading}
                            />
                            <InputNumber
                                min={1}
                                size={isBigger ? "large" : "small"}
                                value={quantity}
                                onChange={handleQuantityChange}
                                style={productQuantityStyle}
                                disabled={loading}
                            />
                            <Button
                                icon={<PlusOutlined/>}
                                size={isBigger ? "large" : "small"}
                                onClick={handleIncrement}
                                disabled={loading}
                            />
                        </div>
                    )}
                    {!showQuantityControls && quantity > 1 && (
                        <Text type="secondary">x{quantity}</Text>
                    )}
                </Space>
            </div>
            <Button
                type="text"
                icon={<DeleteOutlined/>}
                size={isBigger ? "large" : "small"}
                onClick={handleRemoveItem}
                loading={loading}
            />
        </div>
    );
};

export default CartItemComponent;
