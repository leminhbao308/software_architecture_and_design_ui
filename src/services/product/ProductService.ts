import axios from "axios";
import APIConst from "../../consts/APIConst";
import {ProductType} from "../../types/ProductType.ts";

interface PriceUpdateParams {
  newPrice: number;
  reason?: string;
  changedBy?: string;
}

interface InventoryUpdateParams {
  newQuantity: number;
  reason?: string;
  changedBy?: string;
}

interface SearchProductParams {
  name?: string;
  sku?: string;
  category?: string;
  brand?: string;
  page?: number;
  size?: number;
  sort_by?: string;
  sort_dir?: string;
}

interface FileUploadParams {
  file: File;
  productId: string;
}

export interface ProductUpdateUnifiedRequest {
  name?: string;
  sku?: string;
  description?: string;
  brand?: string;
  thumbnailUrl?: string;
  imageUrls?: string[];
  mainCategoryId?: string;
  additionalCategories?: string[];
  currentPrice?: number;
  priceChangeReason?: string;
  priceChangedBy?: string;
  totalQuantity?: number;
  quantityChangeReason?: string;
  quantityChangedBy?: string;
  status?: string;
  additionalAttributes?: Record<string, unknown>;
  operation: "ALL" | "BASIC_INFO" | "PRICE" | "QUANTITY" | "STATUS" | "CATEGORIES" | "ATTRIBUTES";
}

const ProductService = {
  getAllProduct: async (access_token: string, categoryId?: string, page?: number, size?: number) => {
    try {
      // Tạo đối tượng URLSearchParams để xây dựng query parameters
      const params = new URLSearchParams();

      // Thêm các parameters nếu chúng được cung cấp
      if (categoryId) params.append("category_id", categoryId);
      if (page) params.append("page", page.toString());
      if (size) params.append("size", size.toString()); // Thêm size parameter nếu được cung cấp

      // Xây dựng URL với query parameters
      const queryString = params.toString();
      const url = `${APIConst.API_CONTEXT}${APIConst.GET_ALL_PRODUCTS}${queryString ? `?${queryString}` : ''}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      });

      // Kiểm tra nếu response có data hợp lệ
      if (response.status === 200) {
        return response.data.data;
      } else {
        console.log("Lấy sản phẩm thất bại");
        return [];
      }
    } catch (error) {
      console.error("get all products is failed", error);
      return [];
    }
  },

  getProductByProductId: async (access_token: string, productId: string) => {
    try {
      const response = await axios.get(
          `${APIConst.API_CONTEXT}${APIConst.GET_ALL_PRODUCTS}/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
              "Content-Type": "application/json",
            },
          }
      );

      if (response.status === 200) {
        return response.data.data;
      } else {
        console.log(`Lấy sản phẩm với ID ${productId} thất bại`);
        return null;
      }
    } catch (error) {
      console.error(`Lấy sản phẩm với ID ${productId} thất bại:`, error);
      return null;
    }
  },

  searchProducts: async (access_token: string, params: SearchProductParams) => {
    try {
      // Create URLSearchParams for the search query
      const searchParams = new URLSearchParams();

      // Add all provided parameters
      if (params.name) searchParams.append("name", params.name);
      if (params.sku) searchParams.append("sku", params.sku);
      if (params.category) searchParams.append("category", params.category);
      if (params.brand) searchParams.append("brand", params.brand);
      if (params.page) searchParams.append("page", params.page.toString());
      if (params.size) searchParams.append("size", params.size.toString());
      if (params.sort_by) searchParams.append("sort_by", params.sort_by);
      if (params.sort_dir) searchParams.append("sort_dir", params.sort_dir);

      const queryString = searchParams.toString();
      const url = `${APIConst.API_CONTEXT}${APIConst.SEARCH_PRODUCT}${queryString ? `?${queryString}` : ''}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        return response.data.data;
      } else {
        console.log("Tìm kiếm sản phẩm thất bại");
        return { data: { content: [] } };
      }
    } catch (error) {
      console.error("search products failed", error);
      return { data: { content: [] } };
    }
  },

  // Create a new product
  createProduct: async (access_token: string, product: ProductType) => {
    try {
      const response = await axios.post(
          `${APIConst.API_CONTEXT}${APIConst.GET_ALL_PRODUCTS}`,
          product,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
              "Content-Type": "application/json",
            },
          }
      );

      if (response.status === 201) {
        return response.data.data;
      } else {
        console.log("Tạo sản phẩm thất bại");
        return null;
      }
    } catch (error) {
      console.error("create product failed", error);
      return null;
    }
  },

  // Update an existing product
  updateProduct: async (access_token: string, productId: string, product: ProductType) => {
    try {
      const response = await axios.put(
          `${APIConst.API_CONTEXT}${APIConst.GET_ALL_PRODUCTS}/${productId}`,
          product,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
              "Content-Type": "application/json",
            },
          }
      );

      if (response.status === 200) {
        return response.data.data;
      } else {
        console.log(`Cập nhật sản phẩm với ID ${productId} thất bại`);
        return null;
      }
    } catch (error) {
      console.error(`update product with id ${productId} failed`, error);
      return null;
    }
  },

  // Update product with unified endpoint
  updateProductUnified: async (access_token: string, productId: string, updateRequest: ProductUpdateUnifiedRequest) => {
    try {
      const response = await axios.put(
          `${APIConst.API_CONTEXT}${APIConst.GET_ALL_PRODUCTS}/${productId}/unified`,
          updateRequest,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
              "Content-Type": "application/json",
            },
          }
      );

      if (response.status === 200) {
        return response.data.data;
      } else {
        console.log(`Cập nhật thống nhất sản phẩm với ID ${productId} thất bại`);
        return null;
      }
    } catch (error) {
      console.error(`unified update for product with id ${productId} failed`, error);
      return null;
    }
  },

  // Delete a product
  deleteProduct: async (access_token: string, productId: string) => {
    try {
      const response = await axios.delete(
          `${APIConst.API_CONTEXT}${APIConst.GET_ALL_PRODUCTS}/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
              "Content-Type": "application/json",
            },
          }
      );

      if (response.status === 204) {
        return true;
      } else {
        console.log(`Xóa sản phẩm với ID ${productId} thất bại`);
        return false;
      }
    } catch (error) {
      console.error(`delete product with id ${productId} failed`, error);
      return false;
    }
  },

  // Get product price history
  getPriceHistory: async (access_token: string, productId: string) => {
    try {
      const response = await axios.get(
          `${APIConst.API_CONTEXT}${APIConst.GET_ALL_PRODUCTS}/${productId}/price-history`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
              "Content-Type": "application/json",
            },
          }
      );

      if (response.status === 200) {
        return response.data.data;
      } else {
        console.log(`Lấy lịch sử giá sản phẩm với ID ${productId} thất bại`);
        return [];
      }
    } catch (error) {
      console.error(`get price history for product with id ${productId} failed`, error);
      return [];
    }
  },

  // Get product quantity history
  getQuantityHistory: async (access_token: string, productId: string) => {
    try {
      const response = await axios.get(
          `${APIConst.API_CONTEXT}${APIConst.GET_ALL_PRODUCTS}/${productId}/quantity-history`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
              "Content-Type": "application/json",
            },
          }
      );

      if (response.status === 200) {
        return response.data.data;
      } else {
        console.log(`Lấy lịch sử số lượng sản phẩm với ID ${productId} thất bại`);
        return [];
      }
    } catch (error) {
      console.error(`get quantity history for product with id ${productId} failed`, error);
      return [];
    }
  },
};

export default ProductService;
