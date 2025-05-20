import React, { useEffect, useState } from "react";
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
  Upload,
} from "antd";
import {
  DeleteOutlined,
  DollarOutlined,
  EditOutlined,
  InboxOutlined,
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import useCategoryContext from "../../../hooks/useCategoryContext";
import ProductService from "../../../services/product/ProductService";
import { getAccessToken } from "../../../utils/tokenUtils";
import {
  PriceHistoryType,
  ProductType,
  QuantityHistoryType,
} from "../../../types/ProductType.ts";
import { CategoryType } from "../../../types/category/CategoryType.ts";

const { Content } = Layout;
const { Option } = Select;
const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

const ProductManagementComponent: React.FC = () => {
  // Access token
  const accessToken = getAccessToken();

  // Get categories from context
  const { categories, loading: categoriesLoading } = useCategoryContext();

  // State for products
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Modal states
  const [productModalVisible, setProductModalVisible] =
    useState<boolean>(false);
  const [priceHistoryModalVisible, setPriceHistoryModalVisible] =
    useState<boolean>(false);
  const [quantityHistoryModalVisible, setQuantityHistoryModalVisible] =
    useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<ProductType | null>(
    null
  );
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(
    null
  );
  const [priceHistoryLoading, setPriceHistoryLoading] =
    useState<boolean>(false);
  const [quantityHistoryLoading, setQuantityHistoryLoading] =
    useState<boolean>(false);
  const [priceHistory, setPriceHistory] = useState<PriceHistoryType[]>([]);
  const [quantityHistory, setQuantityHistory] = useState<QuantityHistoryType[]>(
    []
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Form
  const [form] = Form.useForm();

  // Search states
  const [searchName, setSearchName] = useState<string>("");
  const [searchSku, setSearchSku] = useState<string>("");
  const [searchCategory, setSearchCategory] = useState<string>("");
  const [searchBrand, setSearchBrand] = useState<string>("");

  // Fetch products on component mount and when pagination changes
  useEffect(() => {
    fetchProducts();
  }, [pagination.current, pagination.pageSize]);

  // Fetch products from the API
  const fetchProducts = async () => {
    setLoading(true);
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
        setPagination({
          ...pagination,
          total: response.total_elements || 0,
        });
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
    }
  };

  // Handle search
  const handleSearch = async () => {
    setLoading(true);
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
        setPagination({
          ...pagination,
          total: response.totalElements || 0,
        });
      } else {
        setProducts([]);
        setError("No products found matching your criteria");
      }
    } catch (error) {
      console.error("Error searching products:", error);
      setProducts([]);
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
    setPagination({
      ...pagination,
      current: 1,
    });
    fetchProducts();
  };

  // Handle table pagination change
  const handleTableChange = (newPagination: any) => {
    setPagination({
      ...pagination,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    });
  };

  // Show modal for adding/editing product
  const showProductModal = (product?: ProductType) => {
    if (product) {
      setEditingProduct(product);

      // Format the form values to match the product structure
      form.setFieldsValue({
        name: product.name,
        description: product.description,
        sku: product.sku,
        brand: product.brand,
        basePrice: product.basePrice,
        currentPrice: product.currentPrice,
        costPrice: product.costPrice,
        mainCategoryId: product.mainCategoryId,
        additionalCategories: product.additionalCategories || [],
        status: product.status,
        availableQuantity: product.availableQuantity,
        reservedQuantity: product.reservedQuantity || 0,
        totalQuantity: product.totalQuantity,
        additionalAttributes: product.additionalAttributes
          ? JSON.stringify(product.additionalAttributes)
          : "",
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
      if (values.additionalAttributes) {
        try {
          values.additionalAttributes = JSON.parse(values.additionalAttributes);
        } catch (err) {
          notification.error({
            message: "Invalid attributes format",
            description: "Please enter valid JSON format for attributes",
          });
          return;
        }
      }

      if (editingProduct) {
        // Update existing product
        const updatedProduct = await ProductService.updateProduct(
          accessToken,
          editingProduct.productId,
          {
            ...editingProduct,
            ...values,
          }
        );

        if (updatedProduct) {
          notification.success({ message: "Product updated successfully" });
          fetchProducts();
        } else {
          notification.error({ message: "Failed to update product" });
        }
      } else {
        // Create new product
        const newProduct = await ProductService.createProduct(
          accessToken,
          values
        );

        if (newProduct) {
          notification.success({ message: "Product created successfully" });
          fetchProducts();
        } else {
          notification.error({ message: "Failed to create product" });
        }
      }

      setProductModalVisible(false);
      form.resetFields();
    } catch (error) {
      notification.error({
        message: "Form validation failed",
        description: "Please check the form fields and try again",
      });
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

  // Update product price
  const updateProductPrice = async (
    productId: string,
    newPrice: number,
    reason: string
  ) => {
    try {
      const result = await ProductService.updateProductPrice(
        accessToken,
        productId,
        {
          newPrice,
          reason,
          changedBy: "Admin", // This could be dynamic based on the logged-in user
        }
      );

      if (result) {
        notification.success({ message: "Price updated successfully" });
        fetchProducts();
        if (selectedProduct && selectedProduct.productId === productId) {
          loadPriceHistory(productId);
        }
        return true;
      } else {
        notification.error({ message: "Failed to update price" });
        return false;
      }
    } catch (error) {
      console.error("Error updating price:", error);
      notification.error({
        message: "An error occurred while updating the price",
      });
      return false;
    }
  };

  // Update product quantity
  const updateProductQuantity = async (
    productId: string,
    newQuantity: number,
    reason: string
  ) => {
    try {
      const result = await ProductService.updateProductInventory(
        accessToken,
        productId,
        {
          newQuantity,
          reason,
          changedBy: "Admin", // This could be dynamic based on the logged-in user
        }
      );

      if (result) {
        notification.success({ message: "Inventory updated successfully" });
        fetchProducts();
        if (selectedProduct && selectedProduct.productId === productId) {
          loadQuantityHistory(productId);
        }
        return true;
      } else {
        notification.error({ message: "Failed to update inventory" });
        return false;
      }
    } catch (error) {
      console.error("Error updating inventory:", error);
      notification.error({
        message: "An error occurred while updating the inventory",
      });
      return false;
    }
  };

  // Handle product deletion
  const handleDeleteProduct = async (id: string) => {
    try {
      const result = await ProductService.deleteProduct(accessToken, id);

      if (result) {
        notification.success({ message: "Product deleted successfully" });
        fetchProducts();
      } else {
        notification.error({ message: "Failed to delete product" });
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      notification.error({
        message: "Delete failed",
        description:
          "There was an error deleting the product. Please try again.",
      });
    }
  };

  // Change product status
  const updateProductStatus = async (productId: string, status: string) => {
    try {
      const result = await ProductService.updateProductStatus(
        accessToken,
        productId,
        status
      );

      if (result) {
        notification.success({
          message: `Product status changed to ${status}`,
        });
        fetchProducts();
        return true;
      } else {
        notification.error({ message: "Failed to update product status" });
        return false;
      }
    } catch (error) {
      console.error("Error updating product status:", error);
      notification.error({
        message: "An error occurred while updating the status",
      });
      return false;
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
        result.push({ id: cat.id, name: cat.name });
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

  // Define table columns
  const columns = [
    {
      title: "Ảnh",
      key: "image",
      width: 80,
      render: (_: never, record: ProductType) => (
        <div
          style={{
            width: 60,
            height: 60,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {record.imageUrls && record.imageUrls.length > 0 ? (
            <img
              src={record.imageUrls[0]}
              alt={record.name}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
            />
          ) : record.thumbnailUrl ? (
            <img
              src={record.thumbnailUrl}
              alt={record.name}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
            />
          ) : (
            <div style={{ color: "#ccc", fontSize: 24 }}>
              <InboxOutlined />
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: ProductType) => (
        <div>
          <div style={{ fontWeight: "bold" }}>{text}</div>
          <div style={{ fontSize: 12, color: "#999" }}>SKU: {record.sku}</div>
        </div>
      ),
    },
    {
      title: "Hãng",
      dataIndex: "brand",
      key: "brand",
    },
    {
      title: "Giá",
      key: "price",
      render: (_: never, record: ProductType) => (
        <div>
          <div style={{ fontWeight: "bold" }}>
            {formatPrice(record.basePrice)}
          </div>
          {record.basePrice > record.currentPrice && (
            <div
              style={{
                textDecoration: "line-through",
                color: "#999",
                fontSize: 12,
              }}
            >
              {formatPrice(record.basePrice)}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Số Lượng",
      key: "quantity",
      render: (_: never, record: ProductType) => (
        <div>
          <Badge
            count={record.availableQuantity}
            showZero
            style={{
              backgroundColor:
                record.availableQuantity > 10
                  ? "#52c41a"
                  : record.availableQuantity > 0
                  ? "#faad14"
                  : "#f5222d",
            }}
          />
          {record.reservedQuantity > 0 && (
            <div style={{ fontSize: 12, color: "#999", marginTop: 4 }}>
              Reserved: {record.reservedQuantity}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color = "default";
        switch (status) {
          case "ACTIVE":
            color = "green";
            break;
          case "INACTIVE":
            color = "gray";
            break;
          case "OUT_OF_STOCK":
            color = "red";
            break;
          case "DISCONTINUED":
            color = "purple";
            break;
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Hành Động",
      key: "actions",
      width: 330,
      render: (_: never, record: ProductType) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => showProductModal(record)}
          >
            Sửa
          </Button>
          <Button
            icon={<DollarOutlined />}
            onClick={() => showPriceHistoryModal(record)}
          >
            Giá
          </Button>
          <Button
            icon={<InboxOutlined />}
            onClick={() => showQuantityHistoryModal(record)}
          >
            Tồn Kho
          </Button>
          <Popconfirm
            title="Bạn có muốn xóa sản phẩm này?"
            onConfirm={() => handleDeleteProduct(record.productId)}
            okText="Xóa"
            cancelText="Không"
            placement={"topLeft"}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

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
      <Card style={{ marginBottom: 24 }}>
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
              icon={<ReloadOutlined />}
              onClick={fetchProducts}
              loading={loading}
              size="large"
            >
              Làm Mới
            </Button>
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={() => showProductModal()}
            >
              Thêm Sản Phẩm
            </Button>
          </Space>
        </div>

        <Form layout="vertical">
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <Form.Item
              label="Tên Sản Phẩm"
              style={{ flex: 1, minWidth: "200px" }}
            >
              <Input
                placeholder="Nhập tên sản phẩm"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                prefix={<SearchOutlined />}
              />
            </Form.Item>
            <Form.Item label="SKU" style={{ flex: 1, minWidth: "200px" }}>
              <Input
                placeholder="Nhập mã SKU"
                value={searchSku}
                onChange={(e) => setSearchSku(e.target.value)}
                prefix={<SearchOutlined />}
              />
            </Form.Item>
            <Form.Item label="Danh Mục" style={{ flex: 1, minWidth: "200px" }}>
              <Select
                placeholder="Lọc Theo Danh Mục"
                value={searchCategory}
                onChange={setSearchCategory}
                allowClear
                style={{ width: "100%" }}
                loading={categoriesLoading}
              >
                {getCategoryOptions()}
              </Select>
            </Form.Item>
            <Form.Item
              label="Hãng Sản Xuất"
              style={{ flex: 1, minWidth: "200px" }}
            >
              <Input
                placeholder="Nhập tên hãng"
                value={searchBrand}
                onChange={(e) => setSearchBrand(e.target.value)}
                prefix={<SearchOutlined />}
              />
            </Form.Item>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 16 }}>
            <Button onClick={resetSearch}>Đặt Lại</Button>
            <Button
              type="primary"
              onClick={handleSearch}
              icon={<SearchOutlined />}
              loading={loading}
            >
              Tìm Kiếm
            </Button>
          </div>
        </Form>
      </Card>

      {/* Products Table */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "50px 0" }}>
          <Spin size="large" />
        </div>
      ) : error ? (
        <Alert message="Lỗi" description={error} type="error" showIcon />
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
              pageSizeOptions: ["10", "20", "50", "100"],
              showTotal: (total) => `Tổng ${total} sản phẩm`,
            }}
            onChange={handleTableChange}
            locale={{
              emptyText: (
                <Empty
                  description="Không tìm thấy sản phẩm"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ),
            }}
          />
        </Card>
      )}

      {/* Add/Edit Product Modal */}
      <Modal
        title={editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm"}
        open={productModalVisible}
        onCancel={() => setProductModalVisible(false)}
        width={800}
        maskClosable={false}
        footer={[
          <Button key="cancel" onClick={() => setProductModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleProductSubmit}>
            {editingProduct ? "Cập nhật" : "Thêm mới"}
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Tabs defaultActiveKey="1">
            <TabPane tab="Thông Tin Chung" key="1">
              <div style={{ display: "flex", gap: 16 }}>
                <Form.Item
                  name="name"
                  label="Tên Sản Phẩm"
                  rules={[
                    { required: true, message: "Vui lòng nhập tên sản phẩm" },
                  ]}
                  style={{ flex: 2 }}
                >
                  <Input placeholder="Nhập tên sản phẩm" />
                </Form.Item>

                <Form.Item
                  name="sku"
                  label="SKU"
                  rules={[{ required: true, message: "Vui lòng nhập mã SKU" }]}
                  style={{ flex: 1 }}
                  required={!!editingProduct}
                >
                  <Input
                    disabled={!!editingProduct}
                    placeholder="Nhập mã SKU"
                  />
                </Form.Item>
              </div>

              <Form.Item name="description" label="Mô Tả">
                <TextArea
                  count={{ max: 1024, show: true }}
                  maxLength={1024}
                  rows={4}
                  placeholder="Nhập mô tả sản phẩm"
                />
              </Form.Item>

              <div style={{ display: "flex", gap: 16 }}>
                <Form.Item
                  name="brand"
                  label="Hãng Sản Xuất"
                  style={{ flex: 1 }}
                >
                  <Input placeholder="Nhập tên hãng sản xuất" />
                </Form.Item>

                <Form.Item
                  name="status"
                  label="Trạng Thái Sản Phẩm"
                  rules={[
                    { required: true, message: "Chọn trạng thái sản phẩm" },
                  ]}
                  style={{ flex: 1 }}
                >
                  <Select placeholder="Select status">
                    <Option value="ACTIVE">Đang bán (ACTIVE)</Option>
                    <Option value="INACTIVE">Tạm dừng bán (INACTIVE)</Option>
                    <Option value="OUT_OF_STOCK">
                      Đang hết hàng (OUT OF STOCK)
                    </Option>
                    <Option value="DISCONTINUED">
                      Ngừng kinh doanh (DISCONTINUED)
                    </Option>
                  </Select>
                </Form.Item>
              </div>
            </TabPane>

            <TabPane tab="Giá Cả & Tồn Kho" key="2">
              <div style={{ display: "flex", gap: 16 }}>
                <Form.Item
                  name="basePrice"
                  label="Giá Gốc"
                  rules={[{ required: true, message: "Vui lòng nhập giá gốc" }]}
                  style={{ flex: 1 }}
                >
                  <InputNumber
                    min={0}
                    style={{ width: "100%" }}
                    formatter={(value) =>
                      `đ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                  />
                </Form.Item>

                <Form.Item
                  name="currentPrice"
                  label="Giá Hiện Bán"
                  rules={[
                    { required: true, message: "Vui lòng nhập giá hiện bán" },
                  ]}
                  style={{ flex: 1 }}
                >
                  <InputNumber
                    min={0}
                    style={{ width: "100%" }}
                    formatter={(value) =>
                      `đ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                  />
                </Form.Item>
              </div>

              <Form.Item
                name="costPrice"
                label="Giá Nhập Hàng"
                rules={[
                  { required: true, message: "Vui lòng nhập giá nhập hàng" },
                ]}
              >
                <InputNumber
                  min={0}
                  style={{ width: "100%" }}
                  formatter={(value) =>
                    `đ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>

              <div style={{ display: "flex", gap: 16 }}>
                <Form.Item
                  name="totalQuantity"
                  label="Tổng Tồn Kho"
                  rules={[
                    { required: false, message: "Please enter total quantity" },
                  ]}
                  style={{ flex: 1 }}
                >
                  <InputNumber
                    disabled
                    min={0}
                    style={{ width: "100%" }}
                    value={
                      form?.getFieldsValue()?.availableQuantity +
                      form?.getFieldsValue()?.reservedQuantity
                    }
                  />
                </Form.Item>

                <Form.Item
                  name="availableQuantity"
                  label="Hàng sẵn bán"
                  rules={[{ required: true, message: "Nhập số hàng sẵn bán" }]}
                  style={{ flex: 1 }}
                >
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                  name="reservedQuantity"
                  label="Hàng đặt trước"
                  style={{ flex: 1 }}
                >
                  <InputNumber disabled min={0} style={{ width: "100%" }} />
                </Form.Item>
              </div>
            </TabPane>

            <TabPane tab="Categories" key="3">
              <Form.Item
                name="mainCategoryId"
                label="Main Category"
                rules={[
                  { required: true, message: "Please select main category" },
                ]}
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
                name="additionalCategories"
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
                name="additionalAttributes"
                label="Additional Attributes (JSON Format)"
              >
                <TextArea
                  rows={6}
                  placeholder={
                    'Enter additional attributes in JSON format: {"color": "red", "size": "M", "material": "cotton"}'
                  }
                />
              </Form.Item>
            </TabPane>

            <TabPane tab="Images" key="5">
              <Alert
                message="Images Upload"
                description="Image upload functionality will be implemented in the next version."
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
              />
              <Form.Item name="thumbnailUrl" label="Thumbnail URL">
                <Input placeholder="Enter thumbnail URL" />
              </Form.Item>
              <Upload
                listType="picture-card"
                fileList={[]}
                beforeUpload={() => false}
              >
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
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
          <Button
            key="close"
            onClick={() => setPriceHistoryModalVisible(false)}
          >
            Close
          </Button>,
        ]}
        width={700}
      >
        {selectedProduct && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>Current Price: </Text>
              <Text>${selectedProduct.currentPrice.toFixed(2)}</Text>
            </div>

            {priceHistoryLoading ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <Spin />
              </div>
            ) : priceHistory && priceHistory.length > 0 ? (
              <Table
                dataSource={priceHistory}
                rowKey={(record) => `${record.timestamp}`}
                pagination={false}
                columns={[
                  {
                    title: "Date",
                    dataIndex: "timestamp",
                    key: "timestamp",
                    render: (timestamp: string) =>
                      new Date(timestamp).toLocaleString(),
                  },
                  {
                    title: "Old Price",
                    dataIndex: "oldPrice",
                    key: "oldPrice",
                    render: (price: number) => `$${price.toFixed(2)}`,
                  },
                  {
                    title: "New Price",
                    dataIndex: "newPrice",
                    key: "newPrice",
                    render: (price: number) => `$${price.toFixed(2)}`,
                  },
                  {
                    title: "Reason",
                    dataIndex: "changeReason",
                    key: "changeReason",
                  },
                  {
                    title: "Changed By",
                    dataIndex: "changedBy",
                    key: "changedBy",
                  },
                ]}
              />
            ) : (
              <Empty description="No price history available" />
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
          <Button
            key="close"
            onClick={() => setQuantityHistoryModalVisible(false)}
          >
            Close
          </Button>,
        ]}
        width={700}
      >
        {selectedProduct && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>Current Quantity: </Text>
              <Text>{selectedProduct.totalQuantity}</Text>
            </div>

            {selectedProduct.quantityHistory &&
            selectedProduct.quantityHistory.length > 0 ? (
              <Table
                dataSource={selectedProduct.quantityHistory}
                rowKey={(record) => `${record.timestamp}`}
                pagination={false}
                columns={[
                  {
                    title: "Date",
                    dataIndex: "timestamp",
                    key: "timestamp",
                    render: (timestamp: string) =>
                      new Date(timestamp).toLocaleString(),
                  },
                  {
                    title: "Old Quantity",
                    dataIndex: "oldQuantity",
                    key: "oldQuantity",
                  },
                  {
                    title: "New Quantity",
                    dataIndex: "newQuantity",
                    key: "newQuantity",
                  },
                  {
                    title: "Reason",
                    dataIndex: "changeReason",
                    key: "changeReason",
                  },
                  {
                    title: "Changed By",
                    dataIndex: "changedBy",
                    key: "changedBy",
                  },
                ]}
              />
            ) : (
              <Empty description="No quantity history available" />
            )}
          </div>
        )}
      </Modal>
    </Content>
  );
};

export default ProductManagementComponent;
