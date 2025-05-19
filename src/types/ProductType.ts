export interface ProductType {
  id: string;
  productId: string;

  name: string;
  sku: string;
  description: string;
  brand: string;
  thumbnailUrl: string;
  imageUrls?: string[];

  mainCategoryId: string;
  additionalCategories: string[];

  basePrice: number;
  currentPrice: number;
  costPrice: number;

  totalQuantity: number;
  availableQuantity: number;
  reservedQuantity: number;

  priceHistory?: PriceHistory[];
  quantityHistory?: QuantityHistory[];

  additionalAttributes?: Record<string, never>;

  status: "ACTIVE" | "INACTIVE" | "OUT_OF_STOCK" | "DISCONTINUED";
  createdAt: string;
  updatedAt: string;
}

interface PriceHistory {
  oldPrice: number;
  newPrice: number;
  changeReason: string;
  changedBy: string;
  timestamp: string;
}

interface QuantityHistory {
  oldQuantity: number;
  newQuantity: number;
  changeReason: string;
  changedBy: string;
  timestamp: string;
}
