import React from 'react';
import { Avatar, Typography, Space, Button, InputNumber } from 'antd';
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import {useCart} from "../../hooks/useCartContext.ts";

const { Text } = Typography;

interface CartItemProps {
    id: string;
    name: string;
    price: string;
    imageUrl: string;
    quantity: number;
    showQuantityControls?: boolean;
}

const CartItemComponent: React.FC<CartItemProps> = ({
                                                        id,
                                                        name,
                                                        price,
                                                        imageUrl,
                                                        quantity,
                                                        showQuantityControls = false
                                                    }) => {
    const { removeFromCart, updateQuantity, loading } = useCart();

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

    return (
        <div style={{ display: 'flex', width: '100%', alignItems: 'center', gap: 8 }}>
            <Avatar
                size={48}
                src={imageUrl}
                shape="square"
            />
            <div style={{ flex: 1, overflow: 'hidden' }}>
                <Space direction="vertical" size={0} style={{ width: '100%' }}>
                    <Text ellipsis style={{ fontWeight: 500 }}>{name}</Text>
                    <Text type="danger">{price}</Text>
                    {showQuantityControls && (
                        <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
                            <Button
                                icon={<MinusOutlined />}
                                size="small"
                                onClick={handleDecrement}
                                disabled={loading}
                            />
                            <InputNumber
                                min={1}
                                size="small"
                                value={quantity}
                                onChange={handleQuantityChange}
                                style={{ width: 50, margin: '0 8px' }}
                                disabled={loading}
                            />
                            <Button
                                icon={<PlusOutlined />}
                                size="small"
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
                icon={<DeleteOutlined />}
                size="small"
                onClick={handleRemoveItem}
                loading={loading}
            />
        </div>
    );
};

export default CartItemComponent;
