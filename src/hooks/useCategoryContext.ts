import {useContext, useEffect} from "react";
import CategoryContext from "../context/CategoryContext.ts";
import {getAccessToken} from "../utils/tokenUtils.ts";

// Custom hook to use the category context
const useCategoryContext = () => {
    const context = useContext(CategoryContext);

    if (context === undefined) {
        throw new Error("useCategoryContext must be used within a CategoryProvider");
    }

    // A simplified fetchCategories method that doesn't require passing token
    const fetchCategories = async () => {
        const accessToken = getAccessToken();
        if (accessToken) {
            await context.fetchCategories(accessToken);
        }
    };

    // Fetch categories on first render
    useEffect(() => {
        // Only fetch if we don't have categories already
        if (context.categories.length === 0 && !context.loading) {
            fetchCategories();
        }
    }, []);

    return {
        ...context,
        fetchCategories
    };
};

export default useCategoryContext;
