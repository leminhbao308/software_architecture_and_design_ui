import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Spin, Empty } from "antd";
import ProductSegment from "../components/products/ProductSegment.tsx";

const SearchResultsPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Extract search parameters
    const name = searchParams.get("name") || "";
    const sku = searchParams.get("sku") || "";
    const category = searchParams.get("category") || "";
    const brand = searchParams.get("brand") || "";

    // Create a title for the search results
    const getSearchTitle = () => {
        let title = "Kết Quả Tìm Kiếm";

        if (name) title += ` cho "${name}"`;
        if (sku) title += ` - SKU: ${sku}`;
        if (category) title += ` - Danh mục: ${category}`;
        if (brand) title += ` - Thương hiệu: ${brand}`;

        return title;
    };

    // Create search parameters object for the ProductSegment
    const searchQueryParams = {
        name,
        sku,
        category,
        brand
    };

    useEffect(() => {
        // Set loading to false after a short delay to ensure UI updates
        setTimeout(() => {
            setIsLoading(false);
        }, 300);
    }, [searchParams]);

    return (
        <div className="container" style={{ marginTop: "150px" }}>
            <Spin spinning={isLoading}>
                {(name || sku || category || brand) ? (
                    <ProductSegment
                        title={getSearchTitle()}
                        searchParams={searchQueryParams}
                        size={20}
                    />
                ) : (
                    <Empty
                        description="Vui lòng nhập từ khoá tìm kiếm"
                        style={{ margin: "50px 0" }}
                    />
                )}
            </Spin>
        </div>
    );
};

export default SearchResultsPage;
