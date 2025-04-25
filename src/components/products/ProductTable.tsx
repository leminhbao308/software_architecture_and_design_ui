import {ProductType} from "../../types/ProductType.ts";
import StatusConst from "../../consts/StatusConst.ts";
import React, {useEffect, useState} from "react";
import {Col, Row} from "antd";
import SortComponent from "../sort/SortComponent.tsx";
import ProductCard from "./ProductCard.tsx";

interface ProductTableProps {
    productList: ProductType[]
}

const ProductTable: React.FC<ProductTableProps> = ({ productList}) => {
    const [products, setProducts] = useState<ProductType[]>([]);
    const [sortType, setSortType] = useState<"decrease" | "increase" | null>("decrease");

    useEffect(() => {
        setProducts(productList)
    }, [productList])

    // Phương thức sắp xếp sản phẩm giảm dần theo giá
    const handleSortDecrease = () => {
        setSortType("decrease");
        const result = sort(products, "decrease");

        setProducts(result);
    };

    // Phương thức sắp xếp sản phẩm tăng dần theo giá
    const handleSortIncrease = () => {
        setSortType("increase");
        const result = sort(products, "increase");

        setProducts(result);
    };

    const sort = (products: Array<ProductType>, sortType: string) => {
        let sortStep01: Array<ProductType>;

        if (sortType === "increase")
            sortStep01 = [...products].sort(
                (a, b) => a.currentPrice - b.currentPrice
            );
        else if ((sortType === "decrease"))
            sortStep01 = [...products].sort(
                (a, b) => b.currentPrice - a.currentPrice
            );
        else
            sortStep01 = [];

        const sortStep02 = sortStep01.filter(
            (product) => product.status === StatusConst.ACTIVE
        );

        const sortStep03 = sortStep01.filter(
            (product) => product.status === StatusConst.INACTIVE
        );
        return [...sortStep02, ...sortStep03];
    }

    return (
        <div>
            <SortComponent
                onSortDecrease={handleSortDecrease}
                onSortIncrease={handleSortIncrease}
                currentSort={sortType}
            />
            <Row gutter={[16, 24]} className="mb-5">
                {products.length > 0 && products.map((product) => (
                    <Col key={product.productId} span={6}>
                        <ProductCard product={product}/>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default ProductTable;
