import axios from "axios";
import APIConst from "../../consts/APIConst";
import {CategoryType} from "../../types/category/CategoryType.ts";
import {CategoryPayloadType} from "../../types/category/CategoryPayloadType.ts";

const CategoryService = {
  /**
   * Get all categories
   * @param access_token The user's access token
   * @returns Array of categories
   */
  getAllCategory: async (access_token: string) => {
    try {
      const response = await axios.get(
          `${APIConst.API_CONTEXT}${APIConst.GET_ALL_CATEGORIES}`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
              "Content-Type": "application/json",
            },
          }
      );

      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error("Failed to fetch categories");
      }
    } catch (error) {
      console.error("Get all categories failed", error);
      throw error;
    }
  },

  /**
   * Create a new category
   * @param access_token The user's access token
   * @param category The category data to create
   * @returns The created category
   */
  createCategory: async (access_token: string, category: Partial<CategoryPayloadType>) => {
    try {
      const response = await axios.post(
          `${APIConst.API_CONTEXT}${APIConst.CREATE_CATEGORY}`,
          category,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
              "Content-Type": "application/json",
            },
          }
      );

      if (response.status === 201) {
        return response.data;
      } else {
        throw new Error("Failed to create category");
      }
    } catch (error) {
      console.error("Create category failed", error);
      throw error;
    }
  },

  /**
   * Update an existing category
   * @param access_token The user's access token
   * @param categoryId The ID of the category to update
   * @param categoryData The updated category data
   * @returns The updated category
   */
  updateCategory: async (access_token: string, categoryId: string, categoryData: Partial<CategoryType>) => {
    try {
      const response = await axios.put(
          `${APIConst.API_CONTEXT}${APIConst.UPDATE_CATEGORY.replace('{id}', categoryId)}`,
          categoryData,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
              "Content-Type": "application/json",
            },
          }
      );

      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error("Failed to update category");
      }
    } catch (error) {
      console.error("Update category failed", error);
      throw error;
    }
  },

  /**
   * Delete a category
   * @param access_token The user's access token
   * @param categoryId The ID of the category to delete
   * @returns Success status
   */
  deleteCategory: async (access_token: string, categoryId: string) => {
    try {
      const response = await axios.delete(
          `${APIConst.API_CONTEXT}${APIConst.DELETE_CATEGORY.replace('{id}', categoryId)}`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
              "Content-Type": "application/json",
            },
          }
      );

      if (response.status === 200 || response.status === 204) {
        return true;
      } else {
        throw new Error("Failed to delete category");
      }
    } catch (error) {
      console.error("Delete category failed", error);
      throw error;
    }
  },

  /**
   * Delete a category and all its children
   * @param access_token The user's access token
   * @param categoryId The ID of the category to delete with all its children
   * @returns Success status
   */
  deleteCategoryAndChildren: async (access_token: string, categoryId: string) => {
    try {
      const response = await axios.delete(
          `${APIConst.API_CONTEXT}${APIConst.DELETE_CATEGORY_WITH_CHILDREN.replace('{id}', categoryId)}`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
              "Content-Type": "application/json",
            },
          }
      );

      if (response.status === 200 || response.status === 204) {
        return true;
      } else {
        throw new Error("Failed to delete category and its children");
      }
    } catch (error) {
      console.error("Delete category and children failed", error);
      throw error;
    }
  },

  /**
   * Get a single category by ID
   * @param access_token The user's access token
   * @param categoryId The ID of the category to fetch
   * @returns The category data
   */
  getCategoryById: async (access_token: string, categoryId: string) => {
    try {
      const response = await axios.get(
          `${APIConst.API_CONTEXT}${APIConst.GET_CATEGORY_BY_ID.replace('{id}', categoryId)}`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
              "Content-Type": "application/json",
            },
          }
      );

      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error("Failed to fetch category");
      }
    } catch (error) {
      console.error("Get category by ID failed", error);
      throw error;
    }
  },

  /**
   * Get subcategories for a given parent category
   * @param access_token The user's access token
   * @param parentId The parent category ID
   * @returns List of subcategories
   */
  getSubcategories: async (access_token: string, parentId: string) => {
    try {
      const response = await axios.get(
          `${APIConst.API_CONTEXT}${APIConst.GET_SUBCATEGORIES.replace('{id}', parentId)}`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
              "Content-Type": "application/json",
            },
          }
      );

      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error("Failed to fetch subcategories");
      }
    } catch (error) {
      console.error("Get subcategories failed", error);
      throw error;
    }
  },

  /**
   * Check if a category has children
   * @param access_token The user's access token
   * @param categoryId The ID of the category to check
   * @returns True if the category has children, false otherwise
   */
  hasChildren: async (access_token: string, categoryId: string) => {
    try {
      const subcategories = await CategoryService.getSubcategories(access_token, categoryId);
      return subcategories && subcategories.length > 0;
    } catch (error) {
      console.error("Check for children failed", error);
      return false; // Assume no children if the check fails
    }
  }
};

export default CategoryService;
