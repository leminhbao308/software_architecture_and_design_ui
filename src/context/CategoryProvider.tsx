import React, {ReactNode, useState} from "react";
import {CategoryType} from "../types/category/CategoryType.ts";
import CategoryContext from "./CategoryContext.ts";

interface CategoryProviderProps {
    children: ReactNode;
}

export const CategoryProvider: React.FC<CategoryProviderProps> = ({children}) => {
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Import CategoryService here instead of in the hook
    // This avoids circular dependencies
    const fetchCategories = async (accessToken: string) => {
        if (!accessToken) {
            setError("No access token available");
            return;
        }

        setLoading(true);
        try {
            // Import dynamically to avoid circular dependencies
            const {default: CategoryService} = await import("../services/category/CategoryService");
            const response = await CategoryService.getAllCategory(accessToken);

            if (Array.isArray(response.data)) {
                setCategories(response.data);
            } else {
                console.error("API data is not an array:", response.data);
                setCategories([]);
            }
            setError(null);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
            setError("Failed to load categories");
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <CategoryContext.Provider value={{
            categories,
            setCategories,
            loading,
            setLoading,
            error,
            setError,
            fetchCategories
        }}>
            {children}
        </CategoryContext.Provider>
    );
};
