import { useContext } from "react";
import CategoryContext from "../context/CategoryContext.ts";

// Custom hook để sử dụng context
const useCategoryContext = () => {
    const context = useContext(CategoryContext);
    if (context === undefined) {
        throw new Error("useCategoryContext must be used within a CategoryProvider");
    }
    return context;
};

export default useCategoryContext;
