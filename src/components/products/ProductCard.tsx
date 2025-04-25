import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {Badge, Card, Space, Typography,} from "antd";
import StatusConst from "../../consts/StatusConst";
import {ProductType} from "../../types/ProductType";
import CardActionItem from "./CardActionItem.tsx";

const {Text, Paragraph} = Typography;

interface ProductCardProps {
    product: ProductType;
    width?: string | number;
}

const ProductCard: React.FC<ProductCardProps> = ({product, width = 300}) => {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);

    // Calculate discount percentage
    const discountPercentage = product.basePrice !== product.currentPrice
        ? Math.ceil((1 - product.currentPrice / product.basePrice) * 100)
        : 0;

    // Format price with currency
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    // Handle click on the product card
    const handleProductClick = () => {
        navigate("/product-detail", {
            state: {
                product: product,
            },
        });
    };

    // Render the product price information
    const renderPriceInfo = () => {
        if (product.status === StatusConst.INACTIVE) {
            return <Text type="danger">Ngừng kinh doanh</Text>;
        }

        return (
            <Space direction="vertical" size={0}>
                {product.basePrice !== product.currentPrice ? (
                    <Space>
                        <Text type="danger" strong style={{fontSize: '16px'}}>
                            {formatPrice(product.currentPrice)}
                        </Text>
                        <Text delete type="secondary" style={{fontSize: '14px'}}>
                            {formatPrice(product.basePrice)}
                        </Text>
                    </Space>
                ) : (
                    <Text type="danger" strong style={{fontSize: '16px'}}>
                        {formatPrice(product.basePrice)}
                    </Text>
                )}
            </Space>
        );
    };

    // Render the product status tag
    const renderProductStatus = () => {
        if (product.totalQuantity <= 0) {
            return {
                text: <Text strong style={{fontSize: '16px', color: "white"}}>
                    Đang về hàng
                </Text>,
                type: "waiting"
            };
        }

        if (product.status === StatusConst.ACTIVE && discountPercentage > 0) {
            return {
                text: <Text strong style={{fontSize: '16px', color: "white"}}>
                    Giảm {discountPercentage}%
                </Text>,
                type: "discount"
            };
        }

        return null;
    };

    // Render the action bubble
    const renderActionBubble = () => {
        if (product.totalQuantity > 0 && product.status === StatusConst.ACTIVE && isHovered) {
            return (
                <CardActionItem cartId={product.productId} productId={product.productId} productName={product.name} productPrice={product.currentPrice}
                                productThumbnail={product.thumbnailUrl}/>
            );
        }
        return null;
    };

    return (
        <div
            style={{
                position: 'relative',
                alignSelf: 'center',
                width: width,
                height: '370px', // Set fixed total height for the card container
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {renderActionBubble()}
            <Badge.Ribbon
                placement={"start"}
                color={renderProductStatus()?.type === "discount" ? "blue" : renderProductStatus()?.type === "waiting" ? "red" : "magenta"}
                text={renderProductStatus()?.text}
                style={{display: renderProductStatus() ? 'block' : 'none'}}
            >
                <Card
                    hoverable
                    cover={
                        <img
                            alt={product.name}
                            src={product.thumbnailUrl}
                            style={{height: '200px', objectFit: 'scale-down', padding: "10px"}}
                            onClick={handleProductClick}
                        />
                    }
                    onClick={handleProductClick}
                    styles={{
                        body: {
                            padding: '12px',
                            display: 'flex',
                            flexDirection: 'column',
                            height: '170px' // Fixed height for card body
                        }
                    }}
                    style={{width: '100%', height: '100%'}}
                >
                    <Paragraph
                        ellipsis={{rows: 2}}
                        style={{
                            marginBottom: '4px',
                            fontWeight: 'bold'
                        }}
                    >
                        {product.name}
                    </Paragraph>
                    {renderPriceInfo()}
                    <div style={{
                        marginTop: '8px',
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end'
                    }}>
                        <Paragraph
                            ellipsis={{rows: 2}}
                            style={{
                                fontSize: '12px',
                                backgroundColor: '#f5f5f5',
                                padding: '6px',
                                borderRadius: '4px',
                                margin: 0, // Remove default margin
                                height: '48px' // Fixed height for description area
                            }}
                        >
                            {product.description || ""}
                        </Paragraph>
                    </div>
                </Card>
            </Badge.Ribbon>
        </div>
    );
};

export default ProductCard;
