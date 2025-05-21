// File: ProductActionModal.tsx
import React, {useEffect, useState} from "react";
import {Button, Form, Modal, Spin, Tabs, notification} from "antd";
import {ProductType} from "../../types/ProductType.ts";
import {CategoryType} from "../../types/category/CategoryType.ts";
import GeneralInfoTab from "../tabs/GeneralInfoTab";
import PricingInventoryTab from "../tabs/PricingInventoryTab";
import CategoriesTab from "../tabs/CategoriesTab";
import AttributesTab from "../tabs/AttributesTab";
import ImagesTab from "../tabs/ImagesTab";

const {TabPane} = Tabs;

interface ProductActionModalProps {
    visible: boolean;
    onCancel: () => void;
    onSubmit: (values: unknown) => Promise<void>;
    product: ProductType | null;
    categories: CategoryType[];
    categoriesLoading: boolean;
    loading: boolean;
}

const ProductActionModal: React.FC<ProductActionModalProps> = ({
                                                                   visible,
                                                                   onCancel,
                                                                   onSubmit,
                                                                   product,
                                                                   categories,
                                                                   categoriesLoading,
                                                                   loading
                                                               }) => {
    const [form] = Form.useForm();
    const isEditing = !!product;
    const [submitting, setSubmitting] = useState(false);

    // Initialize form when modal opens or product changes
    useEffect(() => {
        if (visible) {
            if (product) {
                // Calculate profit percentage for existing product
                const costPrice = product.costPrice || 0;
                const basePrice = product.basePrice || 0;
                const currentPrice = product.currentPrice || 0;

                // Calculate profit percentage (basePrice compared to costPrice)
                const profitPercentage = costPrice > 0 ? Math.round(((basePrice - costPrice) / costPrice) * 100) : 0;

                // Calculate discount percentage (currentPrice compared to basePrice)
                const discountPercentage = basePrice > 0 ? Math.round(((basePrice - currentPrice) / basePrice) * 100) : 0;

                // Format the form values to match the product structure
                form.setFieldsValue({
                    name: product.name,
                    description: product.description,
                    sku: product.sku,
                    brand: product.brand,
                    costPrice: product.costPrice,
                    profitPercentage: profitPercentage,
                    basePrice: product.basePrice,
                    discountPercentage: discountPercentage,
                    currentPrice: product.currentPrice,
                    mainCategoryId: product.mainCategoryId,
                    additionalCategories: product.additionalCategories || [],
                    status: product.status,
                    availableQuantity: product.availableQuantity,
                    reservedQuantity: product.reservedQuantity || 0,
                    totalQuantity: product.totalQuantity,
                    additionalAttributes: product.additionalAttributes
                        ? JSON.stringify(product.additionalAttributes)
                        : "",
                    thumbnailUrl: product.thumbnailUrl
                });
            } else {
                form.resetFields();
                // Set default values for new products
                form.setFieldsValue({
                    reservedQuantity: 0,
                    profitPercentage: 20, // Default 20% profit
                    discountPercentage: 0, // Default 0% discount
                });
            }
        }
    }, [visible, product, form]);

    // Process form values before submission
    const processFormBeforeSubmit = async () => {
        try {
            const values = await form.validateFields();
            console.log("Form values:", values);

            // Process attributes - convert from string to object
            if (values.additionalAttributes && typeof values.additionalAttributes === 'string') {
                try {
                    values.additionalAttributes = JSON.parse(values.additionalAttributes);
                } catch (error) {
                    console.error("Error parsing additionalAttributes:", error);
                    notification.error({
                        message: "Lỗi xử lý thuộc tính",
                        description: "Các thuộc tính phải ở định dạng JSON hợp lệ."
                    });
                    return null;
                }
            }

            // Build the request object
            const requestObj = isEditing ? {
                name: values.name,
                description: values.description,
                sku: values.sku,
                brand: values.brand,
                thumbnailUrl: values.thumbnailUrl,
                mainCategoryId: values.mainCategoryId,
                additionalCategories: values.additionalCategories || [],
                currentPrice: values.currentPrice,
                totalQuantity: values.totalQuantity,
                status: values.status,
                additionalAttributes: values.additionalAttributes,
                operation: "ALL"
            } : {
                ...values
            };

            console.log("Processed form data:", requestObj);
            return requestObj;
        } catch (error) {
            console.error("Form validation failed:", error);
            return null;
        }
    };

    // Handle form submission
    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const processedValues = await processFormBeforeSubmit();
            if (processedValues) {
                console.log("Submitting values:", processedValues);
                await onSubmit(processedValues);
            } else {
                notification.error({
                    message: "Kiểm tra form",
                    description: "Vui lòng kiểm tra lại thông tin sản phẩm.",
                });
            }
        } catch (error) {
            console.error("Submit error:", error);
            notification.error({
                message: "Lỗi khi lưu sản phẩm",
                description: "Đã xảy ra lỗi khi lưu sản phẩm. Vui lòng thử lại sau.",
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            title={isEditing ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm"}
            open={visible}
            onCancel={onCancel}
            width={800}
            height={800}
            maskClosable={false}
            footer={[
                <Button key="cancel" onClick={onCancel} disabled={submitting || loading}>
                    Hủy
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    onClick={handleSubmit}
                    loading={submitting || loading}
                >
                    {isEditing ? "Cập nhật" : "Thêm mới"}
                </Button>,
            ]}
        >
            {loading ? (
                <div style={{textAlign: "center", padding: "20px 0"}}>
                    <Spin/>
                </div>
            ) : (
                <Form form={form} layout="vertical">
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="Thông Tin Chung" key="1">
                            <GeneralInfoTab isEditing={isEditing}/>
                        </TabPane>

                        <TabPane tab="Giá Cả & Tồn Kho" key="2">
                            <PricingInventoryTab form={form}/>
                        </TabPane>

                        <TabPane tab="Danh Mục" key="3">
                            <CategoriesTab
                                categories={categories}
                                categoriesLoading={categoriesLoading}
                                form={form}
                            />
                        </TabPane>

                        <TabPane tab="Thuộc Tính" key="4">
                            <AttributesTab/>
                        </TabPane>

                        <TabPane tab="Hình Ảnh" key="5">
                            <ImagesTab/>
                        </TabPane>
                    </Tabs>
                </Form>
            )}
        </Modal>
    );
};

export default ProductActionModal;
