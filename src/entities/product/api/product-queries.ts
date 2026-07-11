import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  fetchAllProducts,
  fetchProductCategories,
  fetchProducts,
  fetchProductsByCategory,
  searchProducts,
} from "@/entities/product/api/product-api";
import type { ProductListParams } from "@/entities/product/model/types";

export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (params: ProductListParams) => [...productKeys.lists(), params] as const,
  categories: () => [...productKeys.all, "categories"] as const,
  allProducts: (limit: number) => [...productKeys.all, "all", limit] as const,
};

export function useProductsQuery(params: ProductListParams) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => {
      if (params.category) {
        return fetchProductsByCategory(params.category, params);
      }
      if (params.q) {
        return searchProducts(params.q, params);
      }
      return fetchProducts(params);
    },
    placeholderData: keepPreviousData,
  });
}

export function useProductCategoriesQuery() {
  return useQuery({
    queryKey: productKeys.categories(),
    queryFn: fetchProductCategories,
    staleTime: 1000 * 60 * 10,
  });
}

export function useAllProductsQuery(limit = 100) {
  return useQuery({
    queryKey: productKeys.allProducts(limit),
    queryFn: () => fetchAllProducts(limit),
  });
}
