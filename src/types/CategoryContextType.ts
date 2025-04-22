import {CategoryType} from "./CategoryType.ts";

export interface CategoryContextType {
    categories: CategoryType[];
    setCategories: (categories: CategoryType[]) => void
}
