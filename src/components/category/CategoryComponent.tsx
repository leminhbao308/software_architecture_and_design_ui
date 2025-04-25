import {useEffect} from "react";
import {Button, Space, Dropdown} from "antd";
import type {MenuProps} from "antd";
import {MenuOutlined} from "@ant-design/icons";
import CategoryService from "../../services/category/CategoryService";
import useCategoryContext from "../../hooks/useCategoryContext.ts";
import {useNavigate} from "react-router-dom";

interface CategoryType {
    id: string;
    name: string;
    children?: CategoryType[];
    metadata?: object;
}

const CategoryBtn = () => {
    const {categories, setCategories} = useCategoryContext();
    const navigate = useNavigate();

    const accessToken: string | null =
        localStorage.getItem("access_token") ||
        sessionStorage.getItem("access_token");

    useEffect(() => {
        const fetchCategories = async () => {
            if (!accessToken) {
                console.log("AccessToken không tồn tại");
                return;
            }

            try {
                const data = await CategoryService.getAllCategory(accessToken);
                const datas = data.data;
                if (Array.isArray(datas)) {
                    setCategories(datas);
                } else {
                    console.error("Dữ liệu API không phải là mảng:", datas);
                    setCategories([]);
                }
            } catch (error) {
                console.error("Lấy danh mục thất bại:", error);
                setCategories([]);
            }
        };

        fetchCategories();
    }, [accessToken, setCategories]);

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
                    // Remove the onClick here since we're handling it in the label
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
        >
            <Button
                size={"large"}
                type="primary"
                icon={<MenuOutlined/>}
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
