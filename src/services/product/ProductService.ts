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
        return response.data;
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
          `${APIConst.API_CONTEXT}${APIConst.GET_PRODUCT_BY_ID}/${productId}`,
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
        return response.data;
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
        return response.data;
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
        return response.data;
      } else {
        console.log(`Cập nhật sản phẩm với ID ${productId} thất bại`);
        return null;
      }
    } catch (error) {
      console.error(`update product with id ${productId} failed`, error);
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

  // Update product price
  updateProductPrice: async (access_token: string, productId: string, params: PriceUpdateParams) => {
    try {
      const urlParams = new URLSearchParams();
      urlParams.append("newPrice", params.newPrice.toString());
      if (params.reason) urlParams.append("reason", params.reason);
      if (params.changedBy) urlParams.append("changedBy", params.changedBy);

      const response = await axios.put(
          `${APIConst.API_CONTEXT}${APIConst.GET_ALL_PRODUCTS}/${productId}/price?${urlParams.toString()}`,
          {},
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
        console.log(`Cập nhật giá sản phẩm với ID ${productId} thất bại`);
        return null;
      }
    } catch (error) {
      console.error(`update price for product with id ${productId} failed`, error);
      return null;
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
        return response.data;
      } else {
        console.log(`Lấy lịch sử giá sản phẩm với ID ${productId} thất bại`);
        return [];
      }
    } catch (error) {
      console.error(`get price history for product with id ${productId} failed`, error);
      return [];
    }
  },

  // Update product inventory
  updateProductInventory: async (access_token: string, productId: string, params: InventoryUpdateParams) => {
    try {
      const urlParams = new URLSearchParams();
      urlParams.append("newQuantity", params.newQuantity.toString());
      if (params.reason) urlParams.append("reason", params.reason);
      if (params.changedBy) urlParams.append("changedBy", params.changedBy);

      const response = await axios.put(
          `${APIConst.API_CONTEXT}${APIConst.GET_ALL_PRODUCTS}/${productId}/inventory?${urlParams.toString()}`,
          {},
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
        console.log(`Cập nhật số lượng sản phẩm với ID ${productId} thất bại`);
        return null;
      }
    } catch (error) {
      console.error(`update inventory for product with id ${productId} failed`, error);
      return null;
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
        return response.data;
      } else {
        console.log(`Lấy lịch sử số lượng sản phẩm với ID ${productId} thất bại`);
        return [];
      }
    } catch (error) {
      console.error(`get quantity history for product with id ${productId} failed`, error);
      return [];
    }
  },

  // Category management
  setMainCategory: async (access_token: string, productId: string, categoryId: string) => {
    try {
      const response = await axios.put(
          `${APIConst.API_CONTEXT}${APIConst.GET_ALL_PRODUCTS}/${productId}/main-category/${categoryId}`,
          {},
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
        console.log(`Thiết lập danh mục chính cho sản phẩm với ID ${productId} thất bại`);
        return null;
      }
    } catch (error) {
      console.error(`set main category for product with id ${productId} failed`, error);
      return null;
    }
  },

  addCategory: async (access_token: string, productId: string, categoryId: string) => {
    try {
      const response = await axios.post(
          `${APIConst.API_CONTEXT}${APIConst.GET_ALL_PRODUCTS}/${productId}/categories/${categoryId}`,
          {},
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
        console.log(`Thêm danh mục cho sản phẩm với ID ${productId} thất bại`);
        return null;
      }
    } catch (error) {
      console.error(`add category for product with id ${productId} failed`, error);
      return null;
    }
  },

  removeCategory: async (access_token: string, productId: string, categoryId: string) => {
    try {
      const response = await axios.delete(
          `${APIConst.API_CONTEXT}${APIConst.GET_ALL_PRODUCTS}/${productId}/categories/${categoryId}`,
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
        console.log(`Xóa danh mục cho sản phẩm với ID ${productId} thất bại`);
        return null;
      }
    } catch (error) {
      console.error(`remove category for product with id ${productId} failed`, error);
      return null;
    }
  },

  getProductCategories: async (access_token: string, productId: string) => {
    try {
      const response = await axios.get(
          `${APIConst.API_CONTEXT}${APIConst.GET_ALL_PRODUCTS}/${productId}/categories`,
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
        console.log(`Lấy danh mục cho sản phẩm với ID ${productId} thất bại`);
        return [];
      }
    } catch (error) {
      console.error(`get categories for product with id ${productId} failed`, error);
      return [];
    }
  },

  // Status management
  updateProductStatus: async (access_token: string, productId: string, status: string) => {
    try {
      const response = await axios.put(
          `${APIConst.API_CONTEXT}${APIConst.GET_ALL_PRODUCTS}/${productId}/status?status=${status}`,
          {},
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
        console.log(`Cập nhật trạng thái sản phẩm với ID ${productId} thất bại`);
        return null;
      }
    } catch (error) {
      console.error(`update status for product with id ${productId} failed`, error);
      return null;
    }
  },

  // Batch operations
  createProducts: async (access_token: string, products: ProductType[]) => {
    try {
      const response = await axios.post(
          `${APIConst.API_CONTEXT}${APIConst.GET_ALL_PRODUCTS}/batch`,
          products,
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
        console.log("Tạo hàng loạt sản phẩm thất bại");
        return [];
      }
    } catch (error) {
      console.error("create batch products failed", error);
      return [];
    }
  },

  getProductsByCategory: async (access_token: string, categoryId: string, page: number = 1, size: number = 20, sortBy: string = "name", sortDir: string = "asc") => {
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("size", size.toString());
      params.append("sort_by", sortBy);
      params.append("sort_dir", sortDir);

      const response = await axios.get(
          `${APIConst.API_CONTEXT}${APIConst.GET_ALL_PRODUCTS}/category/${categoryId}?${params.toString()}`,
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
        console.log(`Lấy sản phẩm theo danh mục ${categoryId} thất bại`);
        return {content: [], totalElements: 0, totalPages: 0};
      }
    } catch (error) {
      console.error(`get products by category ${categoryId} failed`, error);
      return {content: [], totalElements: 0, totalPages: 0};
    }
  },

  getProductsByBrand: async (access_token: string, brand: string, page: number = 1, size: number = 20, sortBy: string = "name", sortDir: string = "asc") => {
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("size", size.toString());
      params.append("sort_by", sortBy);
      params.append("sort_dir", sortDir);

      const response = await axios.get(
          `${APIConst.API_CONTEXT}${APIConst.GET_ALL_PRODUCTS}/brand/${brand}?${params.toString()}`,
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
        console.log(`Lấy sản phẩm theo thương hiệu ${brand} thất bại`);
        return {content: [], totalElements: 0, totalPages: 0};
      }
    } catch (error) {
      console.error(`get products by brand ${brand} failed`, error);
      return {content: [], totalElements: 0, totalPages: 0};
    }
  },

  // Additional attributes management
  updateProductAttributes: async (access_token: string, productId: string, attributes: Record<string, never>) => {
    try {
      const response = await axios.put(
          `${APIConst.API_CONTEXT}${APIConst.GET_ALL_PRODUCTS}/${productId}/attributes`,
          attributes,
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
        console.log(`Cập nhật thuộc tính sản phẩm với ID ${productId} thất bại`);
        return null;
      }
    } catch (error) {
      console.error(`update attributes for product with id ${productId} failed`, error);
      return null;
    }
  },

  removeProductAttribute: async (access_token: string, productId: string, key: string) => {
    try {
      const response = await axios.delete(
          `${APIConst.API_CONTEXT}${APIConst.GET_ALL_PRODUCTS}/${productId}/attributes/${key}`,
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
        console.log(`Xóa thuộc tính "${key}" cho sản phẩm với ID ${productId} thất bại`);
        return null;
      }
    } catch (error) {
      console.error(`remove attribute "${key}" for product with id ${productId} failed`, error);
      return null;
    }
  },

  // File operations
  uploadFile: async (access_token: string, params: FileUploadParams) => {
    try {
      const formData = new FormData();
      formData.append("file", params.file);
      formData.append("productId", params.productId);

      const response = await axios.post(
          `${APIConst.API_CONTEXT}${APIConst.GET_ALL_PRODUCTS}/files/upload`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
              "Content-Type": "multipart/form-data",
            },
          }
      );

      if (response.status === 201) {
        return response.data;
      } else {
        console.log(`Tải lên tệp cho sản phẩm với ID ${params.productId} thất bại`);
        return null;
      }
    } catch (error) {
      console.error(`upload file for product with id ${params.productId} failed`, error);
      return null;
    }
  },

  listFiles: async (access_token: string) => {
    try {
      const response = await axios.get(
          `${APIConst.API_CONTEXT}${APIConst.GET_ALL_PRODUCTS}/files`,
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
        console.log("Lấy danh sách tệp thất bại");
        return [];
      }
    } catch (error) {
      console.error("list files failed", error);
      return [];
    }
  },

  getFileUrl: async (access_token: string, fileName: string) => {
    try {
      const response = await axios.get(
          `${APIConst.API_CONTEXT}${APIConst.GET_ALL_PRODUCTS}/files/download?fileName=${fileName}`,
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
        console.log(`Lấy URL tệp ${fileName} thất bại`);
        return null;
      }
    } catch (error) {
      console.error(`get file URL for ${fileName} failed`, error);
      return null;
    }
  },

  deleteFile: async (access_token: string, fileName: string) => {
    try {
      const response = await axios.delete(
          `${APIConst.API_CONTEXT}${APIConst.GET_ALL_PRODUCTS}/files?fileName=${fileName}`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
              "Content-Type": "application/json",
            },
          }
      );

      if (response.status === 200) {
        return true;
      } else {
        console.log(`Xóa tệp ${fileName} thất bại`);
        return false;
      }
    } catch (error) {
      console.error(`delete file ${fileName} failed`, error);
      return false;
    }
  }
};

export default ProductService;
