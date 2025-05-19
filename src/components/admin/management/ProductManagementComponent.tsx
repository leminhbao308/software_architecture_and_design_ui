import React, {useEffect, useState} from "react";
import {
    Alert,
    Badge,
    Button,
    Card,
    Empty,
    Form,
    Input,
    InputNumber,
    Layout,
    Modal,
    notification,
    Popconfirm,
    Select,
    Space,
    Spin,
    Table,
    Tabs,
    Tag,
    Typography,
    Upload
} from "antd";
import {DeleteOutlined, DollarOutlined, EditOutlined, InboxOutlined, PlusOutlined, SearchOutlined} from "@ant-design/icons";
import useCategoryContext from "../../../hooks/useCategoryContext";
import ProductService from "../../../services/product/ProductService";
import {getAccessToken} from "../../../utils/tokenUtils";

const {Content} = Layout;
const {Option} = Select;
const {Title, Text} = Typography;
const {TabPane} = Tabs;
const {TextArea} = Input;

// Define product interface based on the API structure
interface PriceHistory {
    oldPrice: number;
    newPrice: number;
    changeReason: string;
    changedBy: string;
    timestamp: string;
}

interface QuantityHistory {
    oldQuantity: number;
    newQuantity: number;
    changeReason: string;
    changedBy: string;
    timestamp: string;
}

interface ProductType {
    id: string; //
    name: string; //
    description: string; //
    sku: string; //
    brand: string; //
    currentPrice: number; //
    originalPrice: number; // basePrice
    discountPercentage: number; // x
    currentQuantity: number; // x
    mainCategory: string; //
    categories: string[]; // additionalCategories
    status: "ACTIVE" | "INACTIVE" | "OUT_OF_STOCK" | "DISCONTINUED"; //
    imageUrls: string[];
    attributes: Record<string, any>;
    priceHistory: PriceHistory[];
    quantityHistory: QuantityHistory[];
}

const ProductManagementComponent: React.FC = () => {
    // Access token
    const accessToken = getAccessToken();

    // Get categories from context
    const {categories, loading: categoriesLoading} = useCategoryContext();

    // State for products
    const [products, setProducts] = useState<ProductType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Pagination state
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    // Modal states
    const [productModalVisible, setProductModalVisible] = useState<boolean>(false);
    const [priceHistoryModalVisible, setPriceHistoryModalVisible] = useState<boolean>(false);
    const [quantityHistoryModalVisible, setQuantityHistoryModalVisible] = useState<boolean>(false);
    const [editingProduct, setEditingProduct] = useState<ProductType | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);

    // Form
    const [form] = Form.useForm();

    // Search states
    const [searchName, setSearchName] = useState<string>("");
    const [searchSku, setSearchSku] = useState<string>("");
    const [searchCategory, setSearchCategory] = useState<string>("");
    const [searchBrand, setSearchBrand] = useState<string>("");

    // Fetch products on component mount
    useEffect(() => {
        fetchProducts();
    }, [pagination.current, pagination.pageSize]);

    // Fetch products from the API
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await ProductService.getAllProduct(
                accessToken,
                undefined,
                pagination.current,
                pagination.pageSize
            );

            if (response && response.content) {
                setProducts(response.content);
                setPagination({
                    ...pagination,
                    total: response.totalElements
                });
            } else {
                setProducts([]);
                setError("No products found or invalid response format");
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            setError("Failed to fetch products. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Handle search
    const handleSearch = async () => {
        setLoading(true);
        try {
            const response = await ProductService.searchProducts(accessToken, {
                name: searchName || undefined,
                sku: searchSku || undefined,
                category: searchCategory || undefined,
                brand: searchBrand || undefined,
                page: pagination.current,
                size: pagination.pageSize
            });

            if (response && response.data && response.data.content) {
                setProducts(response.data.content);
                setPagination({
                    ...pagination,
                    total: response.data.totalElements || 0
                });
            } else {
                setProducts([]);
                setError("No products found matching your criteria");
            }
        } catch (error) {
            console.error("Error searching products:", error);
            setError("Failed to search products. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Reset search
    const resetSearch = () => {
        setSearchName("");
        setSearchSku("");
        setSearchCategory("");
        setSearchBrand("");
        fetchProducts();
    };

    // Handle table pagination change
    const handleTableChange = (pagination: any) => {
        setPagination({
            ...pagination,
            current: pagination.current,
            pageSize: pagination.pageSize
        });
    };

    // Show modal for adding/editing product
    const showProductModal = (product?: ProductType) => {
        if (product) {
            setEditingProduct(product);

            // Format the form values
            form.setFieldsValue({
                name: product.name,
                description: product.description,
                sku: product.sku,
                brand: product.brand,
                currentPrice: product.currentPrice,
                originalPrice: product.originalPrice,
                currentQuantity: product.currentQuantity,
                mainCategory: product.mainCategory,
                categories: product.categories,
                status: product.status,
                attributes: product.attributes ? JSON.stringify(product.attributes) : ''
            });
        } else {
            setEditingProduct(null);
            form.resetFields();
        }
        setProductModalVisible(true);
    };

    // Handle product form submission
    const handleProductSubmit = async () => {
        try {
            const values = await form.validateFields();

            // Process attributes if provided
            if (values.attributes) {
                try {
                    values.attributes = JSON.parse(values.attributes);
                } catch (err) {
                    notification.error({
                        message: "Invalid attributes format",
                        description: "Please enter valid JSON format for attributes"
                    });
                    return;
                }
            }

            // TODO: Implement create/update product API call
            // This is a placeholder to demonstrate how it would work
            if (editingProduct) {
                // Update existing product
                // const updatedProduct = await ProductService.updateProduct(accessToken, editingProduct.id, values);
                notification.success({message: "Product updated successfully"});
            } else {
                // Create new product
                // const newProduct = await ProductService.createProduct(accessToken, values);
                notification.success({message: "Product created successfully"});
            }

            // Refresh products
            fetchProducts();
            setProductModalVisible(false);
            form.resetFields();
        } catch (error) {
            notification.error({
                message: "Operation failed",
                description: "There was an error processing your request. Please try again."
            });
            console.error("Error in form submission:", error);
        }
    };

    // Show price history modal
    const showPriceHistoryModal = (product: ProductType) => {
        setSelectedProduct(product);
        setPriceHistoryModalVisible(true);
    };

    // Show quantity history modal
    const showQuantityHistoryModal = (product: ProductType) => {
        setSelectedProduct(product);
        setQuantityHistoryModalVisible(true);
    };

    // Handle product deletion
    const handleDeleteProduct = async (id: string) => {
        try {
            // TODO: Implement delete product API call
            // await ProductService.deleteProduct(accessToken, id);
            notification.success({message: "Product deleted successfully"});
            fetchProducts();
        } catch (error) {
            notification.error({
                message: "Delete failed",
                description: "There was an error deleting the product. Please try again."
            });
            console.error("Error deleting product:", error);
        }
    };

    // Get category options for the form
    const getCategoryOptions = () => {
        if (!categories || !Array.isArray(categories)) return [];

        const flattenCategories = (cats: any[], result: any[] = []) => {
            cats.forEach(cat => {
                result.push({id: cat.id, name: cat.name});
                if (cat.children && Array.isArray(cat.children) && cat.children.length > 0) {
                    flattenCategories(cat.children, result);
                }
            });
            return result;
        };

        const allCategories = flattenCategories(categories);

        return allCategories.map(cat => (
            <Option key={cat.id} value={cat.id}>{cat.name}</Option>
        ));
    };

    // Define table columns
    const columns = [
        {
            title: 'Image',
            key: 'image',
            width: 80,
            render: (_: any, record: ProductType) => (
                <div style={{width: 60, height: 60, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    {record.imageUrls && record.imageUrls.length > 0 ? (
                        <img
                            src={record.imageUrls[0]}
                            alt={record.name}
                            style={{maxWidth: '100%', maxHeight: '100%', objectFit: 'contain'}}
                        />
                    ) : (
                        <div style={{color: '#ccc', fontSize: 24}}>
                            <InboxOutlined/>
                        </div>
                    )}
                </div>
            ),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: ProductType) => (
                <div>
                    <div style={{fontWeight: 'bold'}}>{text}</div>
                    <div style={{fontSize: 12, color: '#999'}}>SKU: {record.sku}</div>
                </div>
            ),
        },
        {
            title: 'Brand',
            dataIndex: 'brand',
            key: 'brand',
        },
        {
            title: 'Price',
            key: 'price',
            render: (_: any, record: ProductType) => (
                <div>
                    <div style={{fontWeight: 'bold'}}>${record.currentPrice}</div>
                    {record.originalPrice > record.currentPrice && (
                        <div style={{textDecoration: 'line-through', color: '#999', fontSize: 12}}>
                            ${record.originalPrice}
                        </div>
                    )}
                </div>
            ),
        },
        {
            title: 'Quantity',
            dataIndex: 'currentQuantity',
            key: 'currentQuantity',
            render: (quantity: number) => (
                <Badge
                    count={quantity}
                    showZero
                    style={{
                        backgroundColor: quantity > 10 ? '#52c41a' : quantity > 0 ? '#faad14' : '#f5222d',
                    }}
                />
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                let color = 'default';
                switch (status) {
                    case 'ACTIVE':
                        color = 'green';
                        break;
                    case 'INACTIVE':
                        color = 'gray';
                        break;
                    case 'OUT_OF_STOCK':
                        color = 'red';
                        break;
                    case 'DISCONTINUED':
                        color = 'purple';
                        break;
                }
                return <Tag color={color}>{status}</Tag>;
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 320,
            render: (_: any, record: ProductType) => (
                <Space>
                    <Button
                        icon={<EditOutlined/>}
                        onClick={() => showProductModal(record)}
                    >
                        Edit
                    </Button>
                    <Button
                        icon={<DollarOutlined/>}
                        onClick={() => showPriceHistoryModal(record)}
                    >
                        Price
                    </Button>
                    <Button
                        icon={<InboxOutlined/>}
                        onClick={() => showQuantityHistoryModal(record)}
                    >
                        Inventory
                    </Button>
                    <Popconfirm
                        title="Are you sure you want to delete this product?"
                        onConfirm={() => handleDeleteProduct(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button danger icon={<DeleteOutlined/>}/>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Content style={{margin: '24px 16px', padding: 24, background: '#f5f7fa', overflow: 'auto'}}>
            {/* Search and Action Bar */}
            <Card style={{marginBottom: 24}}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 16}}>
                    <Title level={4}>Product Management</Title>
                    <Button
                        type="primary"
                        size="large"
                        icon={<PlusOutlined/>}
                        onClick={() => showProductModal()}
                    >
                        Add Product
                    </Button>
                </div>

                <Form layout="vertical">
                    <div style={{display: 'flex', gap: 16, flexWrap: 'wrap'}}>
                        <Form.Item label="Product Name" style={{flex: 1, minWidth: '200px'}}>
                            <Input
                                placeholder="Search by name"
                                value={searchName}
                                onChange={(e) => setSearchName(e.target.value)}
                                prefix={<SearchOutlined/>}
                            />
                        </Form.Item>
                        <Form.Item label="SKU" style={{flex: 1, minWidth: '200px'}}>
                            <Input
                                placeholder="Search by SKU"
                                value={searchSku}
                                onChange={(e) => setSearchSku(e.target.value)}
                                prefix={<SearchOutlined/>}
                            />
                        </Form.Item>
                        <Form.Item label="Category" style={{flex: 1, minWidth: '200px'}}>
                            <Select
                                placeholder="Filter by category"
                                value={searchCategory}
                                onChange={setSearchCategory}
                                allowClear
                                style={{width: '100%'}}
                            >
                                {getCategoryOptions()}
                            </Select>
                        </Form.Item>
                        <Form.Item label="Brand" style={{flex: 1, minWidth: '200px'}}>
                            <Input
                                placeholder="Search by brand"
                                value={searchBrand}
                                onChange={(e) => setSearchBrand(e.target.value)}
                                prefix={<SearchOutlined/>}
                            />
                        </Form.Item>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'flex-end', gap: 16}}>
                        <Button onClick={resetSearch}>Reset</Button>
                        <Button type="primary" onClick={handleSearch} icon={<SearchOutlined/>}>
                            Search
                        </Button>
                    </div>
                </Form>
            </Card>

            {/* Products Table */}
            {loading ? (
                <div style={{textAlign: 'center', padding: '50px 0'}}>
                    <Spin size="large"/>
                </div>
            ) : error ? (
                <Alert
                    message="Error"
                    description={`Failed to load products: ${error}`}
                    type="error"
                    showIcon
                />
            ) : (
                <Card>
                    <Table
                        columns={columns}
                        dataSource={products}
                        rowKey="id"
                        pagination={{
                            current: pagination.current,
                            pageSize: pagination.pageSize,
                            total: pagination.total,
                            showSizeChanger: true,
                            pageSizeOptions: ['10', '20', '50', '100'],
                            showTotal: (total) => `Total ${total} items`
                        }}
                        onChange={handleTableChange}
                        locale={{
                            emptyText: (
                                <Empty
                                    description="No products found"
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                />
                            )
                        }}
                    />
                </Card>
            )}

            {/* Add/Edit Product Modal */}
            <Modal
                title={editingProduct ? "Edit Product" : "Add Product"}
                open={productModalVisible}
                onCancel={() => setProductModalVisible(false)}
                onOk={handleProductSubmit}
                width={800}
                maskClosable={false}
                footer={[
                    <Button key="cancel" onClick={() => setProductModalVisible(false)}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleProductSubmit}>
                        {editingProduct ? "Update Product" : "Create Product"}
                    </Button>
                ]}
            >
                <Form
                    form={form}
                    layout="vertical"
                >
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="Basic Information" key="1">
                            <div style={{display: 'flex', gap: 16}}>
                                <Form.Item
                                    name="name"
                                    label="Product Name"
                                    rules={[{required: true, message: 'Please enter product name'}]}
                                    style={{flex: 2}}
                                >
                                    <Input placeholder="Enter product name"/>
                                </Form.Item>

                                <Form.Item
                                    name="sku"
                                    label="SKU"
                                    rules={[{required: true, message: 'Please enter SKU'}]}
                                    style={{flex: 1}}
                                >
                                    <Input placeholder="Enter SKU"/>
                                </Form.Item>
                            </div>

                            <Form.Item
                                name="description"
                                label="Description"
                            >
                                <TextArea rows={4} placeholder="Enter product description"/>
                            </Form.Item>

                            <div style={{display: 'flex', gap: 16}}>
                                <Form.Item
                                    name="brand"
                                    label="Brand"
                                    style={{flex: 1}}
                                >
                                    <Input placeholder="Enter brand name"/>
                                </Form.Item>

                                <Form.Item
                                    name="status"
                                    label="Status"
                                    rules={[{required: true, message: 'Please select status'}]}
                                    style={{flex: 1}}
                                >
                                    <Select placeholder="Select status">
                                        <Option value="ACTIVE">Active</Option>
                                        <Option value="INACTIVE">Inactive</Option>
                                        <Option value="OUT_OF_STOCK">Out of Stock</Option>
                                        <Option value="DISCONTINUED">Discontinued</Option>
                                    </Select>
                                </Form.Item>
                            </div>
                        </TabPane>

                        <TabPane tab="Price & Inventory" key="2">
                            <div style={{display: 'flex', gap: 16}}>
                                <Form.Item
                                    name="currentPrice"
                                    label="Current Price"
                                    rules={[{required: true, message: 'Please enter current price'}]}
                                    style={{flex: 1}}
                                >
                                    <InputNumber
                                        min={0}
                                        style={{width: '100%'}}
                                        formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="originalPrice"
                                    label="Original Price"
                                    style={{flex: 1}}
                                >
                                    <InputNumber
                                        min={0}
                                        style={{width: '100%'}}
                                        formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                                    />
                                </Form.Item>
                            </div>

                            <Form.Item
                                name="currentQuantity"
                                label="Current Quantity"
                                rules={[{required: true, message: 'Please enter current quantity'}]}
                            >
                                <InputNumber min={0} style={{width: '100%'}}/>
                            </Form.Item>
                        </TabPane>

                        <TabPane tab="Categories" key="3">
                            <Form.Item
                                name="mainCategory"
                                label="Main Category"
                                rules={[{required: true, message: 'Please select main category'}]}
                            >
                                <Select
                                    showSearch
                                    placeholder="Select main category"
                                    optionFilterProp="children"
                                    loading={categoriesLoading}
                                >
                                    {getCategoryOptions()}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="categories"
                                label="Additional Categories"
                            >
                                <Select
                                    mode="multiple"
                                    showSearch
                                    placeholder="Select additional categories"
                                    optionFilterProp="children"
                                    loading={categoriesLoading}
                                >
                                    {getCategoryOptions()}
                                </Select>
                            </Form.Item>
                        </TabPane>

                        <TabPane tab="Attributes" key="4">
                            <Form.Item
                                name="attributes"
                                label="Additional Attributes (JSON Format)"
                            >
                                <TextArea
                                    rows={6}
                                    placeholder={'Enter additional attributes in JSON format: {"color": "red", "size": "M", "material": "cotton"}'}
                                />
                            </Form.Item>
                        </TabPane>

                        <TabPane tab="Images" key="5">
                            <Alert
                                message="Images Upload"
                                description="Image upload functionality will be implemented in the next version."
                                type="info"
                                showIcon
                                style={{marginBottom: 16}}
                            />
                            <Upload
                                listType="picture-card"
                                fileList={[]}
                                beforeUpload={() => false}
                            >
                                <div>
                                    <PlusOutlined/>
                                    <div style={{marginTop: 8}}>Upload</div>
                                </div>
                            </Upload>
                        </TabPane>
                    </Tabs>
                </Form>
            </Modal>

            {/* Price History Modal */}
            <Modal
                title={`Price History - ${selectedProduct?.name}`}
                open={priceHistoryModalVisible}
                onCancel={() => setPriceHistoryModalVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setPriceHistoryModalVisible(false)}>
                        Close
                    </Button>
                ]}
                width={700}
            >
                {selectedProduct && (
                    <div>
                        <div style={{marginBottom: 16}}>
                            <Text strong>Current Price: </Text>
                            <Text>${selectedProduct.currentPrice}</Text>
                        </div>

                        {selectedProduct.priceHistory && selectedProduct.priceHistory.length > 0 ? (
                            <Table
                                dataSource={selectedProduct.priceHistory}
                                rowKey={(record) => `${record.timestamp}`}
                                pagination={false}
                                columns={[
                                    {
                                        title: 'Date',
                                        dataIndex: 'timestamp',
                                        key: 'timestamp',
                                        render: (timestamp: string) => new Date(timestamp).toLocaleString()
                                    },
                                    {
                                        title: 'Old Price',
                                        dataIndex: 'oldPrice',
                                        key: 'oldPrice',
                                        render: (price: number) => `$${price}`
                                    },
                                    {
                                        title: 'New Price',
                                        dataIndex: 'newPrice',
                                        key: 'newPrice',
                                        render: (price: number) => `$${price}`
                                    },
                                    {
                                        title: 'Reason',
                                        dataIndex: 'changeReason',
                                        key: 'changeReason'
                                    },
                                    {
                                        title: 'Changed By',
                                        dataIndex: 'changedBy',
                                        key: 'changedBy'
                                    }
                                ]}
                            />
                        ) : (
                            <Empty description="No price history available"/>
                        )}
                    </div>
                )}
            </Modal>

            {/* Quantity History Modal */}
            <Modal
                title={`Inventory History - ${selectedProduct?.name}`}
                open={quantityHistoryModalVisible}
                onCancel={() => setQuantityHistoryModalVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setQuantityHistoryModalVisible(false)}>
                        Close
                    </Button>
                ]}
                width={700}
            >
                {selectedProduct && (
                    <div>
                        <div style={{marginBottom: 16}}>
                            <Text strong>Current Quantity: </Text>
                            <Text>{selectedProduct.currentQuantity}</Text>
                        </div>

                        {selectedProduct.quantityHistory && selectedProduct.quantityHistory.length > 0 ? (
                            <Table
                                dataSource={selectedProduct.quantityHistory}
                                rowKey={(record) => `${record.timestamp}`}
                                pagination={false}
                                columns={[
                                    {
                                        title: 'Date',
                                        dataIndex: 'timestamp',
                                        key: 'timestamp',
                                        render: (timestamp: string) => new Date(timestamp).toLocaleString()
                                    },
                                    {
                                        title: 'Old Quantity',
                                        dataIndex: 'oldQuantity',
                                        key: 'oldQuantity'
                                    },
                                    {
                                        title: 'New Quantity',
                                        dataIndex: 'newQuantity',
                                        key: 'newQuantity'
                                    },
                                    {
                                        title: 'Reason',
                                        dataIndex: 'changeReason',
                                        key: 'changeReason'
                                    },
                                    {
                                        title: 'Changed By',
                                        dataIndex: 'changedBy',
                                        key: 'changedBy'
                                    }
                                ]}
                            />
                        ) : (
                            <Empty description="No quantity history available"/>
                        )}
                    </div>
                )}
            </Modal>
        </Content>
    );
};

export default ProductManagementComponent;
