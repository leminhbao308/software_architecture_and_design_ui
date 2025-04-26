import {OrderItemType} from "../../types/order/OrderItemType.ts";
import {formatPrice} from "../../utils/formatUtils.tsx";
import React from "react";
import {OrderType} from "../../types/order/OrderType.ts";

interface ProductGridProps {
    orderDetails: OrderType
}

const ProductGrid: React.FC<ProductGridProps> = ({orderDetails}) => {
    return (
        <table style={{width: '100%', borderCollapse: 'collapse'}}>
            <thead>
            <tr style={{borderBottom: '1px solid #f0f0f0'}}>
                <th style={{textAlign: 'left', padding: '10px'}}>Sản phẩm</th>
                <th style={{textAlign: 'center', padding: '10px'}}>Số lượng</th>
                <th style={{textAlign: 'right', padding: '10px'}}>Đơn giá</th>
                <th style={{textAlign: 'right', padding: '10px'}}>Thành tiền</th>
            </tr>
            </thead>
            <tbody>
            {orderDetails.items && orderDetails.items.map((item: OrderItemType, index: number) => (
                <tr key={index} style={{borderBottom: '1px solid #f0f0f0'}}>
                    <td style={{padding: '10px'}}>{item.productName}</td>
                    <td style={{textAlign: 'center', padding: '10px'}}>{item.quantity}</td>
                    <td style={{textAlign: 'right', padding: '10px'}}>{formatPrice(item.pricePerUnit)}</td>
                    <td style={{textAlign: 'right', padding: '10px'}}>{formatPrice(item.pricePerUnit * item.quantity)}</td>
                </tr>
            ))}
            </tbody>
            <tfoot>
            <tr>
                <td colSpan={3} style={{textAlign: 'right', padding: '10px'}}><strong>Tổng cộng:</strong></td>
                <td style={{textAlign: 'right', padding: '10px'}}><strong>{formatPrice(orderDetails.totalAmount)}</strong></td>
            </tr>
            </tfoot>
        </table>
    );
}

export default ProductGrid
