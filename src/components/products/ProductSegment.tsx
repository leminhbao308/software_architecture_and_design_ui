import React, {MouseEventHandler, useEffect, useState} from "react";
import CardContainerCore from "../layouts/CardContainerCore.tsx";
import ProductTable from "./ProductTable.tsx";
import {Button, Spin} from "antd";
import {ProductType} from "../../types/ProductType.ts";
import ProductService from "../../services/product/ProductService.ts";
import {useNavigate} from "react-router-dom";

interface ProductSegmentProps {
    categoryId?: string,
    title?: string,
    style?: React.CSSProperties,
    className?: string,
    bodyStyle?: React.CSSProperties,
    titleStyle?: React.CSSProperties,
    buttonStyle?: React.CSSProperties,
    size?: number,
    canLoadMore?: boolean,
    searchParams?: {
        name?: string,
        sku?: string,
        category?: string,
        brand?: string
    },
    button?: ButtonProps
}

interface ButtonProps {
    show: boolean,
    title: string,
    type?: "link" | "text" | "default" | "primary" | "dashed",
    onClick?: MouseEventHandler,
    navigateToCategoryId?: string
}

interface PaginationInfo {
    page: number;
    size: number;
    total_elements: number;
    total_pages: number;
    first: boolean;
    last: boolean;
}

const ProductSegment: React.FC<ProductSegmentProps> = (
    {
        categoryId,
        searchParams,
        title,
        style = {},
        className,
        bodyStyle = { padding: 20 },
        titleStyle = {},
        buttonStyle = {},
        size = 20,
        canLoadMore = true,
        button = {
            show: false,
            title: "Button",
            type: "default",
            onClick: () => { }
        }
    }) => {

    const navigate = useNavigate();
    const [products, setProducts] = useState<ProductType[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pagination, setPagination] = useState<PaginationInfo>({
        page: 1,
        size: size,
        total_elements: 0,
        total_pages: 1,
        first: true,
        last: true
    });

    const accessToken: string | null =
        localStorage.getItem("access_token") ||
        sessionStorage.getItem("access_token");

    useEffect(() => {
        // Reset to page 1 when searchParams or categoryId changes
        setCurrentPage(1);
        setProducts([]);
    }, [searchParams, categoryId]);

    useEffect(() => {
        const fetchProducts = async () => {
            if (!accessToken) {
                console.log("AccessToken không tồn tại");
                return;
            }
            setLoading(true);
            try {
                let data;

                // Use search service if searchParams are provided
                if (searchParams && (searchParams.name || searchParams.sku ||
                    searchParams.category || searchParams.brand)) {
                    data = await ProductService.searchProducts(accessToken, {
                        ...searchParams,
                        page: currentPage,
                        size: size
                    });
                } else {
                    // Use regular getAllProduct if no search params
                    data = await ProductService.getAllProduct(accessToken, categoryId, currentPage, size);
                }

                const listProducts = data.content;

                // Extract pagination info from response
                const paginationInfo = {
                    page: data.page,
                    size: data.size,
                    total_elements: data.total_elements,
                    total_pages: data.total_pages,
                    first: data.first,
                    last: data.last
                };

                setPagination(paginationInfo);

                if (Array.isArray(listProducts)) {
                    // Append new products to existing ones when loading more
                    if (currentPage === 1) {
                        setProducts(listProducts);
                    } else {
                        setProducts(prevProducts => [...prevProducts, ...listProducts]);
                    }
                } else {
                    console.log("Không tồn tại product");
                    if (currentPage === 1) {
                        setProducts([]);
                    }
                }
            } catch (error) {
                console.log(error);
                if (currentPage === 1) {
                    setProducts([]);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [currentPage, accessToken, categoryId, searchParams, size]);

    useEffect(() => {
        let retryInterval: ReturnType<typeof setInterval>;

        if (products.length === 0 && !loading) {
            retryInterval = setInterval(() => {
                const tryFetch = async () => {
                    try {
                        setLoading(true);
                        let data;

                        if (searchParams && (searchParams.name || searchParams.sku || searchParams.category || searchParams.brand)) {
                            data = await ProductService.searchProducts(accessToken!, {
                                ...searchParams,
                                page: 1,
                                size
                            });
                        } else {
                            data = await ProductService.getAllProduct(accessToken!, categoryId, 1, size);
                        }

                        const listProducts = data.content;

                        setPagination({
                            page: data.page,
                            size: data.size,
                            total_elements: data.total_elements,
                            total_pages: data.total_pages,
                            first: data.first,
                            last: data.last
                        });

                        if (Array.isArray(listProducts)) {
                            setProducts(listProducts);
                            clearInterval(retryInterval); // Dừng retry khi đã có data
                        }
                    } catch (err) {
                        console.log("❌ Thử lại thất bại", err);
                    } finally {
                        setLoading(false);
                    }
                };

                tryFetch();
            }, 5000); // 10 giây/lần
        }

        return () => clearInterval(retryInterval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [products.length, loading]);

    // Load more products when the button is clicked
    const handleLoadMore = () => {
        if (!loading && !pagination.last) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    // Handle the button click - either use provided onClick or navigate to the category
    const handleButtonClick: MouseEventHandler = (e) => {
        if (button.onClick) {
            button.onClick(e);
        } else if (button.navigateToCategoryId) {
            navigate(`/products/${button.navigateToCategoryId}`);
        }
    };

    return (
        <div style={{ marginBottom: "15px" }}>
            <Spin spinning={loading}>
                <CardContainerCore
                    title={title}
                    style={style}
                    titleStyle={titleStyle}
                    bodyStyle={bodyStyle}
                    buttonStyle={buttonStyle}
                    className={className}
                    button={button.show ? {
                        ...button,
                        onClick: handleButtonClick
                    } : button}
                >
                    {products.length > 0 ? (
                        <ProductTable
                            productList={products}
                        />
                    ) : !loading && (
                        <div className="text-center py-8">
                            Không tìm thấy sản phẩm nào
                        </div>
                    )}

                    {canLoadMore && !pagination.last && products.length > 0 && (
                        <div className="flex justify-center mt-6 mb-8">
                            <Button
                                type="primary"
                                onClick={handleLoadMore}
                                loading={loading}
                                size="large"
                            >
                                Xem thêm {size} sản phẩm
                            </Button>
                        </div>
                    )}

                    {canLoadMore && pagination.total_elements > 0 && (
                        <div className="text-center text-gray-500 mt-2">
                            Hiển thị {products.length} trên {pagination.total_elements} sản phẩm
                        </div>
                    )}
                </CardContainerCore>
            </Spin>
        </div>
    );
}

export default ProductSegment;
