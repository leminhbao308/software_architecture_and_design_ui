import React, {useState, useEffect} from "react";
import {Form, Select} from "antd";
import {FormInstance} from "antd/lib/form";
import {CategoryType} from "../../types/category/CategoryType.ts";

const {Option} = Select;

interface CategoriesTabProps {
    categories: CategoryType[];
    categoriesLoading: boolean;
    form: FormInstance;
}

const CategoriesTab: React.FC<CategoriesTabProps> = ({
                                                         categories,
                                                         categoriesLoading,
                                                         form
                                                     }) => {
    // State to track selected categories for filtering
    const [selectedMainCategory, setSelectedMainCategory] = useState<string | null>(null);
    const [selectedAdditionalCategories, setSelectedAdditionalCategories] = useState<string[]>([]);

    // Initialize selected categories when the form changes
    useEffect(() => {
        const mainCategoryId = form.getFieldValue('mainCategoryId');
        const additionalCategories = form.getFieldValue('additionalCategories') || [];

        setSelectedMainCategory(mainCategoryId);
        setSelectedAdditionalCategories(additionalCategories);
    }, [form]);

    // Get category options for the form
    const getCategoryOptions = (excludeIds: string[] = []) => {
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

        // Filter out excluded categories
        const filteredCategories = allCategories.filter(
            (cat) => !excludeIds.includes(cat.id)
        );

        return filteredCategories.map((cat) => (
            <Option key={cat.id} value={cat.id}>
                {cat.name}
            </Option>
        ));
    };

    return (
        <>
            <Form.Item
                name="mainCategoryId"
                label="Danh Mục Chính"
                rules={[
                    {required: true, message: "Vui lòng chọn danh mục chính"},
                ]}
            >
                <Select
                    showSearch
                    placeholder="Chọn danh mục chính"
                    optionFilterProp="children"
                    loading={categoriesLoading}
                    onChange={(value) => {
                        // Update state for filtering
                        setSelectedMainCategory(value);

                        // When main category changes, we need to make sure it's not in additional categories
                        const currentAdditionalCategories = form.getFieldValue('additionalCategories') || [];
                        if (currentAdditionalCategories.includes(value)) {
                            // Remove the selected main category from additional categories
                            const updatedAdditional = currentAdditionalCategories.filter(
                                (id: string) => id !== value
                            );
                            form.setFieldsValue({additionalCategories: updatedAdditional});
                            setSelectedAdditionalCategories(updatedAdditional);
                        }
                    }}
                >
                    {getCategoryOptions(selectedAdditionalCategories)}
                </Select>
            </Form.Item>

            <Form.Item
                name="additionalCategories"
                label="Danh Mục Phụ"
            >
                <Select
                    mode="multiple"
                    showSearch
                    placeholder="Chọn danh mục phụ"
                    optionFilterProp="children"
                    loading={categoriesLoading}
                    onChange={(values) => {
                        // Update state for filtering
                        setSelectedAdditionalCategories(values);
                    }}
                >
                    {getCategoryOptions(selectedMainCategory ? [selectedMainCategory] : [])}
                </Select>
            </Form.Item>
        </>
    );
};

export default CategoriesTab;
