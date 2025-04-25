import {CategoryType} from "../types/CategoryType";
import useCategoryContext from "./useCategoryContext";

const useCategoryInfo = () => {
    const { categories } = useCategoryContext();

    /**
     * Find a category by ID in the categories tree
     * @param categoryId The ID of the category to find
     * @param categoriesList The list of categories to search in (defaults to context categories)
     * @returns The found category or undefined
     */
    const findCategoryById = (categoryId: string, categoriesList: CategoryType[] = categories): CategoryType | undefined => {
        for (const category of categoriesList) {
            if (category.id === categoryId) {
                return category;
            }

            if (category.children && category.children.length > 0) {
                const found = findCategoryById(categoryId, category.children);
                if (found) {
                    return found;
                }
            }
        }

        return undefined;
    };

    /**
     * Get the category name by ID
     * @param categoryId The ID of the category
     * @returns The category name or "Unknown Category" if not found
     */
    const getCategoryNameById = (categoryId: string): string => {
        const category = findCategoryById(categoryId);
        return category ? category.name : "Unknown Category";
    };

    return {
        findCategoryById,
        getCategoryNameById
    };
};

export default useCategoryInfo;
