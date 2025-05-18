import type {MenuProps} from "antd";
import {Button, Dropdown, Space, Spin} from "antd";
import {MenuOutlined} from "@ant-design/icons";
import useCategoryContext from "../../hooks/useCategoryContext.ts";
import {useNavigate} from "react-router-dom";

interface CategoryType {
    id: string;
    name: string;
    children?: CategoryType[];
    metadata?: object;
}

const CategoryBtn = () => {
    // Get categories and loading state from context
    const {categories, loading} = useCategoryContext();
    const navigate = useNavigate();

    // Handle category item click
    const handleCategoryClick = (categoryId: string) => {
        navigate(`/products/${categoryId}`);
    };

    // Convert categories to MenuProps items format
    const getMenuItems = (categories: CategoryType[]): MenuProps['items'] => {
        return categories.map((category) => {
            if (category.children && category.children.length > 0) {
                return {
                    key: category.id,
                    label: (
                        <span onClick={(e) => {
                            e.stopPropagation();
                            handleCategoryClick(category.id);
                        }}>
                            {category.name}
                        </span>
                    ),
                    popupOffset: [1, 0],
                    children: getMenuItems(category.children),
                };
            }
            return {
                key: category.id,
                label: category.name,
                onClick: () => handleCategoryClick(category.id)
            };
        });
    };

    // Create menu props
    const menuProps: MenuProps = {
        items: getMenuItems(categories),
        style: {
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        }
    };

    return (
        <Dropdown
            menu={menuProps}
            placement="bottomLeft"
            trigger={['click', 'hover']}
            disabled={loading || categories.length === 0}
        >
            <Button
                size={"large"}
                type="primary"
                icon={loading ? <Spin size="small"/> : <MenuOutlined/>}
                iconPosition={"start"}
                style={{display: 'flex', alignItems: 'center', fontWeight: '500', background: "gray"}}
            >
                <Space>
                    Danh mục
                </Space>
            </Button>
        </Dropdown>
    );
};

export default CategoryBtn;
