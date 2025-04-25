import React from 'react';
import { Badge, Dropdown, Button, List, Spin } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import CardContainerCore from "../layouts/CardContainerCore.tsx";
import CartItemComponent from "./CartItemComponent";
import { formatPrice } from '../../utils/formatUtils';
import {useCart} from "../../hooks/useCartContext.ts"; // Utility for formatting price

const CartComponent: React.FC = () => {
    const navigate = useNavigate();
    const { cart, loading, getCartItemsCount } = useCart();

    const handleViewCart = () => {
        navigate('/cart');
    };

    const cartContent = (
        <div style={{ width: 320 }}>
            <CardContainerCore
                title="Giỏ hàng"
                titleStyle={{ fontSize: '18px', margin: 0 }}
                bodyStyle={{ padding: '0 10px' }}
                style={{ boxShadow: 'none', cursor: 'default' }}
                button={{
                    show: true,
                    type: "link",
                    title: "Xem tất cả",
                    onClick: handleViewCart
                }}
            >
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                        <Spin />
                    </div>
                ) : (
                    <List
                        style={{ maxHeight: 320, overflowY: 'auto' }}
                        itemLayout="horizontal"
                        dataSource={cart && cart.items ? Object.values(cart.items) : []}
                        renderItem={(item) => (
                            <List.Item style={{ padding: '8px 0' }}>
                                <CartItemComponent
                                    id={item.productId}
                                    name={item.productName}
                                    price={formatPrice(item.price)}
                                    imageUrl={item.productThumbnail || ''}
                                    quantity={item.quantity}
                                />
                            </List.Item>
                        )}
                        locale={{ emptyText: "Giỏ hàng trống" }}
                    />
                )}
            </CardContainerCore>
        </div>
    );

    const cartItemCount = getCartItemsCount();

    return (
        <Dropdown
            dropdownRender={() => cartContent}
            placement="bottomRight"
            trigger={['hover', 'click']}
            arrow
            title={"Giỏ hàng"}
        >
            <Badge count={cartItemCount} size="small" offset={[-5, 5]}>
                <Button
                    icon={<ShoppingCartOutlined style={{ fontSize: '20px' }} />}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '40px',
                        width: '40px'
                    }}
                    type="primary"
                />
            </Badge>
        </Dropdown>
    );
};

export default CartComponent;
