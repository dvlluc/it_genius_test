import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchAllCarts, fetchCarts } from "@/entities/order/api/order-api";
import type { OrderListParams } from "@/entities/order/model/types";

export const orderKeys = {
  all: ["orders"] as const,
  lists: () => [...orderKeys.all, "list"] as const,
  list: (params: OrderListParams) => [...orderKeys.lists(), params] as const,
  allOrders: (limit: number) => [...orderKeys.all, "all", limit] as const,
};

export function useOrdersQuery(params: OrderListParams) {
  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: () => fetchCarts(params),
    placeholderData: keepPreviousData,
  });
}

export function useAllOrdersQuery(limit = 100) {
  return useQuery({
    queryKey: orderKeys.allOrders(limit),
    queryFn: () => fetchAllCarts(limit),
  });
}
