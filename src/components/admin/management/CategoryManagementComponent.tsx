import React, {useState, useEffect} from "react";
import {Layout, Table, Button, Input, Modal, Form, Select, notification, Spin, Card, Typography, Space, Empty, Alert, Badge, Tooltip} from "antd";
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    SearchOutlined,
    FolderOutlined,
    FolderOpenOutlined,
    QuestionCircleOutlined
} from "@ant-design/icons";
import useCategoryContext from "../../../hooks/useCategoryContext.ts";
import {useCategoryCount} from "../../../hooks/useCategoryCount.ts";
import {CategoryType} from "../../../types/category/CategoryType.ts";
import CategoryService from "../../../services/category/CategoryService.ts";
import {getAccessToken} from "../../../utils/tokenUtils.ts";

const {Content} = Layout;
const {Option} = Select;
const {Title, Text} = Typography;

const CategoryManagementComponent: React.FC = () => {
    // Get categories from context
    const {categories, loading, fetchCategories} = useCategoryContext();
    const {mainCategoryCount, totalCategoryCount} = useCategoryCount();

    // Local states
    const [modalVisible, setModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
    const [hasChildrenToDelete, setHasChildrenToDelete] = useState(false);
    const [editingCategory, setEditingCategory] = useState<CategoryType | null>(null);
    const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
    const [searchValue, setSearchValue] = useState("");
    const [parentId, setParentId] = useState<string | null>(null);
    const [form] = Form.useForm();
    const accessToken = getAccessToken();

    // Error handling
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Initialize expanded keys when categories load
        if (categories && categories.length > 0) {
            setExpandedKeys(categories.map((cat: CategoryType) => cat.id));
        }
    }, [categories]);

    // Convert categories to flat table structure with levels
    const flattenCategories = (
        categoryData: CategoryType[] | undefined,
        parentKey = "",
        level = 0,
        visited: Set<string> = new Set()
    ): any[] => {
        if (!categoryData || !Array.isArray(categoryData)) return [];

        return categoryData.reduce((acc: any[], category) => {
            const key = category.id;

            // Skip if already visited to prevent duplicates
            if (visited.has(key)) return acc;
            visited.add(key);

            const hasChildren = category.children && category.children.length > 0;

            acc.push({
                key,
                id: category.id,
                name: category.name,
                level,
                isLeaf: !hasChildren,
                parentKey,
                hasChildren,
                children: category.children,
                metadata: category.metadata,
                ...category
            });

            if (hasChildren && expandedKeys.includes(key)) {
                acc = acc.concat(flattenCategories(category.children, key, level + 1, visited));
            }

            return acc;
        }, []);
    };

    // Handle row expansion
    const handleExpand = (expanded: boolean, record: any) => {
        const keys = [...expandedKeys];

        if (expanded) {
            keys.push(record.key);
        } else {
            const index = keys.indexOf(record.key);
            if (index !== -1) {
                keys.splice(index, 1);
            }
        }

        setExpandedKeys(keys);
    };

    // Show modal for adding/editing category
    const showModal = (category?: CategoryType) => {
        if (category) {
            setEditingCategory(category);
            setParentId(null);
            form.setFieldsValue({
                name: category.name,
                metadata: category.metadata ? JSON.stringify(category.metadata) : '',
            });
        } else {
            setEditingCategory(null);
            setParentId(null);
            form.resetFields();
        }
        setModalVisible(true);
    };

    // Show modal for adding a child category
    const showAddChildModal = (parentCategoryId: string) => {
        setEditingCategory(null);
        setParentId(parentCategoryId);
        form.resetFields();
        setModalVisible(true);
    };

    const handleCancel = () => {
        setModalVisible(false);
        form.resetFields();
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            // Process metadata if provided
            if (values.metadata) {
                try {
                    values.metadata = JSON.parse(values.metadata);
                } catch (err) {
                    notification.error({
                        message: "Invalid metadata format",
                        description: "Please enter valid JSON format for metadata"
                    });
                    return;
                }
            }

            if (editingCategory) {
                // Update existing category
                await CategoryService.updateCategory(
                    accessToken,
                    editingCategory.id,
                    {...values}
                );

                notification.success({message: "Category updated successfully"});
            } else {
                // Create new category
                const categoryData = {
                    ...values,
                    parent_id: parentId ? parentId : null
                };

                await CategoryService.createCategory(accessToken, categoryData);
                notification.success({
                    message: parentId ? "Child category added successfully" : "Category added successfully"
                });
            }

            // Refresh categories using the shared context method
            fetchCategories();
            setModalVisible(false);
            form.resetFields();
        } catch (error) {
            notification.error({
                message: "Operation failed",
                description: "There was an error processing your request. Please try again."
            });
            console.error("Error in form submission:", error);
        }
    };

    // Handle category deletion
    const handleDelete = async (id: string) => {
        setCategoryToDelete(id);

        // Check if category has children before showing the modal
        try {
            const hasChildren = await CategoryService.hasChildren(accessToken, id);
            setHasChildrenToDelete(hasChildren);
            setDeleteModalVisible(true);
        } catch (error) {
            console.error("Error checking for children:", error);
            // Default to assuming there are children to be safe
            setHasChildrenToDelete(true);
            setDeleteModalVisible(true);
        }
    };

    // Confirm delete action
    const confirmDelete = async (deleteWithChildren: boolean = false) => {
        if (!categoryToDelete) return;

        try {
            if (deleteWithChildren) {
                // Use the dedicated method to delete category with all its children
                await CategoryService.deleteCategoryAndChildren(accessToken, categoryToDelete);
                notification.success({message: "Category and all subcategories deleted successfully"});
            } else {
                // Standard delete - will fail if category has children
                await CategoryService.deleteCategory(accessToken, categoryToDelete);
                notification.success({message: "Category deleted successfully"});
            }

            // Refresh categories using the shared context method
            fetchCategories();
        } catch (error) {
            notification.error({
                message: "Delete failed",
                description: "There was an error deleting the category. Please try again."
            });
            console.error("Error deleting category:", error);
        } finally {
            setDeleteModalVisible(false);
            setCategoryToDelete(null);
            setHasChildrenToDelete(false);
        }
    };

    // Get parent category options for the form
    const getParentOptions = () => {
        const getAllCategories = (cats: CategoryType[] | undefined, result: CategoryType[] = [], visited: Set<string> = new Set()) => {
            if (!cats || !Array.isArray(cats)) {
                return result;
            }

            cats.forEach(cat => {
                // Skip if already visited to prevent duplicates
                if (visited.has(cat.id)) return;
                visited.add(cat.id);

                result.push(cat);
                if (cat.children && Array.isArray(cat.children) && cat.children.length > 0) {
                    getAllCategories(cat.children, result, visited);
                }
            });
            return result;
        };

        const allCategories = getAllCategories(categories);

        // For regular editing, exclude current category and its descendants
        return allCategories
            .filter(cat => {
                if (!editingCategory) return true;
                return cat.id !== editingCategory.id && !isDescendantOf(cat, editingCategory, categories);
            })
            .map(cat => (
                <Option key={cat.id} value={cat.id}>{cat.name}</Option>
            ));
    };

    // Helper to check if a category is descendant of another
    const isDescendantOf = (
        cat: CategoryType,
        potentialAncestor: any,
        allCats: CategoryType[] | undefined
    ): boolean => {
        if (!allCats) return false;

        // Find the potential ancestor in all categories
        const findAncestor = (cats: CategoryType[]): CategoryType | undefined => {
            for (const c of cats) {
                if (c.id === potentialAncestor.id) return c;
                if (c.children) {
                    const found = findAncestor(c.children);
                    if (found) return found;
                }
            }
            return undefined;
        };

        const ancestor = findAncestor(allCats);
        if (!ancestor || !ancestor.children) return false;

        // Check if cat is in ancestor's descendants
        const isInDescendants = (children: CategoryType[]): boolean => {
            for (const child of children) {
                if (child.id === cat.id) return true;
                if (child.children) {
                    if (isInDescendants(child.children)) return true;
                }
            }
            return false;
        };

        return isInDescendants(ancestor.children);
    };

    // Count children (direct and indirect) for a category
    const countChildrenRecursive = (category: any): number => {
        if (!category.children || !Array.isArray(category.children) || category.children.length === 0) {
            return 0;
        }

        return category.children.reduce((count: number, child: any) => {
            return count + 1 + countChildrenRecursive(child);
        }, 0);
    };

    // Filter based on search value
    const filteredData = React.useMemo(() => {
        if (!searchValue) {
            return flattenCategories(categories);
        }

        const searchTerm = searchValue.toLowerCase();
        const matchingIds = new Set<string>();
        const visitedNodes = new Set<string>();

        // First identify all matching nodes and their ancestors
        const identifyMatches = (cats: CategoryType[] | undefined, ancestorPath: string[] = []) => {
            if (!cats || !Array.isArray(cats)) return;

            cats.forEach(cat => {
                if (visitedNodes.has(cat.id)) return;
                visitedNodes.add(cat.id);

                const matches = cat.name.toLowerCase().includes(searchTerm);
                if (matches) {
                    // Add this node and all its ancestors
                    matchingIds.add(cat.id);
                    ancestorPath.forEach(id => matchingIds.add(id));
                }

                // Continue searching in children
                if (cat.children && cat.children.length > 0) {
                    identifyMatches(cat.children, [...ancestorPath, cat.id]);
                }
            });
        };

        identifyMatches(categories);

        // Then flatten categories, but only include matching nodes and their ancestors
        const flattenMatchingCategories = (
            cats: CategoryType[] | undefined,
            parentKey = "",
            level = 0,
            visited: Set<string> = new Set()
        ): any[] => {
            if (!cats || !Array.isArray(cats)) return [];

            return cats.reduce((acc: any[], cat) => {
                if (visited.has(cat.id)) return acc;
                visited.add(cat.id);

                const hasChildren = cat.children && cat.children.length > 0;
                const includeSelf = matchingIds.has(cat.id);

                // Include this node if it matches or has matching descendants
                if (includeSelf) {
                    acc.push({
                        key: cat.id,
                        id: cat.id,
                        name: cat.name,
                        level,
                        isLeaf: !hasChildren,
                        parentKey,
                        hasChildren,
                        children: cat.children,
                        metadata: cat.metadata,
                        ...cat
                    });
                }

                // Include matching children
                if (hasChildren) {
                    const childResults = flattenMatchingCategories(cat.children, cat.id, level + 1, visited);
                    if (childResults.length > 0) {
                        acc = acc.concat(childResults);
                    }
                }

                return acc;
            }, []);
        };

        return flattenMatchingCategories(categories);
    }, [categories, searchValue]);

    // Define table columns
    const columns = [
        {
            title: 'Category Name',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: any) => {
                const indent = {paddingLeft: `${record.level * 20}px`};
                const icon = record.hasChildren ?
                    (expandedKeys.includes(record.key) ? <FolderOpenOutlined/> : <FolderOutlined/>) :
                    null;

                const childCount = countChildrenRecursive(record);
                const badge = childCount > 0 ? (
                    <Badge
                        count={childCount}
                        style={{
                            backgroundColor: '#52c41a',
                            marginLeft: 8
                        }}
                        overflowCount={99}
                    />
                ) : null;

                return (
                    <div style={{display: 'flex', alignItems: 'center', ...indent}}>
                        {icon && <span style={{marginRight: 8}}>{icon}</span>}
                        <span>{text}</span>
                        {badge}
                    </div>
                );
            },
        },
        {
            title: 'Metadata',
            dataIndex: 'metadata',
            key: 'metadata',
            width: 120,
            render: (metadata: any) => {
                if (!metadata || Object.keys(metadata).length === 0) return '-';

                return (
                    <Tooltip title={<pre>{JSON.stringify(metadata, null, 2)}</pre>}>
                        <Button size="small" icon={<QuestionCircleOutlined/>}>
                            View
                        </Button>
                    </Tooltip>
                );
            }
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 280,
            render: (_: any, record: any) => (
                <Space>
                    <Button
                        type="primary"
                        size="middle"
                        icon={<PlusOutlined/>}
                        onClick={(e) => {
                            e.stopPropagation();
                            showAddChildModal(record.id);
                        }}
                    >
                        Add Child
                    </Button>
                    <Button
                        size="middle"
                        icon={<EditOutlined/>}
                        onClick={(e) => {
                            e.stopPropagation();
                            showModal(record);
                        }}
                    >
                        Edit
                    </Button>
                    <Button
                        danger
                        size="middle"
                        icon={<DeleteOutlined/>}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(record.id);
                        }}
                    >
                        Delete
                    </Button>
                </Space>
            )
        }
    ];

    // Expand all categories
    const expandAll = () => {
        const allCategories = flattenCategories(categories);
        const allKeys = allCategories.map(cat => cat.key);
        setExpandedKeys(allKeys);
    };

    // Collapse all categories
    const collapseAll = () => {
        setExpandedKeys([]);
    };

    return (
        <Content style={{margin: '24px 16px', padding: 24, background: '#f5f7fa', overflow: 'auto'}}>
            {/* Stats and Action Bar */}
            <div style={{marginBottom: 24}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24}}>
                    <Space>
                        <Card style={{width: 200}}>
                            <Statistic title="Main Categories" value={mainCategoryCount}/>
                        </Card>
                        <Card style={{width: 200}}>
                            <Statistic title="Total Categories" value={totalCategoryCount}/>
                        </Card>
                    </Space>

                    <Space>
                        <Button
                            type="primary"
                            size="large"
                            icon={<PlusOutlined/>}
                            onClick={() => showModal()}
                        >
                            Add Main Category
                        </Button>
                        <Input
                            size="large"
                            prefix={<SearchOutlined/>}
                            placeholder="Search categories..."
                            onChange={(e) => setSearchValue(e.target.value)}
                            style={{width: 250}}
                            allowClear
                            value={searchValue}
                        />
                    </Space>
                </div>
            </div>

            {/* Categories Table */}
            {loading ? (
                <div style={{textAlign: 'center', padding: '50px 0'}}>
                    <Spin size="large"/>
                </div>
            ) : error ? (
                <Alert
                    message="Error"
                    description={`Failed to load categories: ${error}`}
                    type="error"
                    showIcon
                />
            ) : (
                <Card>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
                        <Title level={5}>Category Hierarchy</Title>
                        <Space>
                            <Button onClick={expandAll}>Expand All</Button>
                            <Button onClick={collapseAll}>Collapse All</Button>
                        </Space>
                    </div>

                    {categories && Array.isArray(categories) && categories.length > 0 ? (
                        <Table
                            columns={columns}
                            dataSource={filteredData}
                            rowKey="key"
                            pagination={{
                                pageSize: 20,
                                showSizeChanger: true,
                                pageSizeOptions: ['10', '20', '50', '100'],
                                showTotal: (total) => `Total ${total} items`
                            }}
                            expandable={{
                                expandedRowKeys: expandedKeys,
                                onExpand: handleExpand,
                                // Hide default expand icons since we're using custom ones
                                expandIcon: () => null
                            }}
                            onRow={(record) => ({
                                onClick: (e) => {
                                    // Prevent row click from triggering when clicking on action buttons
                                    if ((e.target as HTMLElement).closest('button')) {
                                        return;
                                    }
                                    if (record.hasChildren) {
                                        handleExpand(!expandedKeys.includes(record.key), record);
                                    }
                                }
                            })}
                        />
                    ) : (
                        <Empty description="No categories found"/>
                    )}
                </Card>
            )}

            {/* Add/Edit Category Modal */}
            <Modal
                title={editingCategory ? "Edit Category" : parentId ? "Add Child Category" : "Add Main Category"}
                open={modalVisible}
                onCancel={handleCancel}
                onOk={handleSubmit}
                width={600}
                maskClosable={false}
            >
                <Form
                    form={form}
                    layout="vertical"
                >
                    <Form.Item
                        name="name"
                        label="Category Name"
                        rules={[{required: true, message: 'Please enter category name'}]}
                    >
                        <Input placeholder="Enter category name"/>
                    </Form.Item>

                    {!editingCategory && (
                        <Form.Item
                            name="parent"
                            label="Parent Category (Optional)"
                        >
                            <Select
                                placeholder="Select parent category"
                                allowClear
                                onChange={(value) => setParentId(value)}
                                defaultValue={parentId || undefined}
                            >
                                {getParentOptions()}
                            </Select>
                        </Form.Item>
                    )}

                    <Form.Item
                        name="metadata"
                        label="Metadata (Optional)"
                    >
                        <Input.TextArea
                            rows={3}
                            placeholder={"Enter metadata in JSON format: {\"key1\": \"value1\", \"key2\": \"value2\"}"}
                        />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                title="Confirm Delete"
                open={deleteModalVisible}
                onCancel={() => setDeleteModalVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setDeleteModalVisible(false)}>
                        Cancel
                    </Button>,
                    <Button
                        key="delete"
                        danger
                        onClick={() => confirmDelete(false)}
                        disabled={hasChildrenToDelete}
                    >
                        Delete Category Only
                    </Button>,
                    hasChildrenToDelete && (
                        <Button
                            key="deleteAll"
                            type="primary"
                            danger
                            onClick={() => confirmDelete(true)}
                        >
                            Delete Category & All Children
                        </Button>
                    )
                ]}
            >
                {hasChildrenToDelete ? (
                    <div>
                        <p>This category has subcategories. How would you like to proceed?</p>
                        <ul>
                            <li>Delete this category and all its subcategories</li>
                            <li>or Cancel to keep everything</li>
                        </ul>
                        <Alert
                            message="Warning"
                            description="Deleting a category with its subcategories cannot be undone!"
                            type="warning"
                            showIcon
                            style={{marginTop: 16}}
                        />
                    </div>
                ) : (
                    <p>Are you sure you want to delete this category? This action cannot be undone.</p>
                )}
            </Modal>
        </Content>
    );
};

// Add this component for the stats cards
const Statistic: React.FC<{ title: string; value: number }> = ({title, value}) => {
    return (
        <div>
            <Text type="secondary">{title}</Text>
            <Title level={3} style={{margin: '8px 0 0 0'}}>{value}</Title>
        </div>
    );
};

export default CategoryManagementComponent;
