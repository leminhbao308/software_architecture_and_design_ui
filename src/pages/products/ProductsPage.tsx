import ProductSegment from "../../components/products/ProductSegment.tsx";
import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import useCategoryInfo from "../../hooks/useCategoryInfo.ts";
import useCategoryContext from "../../hooks/useCategoryContext.ts";

const ProductsPage: React.FC = () => {
    const { categoryId } = useParams<{ categoryId: string }>();
    const { getCategoryNameById } = useCategoryInfo();
    const { categories } = useCategoryContext();
    const [categoryName, setCategoryName] = useState<string>("Loading...");


    useEffect(() => {
        if (!categoryId) {
            setCategoryName("Category Not Found");
            return;
        }

        // Wait for categories to be loaded
        if (categories && categories.length > 0) {
            setCategoryName(getCategoryNameById(categoryId));
        }
    }, [categoryId, categories, getCategoryNameById]);

    if (!categoryId) {
        return <div className="container" style={{marginTop: "150px"}}>Category not found</div>;
    }

    return (
        <div className={"container"} style={{marginTop: "150px"}}>
            <ProductSegment
                title={`Danh Sách Sản Phẩm ${categoryName}`}
                categoryId={categoryId}
                size={20}
            />
        </div>
    );
};

export default ProductsPage;
