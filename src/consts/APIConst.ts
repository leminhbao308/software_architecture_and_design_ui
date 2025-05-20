const APIConst = {
  API_CONTEXT: "http://localhost:8080/api/v1",
  LOGIN: "/auth/login",
  SIGNUP: "/auth/register",
  REFRESH_TOKEN: "/auth/refresh-token",
  GET_ALL_PRODUCTS: "/products",
  GET_PRODUCT_BY_ID: "/products",
  SEARCH_PRODUCT: "/products/search",
  GET_USER_INFO: "/auth/token/userinfo",
  GET_CART: "/cart",

  // Admin APIs
  GET_SERVICES_STATUS: "/admin/cb-check/all",

  // Category APIs
  GET_ALL_CATEGORIES: "/categories",
  CREATE_CATEGORY: "/categories/create",
  UPDATE_CATEGORY: "/categories/{id}/update",
  DELETE_CATEGORY: "/categories/{id}/delete",
  GET_CATEGORY_BY_ID: "/categories/{id}",
  DELETE_CATEGORY_WITH_CHILDREN: "/categories/{id}/delete-with-children",
  GET_SUBCATEGORIES: "/categories/{id}/subcategories",

  // Report APIs
  EXPORT_REVENUE_REPORT: "/report/export-pdf",
};

export default APIConst;
