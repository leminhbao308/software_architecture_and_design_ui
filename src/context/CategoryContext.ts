import {createContext} from "react";
import {CategoryContextType} from "../types/CategoryContextType.ts";

// Tạo context với giá trị mặc định là undefined
const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export default CategoryContext;
