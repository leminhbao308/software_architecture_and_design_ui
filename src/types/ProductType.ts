export interface ProductType {
  id: string;
  productId: string;
  name: string;
  sku: string;
  description: string;
  brand: string;
  mainCategoryId: string;
  additionalCategories: string[];
  basePrice: number;
  currentPrice: number;
  costPrice: number;
  totalQuantity: number;
  availableQuantity: number;
  reservedQuantity: number;
  priceHistory?: any; // Nếu cần kiểu dữ liệu cụ thể, hãy cập nhật
  quantityHistory?: any;
  additionalAttributes: {
    processor: string;
    ram: string;
    storage: string;
    screen_size?: string; // Dấu `?` để cho phép không bắt buộc
  };
  status: string;
  createdAt: string;
  updatedAt: string;
}
