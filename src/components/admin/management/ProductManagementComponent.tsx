import React, {useEffect, useState, useCallback} from "react";
import {
    Alert,
    Button,
    Card,
    Form,
    Input,
    Layout,
    notification,
    Select,
    Space,
    Skeleton,
    Typography,
} from "antd";
import {
    PlusOutlined,
    ReloadOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import useCategoryContext from "../../../hooks/useCategoryContext";
import ProductService, {ProductUpdateUnifiedRequest} from "../../../services/product/ProductService";
import { getAccessToken } from "../../../utils/tokenUtils";
import {
    PriceHistoryType,
    ProductType,
    QuantityHistoryType,
} from "../../../types/ProductType.ts";
import { CategoryType } from "../../../types/category/CategoryType.ts";
import ProductManagementTable from "../../tables/ProductManagementTable.tsx";
import ProductActionModal from "../../popups/ProductActionModal.tsx";
import {PriceHistoryModal, QuantityHistoryModal} from "../../popups/ProductHistoryModal.tsx";

const { Content } = Layout;
const { Option } = Select;
const {Title} = Typography;

const ProductManagementComponent: React.FC = () => {
    // Access token
    const accessToken = getAccessToken();

    // Get categories from context
    const {categories, loading: categoriesLoading} = useCategoryContext();

    // State for products
    const [products, setProducts] = useState<ProductType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Refined loading states
    const [searchLoading, setSearchLoading] = useState<boolean>(false);
    const [refreshLoading, setRefreshLoading] = useState<boolean>(false);
    const [actionLoading, setActionLoading] = useState<{ [key: string]: boolean }>({});

    // Pagination state
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    // Modal states
    const [productModalVisible, setProductModalVisible] = useState<boolean>(false);
    const [productModalLoading, setProductModalLoading] = useState<boolean>(false);
    const [priceHistoryModalVisible, setPriceHistoryModalVisible] = useState<boolean>(false);
    const [quantityHistoryModalVisible, setQuantityHistoryModalVisible] = useState<boolean>(false);
    const [editingProduct, setEditingProduct] = useState<ProductType | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
    const [priceHistoryLoading, setPriceHistoryLoading] = useState<boolean>(false);
    const [quantityHistoryLoading, setQuantityHistoryLoading] = useState<boolean>(false);
    const [priceHistory, setPriceHistory] = useState<PriceHistoryType[]>([]);
    const [quantityHistory, setQuantityHistory] = useState<QuantityHistoryType[]>([]);

    // Form
    const [form] = Form.useForm();

    // Search states
    const [searchName, setSearchName] = useState<string>("");
    const [searchSku, setSearchSku] = useState<string>("");
    const [searchCategory, setSearchCategory] = useState<string>("");
    const [searchBrand, setSearchBrand] = useState<string>("");

    // First load state
    const [initialLoad, setInitialLoad] = useState<boolean>(true);

    // Flag to prevent excessive re-renders during pagination changes
    const [isChangingPage, setIsChangingPage] = useState<boolean>(false);

    // Memoize fetchProducts to prevent recreation on each render
    const fetchProducts = useCallback(async (isRetry = false) => {
        if (isRetry) {
            setRefreshLoading(true);
        } else if (!isChangingPage) {
            setLoading(true);
        }
        setError(null);

        try {
            const response = await ProductService.getAllProduct(
                accessToken,
                undefined,
                pagination.current - 1, // API uses 0-based indexing
                pagination.pageSize
            );

            if (response && response.content) {
                setProducts(response.content);
                setPagination(prev => ({
                    ...prev,
                    total: response.total_elements || 0,
                }));
                setInitialLoad(false);
            } else {
                setProducts([]);
                setError("No products found or invalid response format");
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            setProducts([]);
            setError("Failed to fetch products. Please try again.");
        } finally {
            setLoading(false);
            setRefreshLoading(false);
            setIsChangingPage(false);
        }
    }, [accessToken, pagination.current, pagination.pageSize, isChangingPage]);

    // Handle search - memoized
    const handleSearch = useCallback(async () => {
        setSearchLoading(true);
        setError(null);
        try {
            const response = await ProductService.searchProducts(accessToken, {
                name: searchName || undefined,
                sku: searchSku || undefined,
                category: searchCategory || undefined,
                brand: searchBrand || undefined,
                page: pagination.current - 1, // API uses 0-based indexing
                size: pagination.pageSize,
            });

            if (response && response.content) {
                setProducts(response.content);
                setPagination(prev => ({
                    ...prev,
                    total: response.totalElements || 0,
                }));
            } else {
                setProducts([]);
                setError("No products found matching your criteria");
            }
        } catch (error) {
            console.error("Error searching products:", error);
            setProducts([]);
            setError("Failed to search products. Please try again.");
        } finally {
            setSearchLoading(false);
            setIsChangingPage(false);
        }
    }, [accessToken, searchName, searchSku, searchCategory, searchBrand, pagination.current, pagination.pageSize]);

    // Fetch products on component mount and when pagination changes
    useEffect(() => {
        if (isChangingPage) {
            if (searchName || searchSku || searchCategory || searchBrand) {
                handleSearch();
            } else {
                fetchProducts();
            }
        }
    }, [isChangingPage, fetchProducts, handleSearch, searchName, searchSku, searchCategory, searchBrand]);

    // Initial data load
    useEffect(() => {
        if (initialLoad) {
            fetchProducts();
        }
    }, [initialLoad, fetchProducts]);

    // Retry logic: if products.length === 0 && !loading, retry fetchProducts every 10s, max 5 times
    useEffect(() => {
        let retryCount = 0;
        let retryInterval: ReturnType<typeof setInterval> | undefined;

        if (products.length === 0 && !loading && !searchLoading && initialLoad) {
            retryInterval = setInterval(() => {
                if (retryCount < 5) {
                    // Only retry if not loading (avoid overlapping requests)
                    if (!loading && !searchLoading) {
                        fetchProducts(true);
                        retryCount++;
                    }
                } else {
                    setInitialLoad(false);
                    if (retryInterval) clearInterval(retryInterval);
                }
            }, 10000);
        }

        // Clear interval if products loaded or loading starts or component unmounts
        return () => {
            if (retryInterval) clearInterval(retryInterval);
        };
    }, [products.length, loading, searchLoading, initialLoad, fetchProducts]);

    // Reset search
    const resetSearch = () => {
        setSearchName("");
        setSearchSku("");
        setSearchCategory("");
        setSearchBrand("");
        setPagination(prev => ({
            ...prev,
            current: 1,
        }));
        setInitialLoad(true);
    };

    // Handle table pagination change
    const handleTableChange = (page: number, pageSize: number) => {
        setPagination(prev => ({
            ...prev,
            current: page,
            pageSize: pageSize,
        }));
        setIsChangingPage(true);
    };

    // Show modal for adding/editing product
    const showProductModal = (product?: ProductType) => {
        if (product) {
            setEditingProduct(product);
        } else {
            setEditingProduct(null);
        }
        setProductModalVisible(true);
    };

    // Handle product form submission
    const handleProductSubmit = async (values: any) => {
        setProductModalLoading(true);
        console.log("Product submit called with values:", values);

        try {
            if (editingProduct) {
                // Update existing product using unified endpoint
                const updateRequest: ProductUpdateUnifiedRequest = {
                    ...values,
                    operation: "ALL" // Or choose a specific operation if needed
                };

                console.log("Sending update request:", updateRequest);

                const updatedProduct = await ProductService.updateProductUnified(
                    accessToken,
                    editingProduct.productId,
                    updateRequest
                );

                if (updatedProduct) {
                    console.log("Update successful:", updatedProduct);
                    notification.success({message: "Product updated successfully"});
                    fetchProducts();
                } else {
                    console.log("Update failed - no response");
                    notification.error({message: "Failed to update product"});
                }
            } else {
                // Create new product
                console.log("Creating new product:", values);

                const newProduct = await ProductService.createProduct(
                    accessToken,
                    values
                );

                if (newProduct) {
                    console.log("Create successful:", newProduct);
                    notification.success({message: "Product created successfully"});
                    fetchProducts();
                } else {
                    console.log("Create failed - no response");
                    notification.error({message: "Failed to create product"});
                }
            }

            setProductModalVisible(false);
        } catch (error) {
            console.error("Error during product submission:", error);
            notification.error({
                message: "Operation failed",
                description: "Please check the form fields and try again",
            });
        } finally {
            setProductModalLoading(false);
        }
    };

    // Load price history for a product
    const loadPriceHistory = async (productId: string) => {
        setPriceHistoryLoading(true);
        try {
            const history = await ProductService.getPriceHistory(
                accessToken,
                productId
            );
            setPriceHistory(history || []);
        } catch (error) {
            console.error("Error loading price history:", error);
            setPriceHistory([]);
        } finally {
            setPriceHistoryLoading(false);
        }
    };

    // Load quantity history for a product
    const loadQuantityHistory = async (productId: string) => {
        setQuantityHistoryLoading(true);
        try {
            const history = await ProductService.getQuantityHistory(
                accessToken,
                productId
            );
            setQuantityHistory(history || []);
        } catch (error) {
            console.error("Error loading quantity history:", error);
            setQuantityHistory([]);
        } finally {
            setQuantityHistoryLoading(false);
        }
    };

    // Show price history modal
    const showPriceHistoryModal = (product: ProductType) => {
        setSelectedProduct(product);
        setPriceHistoryModalVisible(true);
        loadPriceHistory(product.productId);
    };

    // Show quantity history modal
    const showQuantityHistoryModal = (product: ProductType) => {
        setSelectedProduct(product);
        setQuantityHistoryModalVisible(true);
        loadQuantityHistory(product.productId);
    };

    // Handle product deletion
    const handleDeleteProduct = async (id: string) => {
        setActionLoading({...actionLoading, [id]: true});
        try {
            const result = await ProductService.deleteProduct(accessToken, id);

            if (result) {
                notification.success({message: "Product deleted successfully"});
                fetchProducts();
            } else {
                notification.error({message: "Failed to delete product"});
            }
        } catch (error) {
            console.error("Error deleting product:", error);
            notification.error({
                message: "Delete failed",
                description:
                    "There was an error deleting the product. Please try again.",
            });
        } finally {
            const newActionLoading = {...actionLoading};
            delete newActionLoading[id];
            setActionLoading(newActionLoading);
        }
    };

    // Get category options for the form
    const getCategoryOptions = () => {
        if (!categories || !Array.isArray(categories)) return [];

        const flattenCategories = (
            cats: CategoryType[],
            result: CategoryType[] = []
        ) => {
            cats.forEach((cat) => {
                result.push({id: cat.id, name: cat.name});
                if (
                    cat.children &&
                    Array.isArray(cat.children) &&
                    cat.children.length > 0
                ) {
                    flattenCategories(cat.children, result);
                }
            });
            return result;
        };

        const allCategories = flattenCategories(categories);

        return allCategories.map((cat) => (
            <Option key={cat.id} value={cat.id}>
                {cat.name}
            </Option>
        ));
    };

    // Render skeleton loading for the table
    const renderTableSkeleton = () => {
        return (
            <div>
                <Skeleton active paragraph={{rows: 1}}/>
                {[...Array(5)].map((_, index) => (
                    <div key={index} style={{display: 'flex', marginBottom: 16, padding: 16, backgroundColor: '#fafafa'}}>
                        <div style={{width: 80, marginRight: 16}}>
                            <Skeleton.Image active style={{width: 60, height: 60}}/>
                        </div>
                        <div style={{flex: 1}}>
                            <Skeleton active paragraph={{rows: 1}}/>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <Content
            style={{
                margin: "24px 16px",
                padding: 24,
                background: "#f5f7fa",
                overflow: "auto",
            }}
        >
            {/* Search and Action Bar */}
            <Card style={{marginBottom: 24}}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 16,
                    }}
                >
                    <Title level={4}>Quản Lý Sản Phẩm</Title>
                    <Space>
                        <Button
                            icon={<ReloadOutlined/>}
                            onClick={() => fetchProducts()}
                            loading={refreshLoading}
                            size="large"
                        >
                            Làm Mới
                        </Button>
                        <Button
                            type="primary"
                            size="large"
                            icon={<PlusOutlined/>}
                            onClick={() => showProductModal()}
                        >
                            Thêm Sản Phẩm
                        </Button>
                    </Space>
                </div>

                <Form layout="vertical">
                    <div style={{display: "flex", gap: 16, flexWrap: "wrap"}}>
                        <Form.Item
                            label="Tên Sản Phẩm"
                            style={{flex: 1, minWidth: "200px"}}
                        >
                            <Input
                                placeholder="Nhập tên sản phẩm"
                                value={searchName}
                                onChange={(e) => setSearchName(e.target.value)}
                                prefix={<SearchOutlined/>}
                                disabled={searchLoading}
                            />
                        </Form.Item>
                        <Form.Item label="SKU" style={{flex: 1, minWidth: "200px"}}>
                            <Input
                                placeholder="Nhập mã SKU"
                                value={searchSku}
                                onChange={(e) => setSearchSku(e.target.value)}
                                prefix={<SearchOutlined/>}
                                disabled={searchLoading}
                            />
                        </Form.Item>
                        <Form.Item label="Danh Mục" style={{flex: 1, minWidth: "200px"}}>
                            <Select
                                placeholder="Lọc Theo Danh Mục"
                                value={searchCategory}
                                onChange={setSearchCategory}
                                allowClear
                                style={{width: "100%"}}
                                loading={categoriesLoading}
                                disabled={searchLoading}
                            >
                                {getCategoryOptions()}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Hãng Sản Xuất"
                            style={{flex: 1, minWidth: "200px"}}
                        >
                            <Input
                                placeholder="Nhập tên hãng"
                                value={searchBrand}
                                onChange={(e) => setSearchBrand(e.target.value)}
                                prefix={<SearchOutlined/>}
                                disabled={searchLoading}
                            />
                        </Form.Item>
                    </div>
                    <div style={{display: "flex", justifyContent: "flex-end", gap: 16}}>
                        <Button onClick={resetSearch} disabled={searchLoading || loading}>
                            Đặt Lại
                        </Button>
                        <Button
                            type="primary"
                            onClick={handleSearch}
                            icon={<SearchOutlined/>}
                            loading={searchLoading}
                            disabled={loading}
                        >
                            Tìm Kiếm
                        </Button>
                    </div>
                </Form>
            </Card>

            {/* Products Table */}
            <Card>
                {loading && !refreshLoading && !isChangingPage ? renderTableSkeleton() : error ? (
                    <Alert message="Lỗi" description={error} type="error" showIcon/>
                ) : (
                    <ProductManagementTable
                        productList={products}
                        onEdit={showProductModal}
                        onPriceHistory={showPriceHistoryModal}
                        onQuantityHistory={showQuantityHistoryModal}
                        onDelete={handleDeleteProduct}
                        pagination={{
                            current: pagination.current,
                            pageSize: pagination.pageSize,
                            total: pagination.total,
                            showSizeChanger: true,
                            pageSizeOptions: ["10", "20", "50", "100"],
                            showTotal: (total) => `Tổng ${total} sản phẩm`,
                            onChange: handleTableChange,
                        }}
                        loading={refreshLoading || isChangingPage}
                        actionLoading={actionLoading}
                    />
                )}
            </Card>

            {/* Add/Edit Product Modal */}
            <ProductActionModal
                visible={productModalVisible}
                onCancel={() => setProductModalVisible(false)}
                onSubmit={handleProductSubmit}
                product={editingProduct}
                categories={categories || []}
                categoriesLoading={categoriesLoading}
                loading={productModalLoading}
            />

            {/* Price History Modal */}
            <PriceHistoryModal
                visible={priceHistoryModalVisible}
                onClose={() => setPriceHistoryModalVisible(false)}
                product={selectedProduct}
                priceHistory={priceHistory}
                loading={priceHistoryLoading}
            />

            {/* Quantity History Modal */}
            <QuantityHistoryModal
                visible={quantityHistoryModalVisible}
                onClose={() => setQuantityHistoryModalVisible(false)}
                product={selectedProduct}
                quantityHistory={quantityHistory}
                loading={quantityHistoryLoading}
            />
        </Content>
    );
};

export default ProductManagementComponent;
