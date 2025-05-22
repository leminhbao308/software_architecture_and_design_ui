import {createContext} from "react";
import {CategoryType} from "../types/category/CategoryType";

interface CategoryContextProps {
    categories: CategoryType[];
    setCategories: (categories: CategoryType[]) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
    fetchCategories: (accessToken: string) => Promise<void>;
}

// Default context value
const defaultContextValue: CategoryContextProps = {
    categories: [],
    setCategories: () => {
    },
    loading: false,
    setLoading: () => {
    },
    error: null,
    setError: () => {
    },
    fetchCategories: async () => {
    }
};

// Create context
const CategoryContext = createContext<CategoryContextProps>(defaultContextValue);

export default CategoryContext;
