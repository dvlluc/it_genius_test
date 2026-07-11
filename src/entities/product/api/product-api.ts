import { apiClient } from "@/shared/api/client";
import type {
  Product,
  ProductListParams,
  ProductsResponse,
} from "@/entities/product/model/types";

export async function fetchProducts(
  params: ProductListParams = {},
): Promise<ProductsResponse> {
  const { data } = await apiClient.get<ProductsResponse>("/products", {
    params: {
      limit: params.limit ?? 10,
      skip: params.skip ?? 0,
      sortBy: params.sortBy,
      order: params.order,
    },
  });
  return data;
}

export async function searchProducts(
  q: string,
  params: Omit<ProductListParams, "q"> = {},
): Promise<ProductsResponse> {
  const { data } = await apiClient.get<ProductsResponse>("/products/search", {
    params: {
      q,
      limit: params.limit ?? 10,
      skip: params.skip ?? 0,
      sortBy: params.sortBy,
      order: params.order,
    },
  });
  return data;
}

export async function fetchProductsByCategory(
  category: string,
  params: Omit<ProductListParams, "category"> = {},
): Promise<ProductsResponse> {
  const { data } = await apiClient.get<ProductsResponse>(
    `/products/category/${encodeURIComponent(category)}`,
    {
      params: {
        limit: params.limit ?? 10,
        skip: params.skip ?? 0,
        sortBy: params.sortBy,
        order: params.order,
      },
    },
  );
  return data;
}

export async function fetchProductCategories(): Promise<string[]> {
  const { data } = await apiClient.get<string[] | { slug: string; name: string }[]>(
    "/products/category-list",
  );
  if (Array.isArray(data) && data.length > 0 && typeof data[0] === "object") {
    return (data as { slug: string }[]).map((item) => item.slug);
  }
  return data as string[];
}

export async function fetchAllProducts(limit = 100): Promise<Product[]> {
  const { data } = await apiClient.get<ProductsResponse>("/products", {
    params: { limit },
  });
  return data.products;
}
