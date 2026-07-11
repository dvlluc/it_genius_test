import { apiClient } from "@/shared/api/client";
import type { Cart, CartsResponse, OrderListParams } from "@/entities/order/model/types";

export async function fetchCarts(
  params: OrderListParams = {},
): Promise<CartsResponse> {
  const { data } = await apiClient.get<CartsResponse>("/carts", {
    params: {
      limit: params.limit ?? 10,
      skip: params.skip ?? 0,
    },
  });
  return data;
}

export async function fetchAllCarts(limit = 100): Promise<Cart[]> {
  const { data } = await apiClient.get<CartsResponse>("/carts", {
    params: { limit },
  });
  return data.carts;
}

export async function fetchCartById(id: number): Promise<Cart> {
  const { data } = await apiClient.get<Cart>(`/carts/${id}`);
  return data;
}
