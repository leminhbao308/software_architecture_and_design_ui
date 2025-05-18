import {useMemo} from 'react';
import {CategoryType} from '../types/category/CategoryType.ts';
import useCategoryContext from '../hooks/useCategoryContext';

/**
 * Custom hook to count main categories and total categories
 * @returns An object containing mainCategoryCount and totalCategoryCount
 */
export const useCategoryCount = () => {
    const {categories} = useCategoryContext();

    // Use memoization to prevent unnecessary recalculations
    return useMemo(() => {
        // Handle case when categories is undefined or null
        if (!categories || !Array.isArray(categories)) {
            return {
                mainCategoryCount: 0,
                totalCategoryCount: 0
            };
        }

        // Count main categories (top-level categories)
        const mainCategoryCount = categories.length;

        // Count all categories including nested ones
        const countAllCategories = (cats: CategoryType[]): number => {
            if (!cats || !Array.isArray(cats)) return 0;

            let count = cats.length;

            // Add all children recursively
            cats.forEach(cat => {
                if (cat.children && Array.isArray(cat.children) && cat.children.length > 0) {
                    count += countAllCategories(cat.children);
                }
            });

            return count;
        };

        const totalCategoryCount = countAllCategories(categories);

        return {
            mainCategoryCount,
            totalCategoryCount
        };
    }, [categories]);
};

/**
 * Alternative approach as a regular function if you don't need a hook
 */
export const getCategoryCounts = (categories: CategoryType[]) => {
    // Handle case when categories is undefined or null
    if (!categories || !Array.isArray(categories)) {
        return {
            mainCategoryCount: 0,
            totalCategoryCount: 0
        };
    }

    // Count main categories (top-level categories)
    const mainCategoryCount = categories.length;

    // Count all categories including nested ones
    const countAllCategories = (cats: CategoryType[]): number => {
        if (!cats || !Array.isArray(cats)) return 0;

        let count = cats.length;

        // Add all children recursively
        cats.forEach(cat => {
            if (cat.children && Array.isArray(cat.children) && cat.children.length > 0) {
                count += countAllCategories(cat.children);
            }
        });

        return count;
    };

    const totalCategoryCount = countAllCategories(categories);

    return {
        mainCategoryCount,
        totalCategoryCount
    };
};
