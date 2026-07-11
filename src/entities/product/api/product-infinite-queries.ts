import { useInfiniteQuery } from "@tanstack/react-query";
import {
  fetchProducts,
  fetchProductsByCategory,
  searchProducts,
} from "@/entities/product/api/product-api";
import type { ProductListParams } from "@/entities/product/model/types";

export const productInfiniteKeys = {
  all: ["products", "infinite"] as const,
  list: (params: Omit<ProductListParams, "skip">) =>
    [...productInfiniteKeys.all, params] as const,
};

type ProductInfiniteParams = Omit<ProductListParams, "skip"> & {
  limit?: number;
};

export function useProductsInfiniteQuery(params: ProductInfiniteParams) {
  const { limit = 20, ...rest } = params;

  return useInfiniteQuery({
    queryKey: productInfiniteKeys.list(rest),
    queryFn: ({ pageParam = 0 }) => {
      const baseParams = { ...rest, limit, skip: pageParam };
      if (rest.category) {
        return fetchProductsByCategory(rest.category, baseParams);
      }
      if (rest.q) {
        return searchProducts(rest.q, baseParams);
      }
      return fetchProducts(baseParams);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((sum, page) => sum + page.products.length, 0);
      return loaded < lastPage.total ? loaded : undefined;
    },
  });
}
