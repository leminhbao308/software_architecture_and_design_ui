import React, {ReactNode, useState} from "react";
import {CategoryType} from "../types/CategoryType.ts";
import CategoryContext from "./CategoryContext.ts";

interface CategoryProviderProps {
    children: ReactNode;
}

const CategoryProvider: React.FC<CategoryProviderProps> = ({ children }) => {
    const [categories, setCategories] = useState<CategoryType[]>([])

    return (
        <CategoryContext.Provider
            value={{
                categories,
                setCategories,
            }}
        >
            {children}
        </CategoryContext.Provider>
    );
};

export default CategoryProvider;
