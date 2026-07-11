import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchCarts } from "@/entities/order/api/order-api";
import type { OrderListParams } from "@/entities/order/model/types";

export const orderInfiniteKeys = {
  all: ["orders", "infinite"] as const,
  list: (params: Omit<OrderListParams, "skip">) =>
    [...orderInfiniteKeys.all, params] as const,
};

type OrderInfiniteParams = Omit<OrderListParams, "skip"> & {
  limit?: number;
};

export function useOrdersInfiniteQuery(params: OrderInfiniteParams) {
  const { limit = 20, ...rest } = params;

  return useInfiniteQuery({
    queryKey: orderInfiniteKeys.list(rest),
    queryFn: ({ pageParam = 0 }) =>
      fetchCarts({ ...rest, limit, skip: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((sum, page) => sum + page.carts.length, 0);
      return loaded < lastPage.total ? loaded : undefined;
    },
  });
}
