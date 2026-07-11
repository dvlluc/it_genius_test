export type CartProduct = {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountPercentage: number;
  discountedTotal: number;
  thumbnail: string;
};

export type Cart = {
  id: number;
  products: CartProduct[];
  total: number;
  discountedTotal: number;
  userId: number;
  totalProducts: number;
  totalQuantity: number;
};

export type CartsResponse = {
  carts: Cart[];
  total: number;
  skip: number;
  limit: number;
};

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type OrderListParams = {
  limit?: number;
  skip?: number;
  q?: string;
  sortBy?: string;
  order?: "asc" | "desc";
};

export function deriveOrderStatus(cart: Cart): OrderStatus {
  const statuses: OrderStatus[] = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];
  return statuses[cart.id % statuses.length];
}
