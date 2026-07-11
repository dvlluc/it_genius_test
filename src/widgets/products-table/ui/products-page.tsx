"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { LoaderIcon } from "lucide-react";
import {
  useProductCategoriesQuery,
  useProductsQuery,
} from "@/entities/product/api/product-queries";
import { useProductsInfiniteQuery } from "@/entities/product/api/product-infinite-queries";
import type { Product } from "@/entities/product/model/types";
import { ProductThumbnail } from "@/entities/product/ui/product-thumbnail";
import { ProductRating } from "@/entities/product/ui/product-rating";
import { StockBadge } from "@/entities/product/ui/stock-badge";
import { PageHeader } from "@/shared/ui/page-header";
import { Button } from "@/shared/ui/button";
import { EmptyState } from "@/shared/ui/empty-state";
import { ErrorState } from "@/shared/ui/error-state";
import {
  DataTable,
  TableText,
  type DataTableColumn,
} from "@/shared/ui/data-table/data-table";
import { DataTableToolbar } from "@/shared/ui/data-table/data-table-toolbar";
import { DataTablePagination } from "@/shared/ui/data-table/data-table-pagination";
import { DataTableSkeleton } from "@/shared/ui/data-table/data-table-skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Input } from "@/shared/ui/input";
import { DEFAULT_PAGE_SIZE } from "@/shared/config/constants";
import { formatCurrency, formatPercent } from "@/shared/lib/formatters";
import { useDebouncedValue } from "@/shared/hooks/use-debounced-value";

type ViewMode = "paginated" | "infinite";

const getProductRowId = (row: Product) => row.id;

function useProductColumns() {
  const t = useTranslations("products");
  const lowLabel = t("lowStock");
  const inStockLabel = t("inStock");

  return useMemo<DataTableColumn<Product>[]>(
    () => [
      {
        id: "image",
        header: "",
        width: "56px",
        cell: (product) => (
          <ProductThumbnail src={product.thumbnail} alt={product.title} />
        ),
      },
      {
        id: "title",
        header: t("name"),
        sortable: true,
        width: "minmax(160px, 1.6fr)",
        cell: (product) => <TableText>{product.title}</TableText>,
      },
      {
        id: "category",
        header: t("category"),
        width: "minmax(110px, 1fr)",
        cell: (product) => <TableText>{product.category}</TableText>,
      },
      {
        id: "price",
        header: t("price"),
        sortable: true,
        width: "100px",
        cell: (product) => <TableText>{formatCurrency(product.price)}</TableText>,
      },
      {
        id: "discountPercentage",
        header: t("discount"),
        width: "90px",
        cell: (product) => (
          <TableText>{formatPercent(product.discountPercentage)}</TableText>
        ),
      },
      {
        id: "rating",
        header: t("rating"),
        sortable: true,
        width: "90px",
        cell: (product) => <ProductRating value={product.rating} />,
      },
      {
        id: "stock",
        header: t("stock"),
        width: "130px",
        cell: (product) => (
          <StockBadge
            stock={product.stock}
            lowLabel={lowLabel}
            inStockLabel={inStockLabel}
          />
        ),
      },
    ],
    [t, lowLabel, inStockLabel],
  );
}

export function ProductsPage() {
  const t = useTranslations("products");
  const tCommon = useTranslations("common");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [viewMode, setViewMode] = useState<ViewMode>("paginated");
  const debouncedSearch = useDebouncedValue(search, 300);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const categoriesQuery = useProductCategoriesQuery();
  const columns = useProductColumns();

  const query = useProductsQuery({
    limit: pageSize,
    skip: (page - 1) * pageSize,
    q: debouncedSearch || undefined,
    category: category === "all" ? undefined : category,
    sortBy,
    order: sortOrder,
  });

  const infiniteQuery = useProductsInfiniteQuery({
    limit: pageSize,
    q: debouncedSearch || undefined,
    category: category === "all" ? undefined : category,
    sortBy,
    order: sortOrder,
  });

  const paginatedProducts = useMemo(() => {
    let rows = query.data?.products ?? [];
    const price = Number(maxPrice);
    const rating = Number(minRating);
    if (!Number.isNaN(price) && maxPrice !== "") {
      rows = rows.filter((product) => product.price <= price);
    }
    if (!Number.isNaN(rating) && minRating !== "") {
      rows = rows.filter((product) => product.rating >= rating);
    }
    return rows;
  }, [query.data?.products, maxPrice, minRating]);

  const infiniteProducts = useMemo(() => {
    const allProducts = infiniteQuery.data?.pages.flatMap((p) => p.products) ?? [];
    let rows = allProducts;
    const price = Number(maxPrice);
    const rating = Number(minRating);
    if (!Number.isNaN(price) && maxPrice !== "") {
      rows = rows.filter((product) => product.price <= price);
    }
    if (!Number.isNaN(rating) && minRating !== "") {
      rows = rows.filter((product) => product.rating >= rating);
    }
    return rows;
  }, [infiniteQuery.data, maxPrice, minRating]);

  const products = viewMode === "paginated" ? paginatedProducts : infiniteProducts;
  const total = viewMode === "paginated" ? (query.data?.total ?? 0) : infiniteProducts.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const isLoading = viewMode === "paginated" ? query.isLoading : infiniteQuery.isLoading;
  const isError = viewMode === "paginated" ? query.isError : infiniteQuery.isError;
  const activeQuery = viewMode === "paginated" ? query : infiniteQuery;

  const handleSort = useCallback((columnId: string) => {
    setSortBy((prev) => {
      if (prev === columnId) {
        setSortOrder((order) => (order === "asc" ? "desc" : "asc"));
        return prev;
      }
      setSortOrder("asc");
      return columnId;
    });
    setPage(1);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleCategoryChange = useCallback((value: string | null) => {
    setCategory(value ?? "all");
    setPage(1);
  }, []);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setPage(1);
  }, []);

  const toggleViewMode = useCallback(() => {
    setViewMode((prev) => (prev === "paginated" ? "infinite" : "paginated"));
    setPage(1);
  }, []);

  return (
    <div className="w-full min-w-0 space-y-4">
      <PageHeader
        title={t("title")}
        subtitle={t("subtitle")}
        actions={
          <Button type="button" variant="outline" size="sm" onClick={toggleViewMode}>
            {viewMode === "paginated" ? "Infinite Scroll" : "Paginated"}
          </Button>
        }
      />

      <DataTableToolbar
        search={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder={tCommon("search")}
        filters={
          <>
            <Select value={category} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder={t("filterCategory")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{tCommon("all")}</SelectItem>
                {(categoriesQuery.data ?? []).map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              min={0}
              placeholder={t("filterPrice")}
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(e.target.value);
                setPage(1);
              }}
              className="w-full sm:w-[140px]"
              aria-label={t("filterPrice")}
            />
            <Input
              type="number"
              min={0}
              max={5}
              step={0.1}
              placeholder={t("filterRating")}
              value={minRating}
              onChange={(e) => {
                setMinRating(e.target.value);
                setPage(1);
              }}
              className="w-full sm:w-[140px]"
              aria-label={t("filterRating")}
            />
          </>
        }
      />

      {isLoading && !activeQuery.isPlaceholderData ? <DataTableSkeleton /> : null}
      {isError ? (
        <ErrorState
          title={tCommon("errorTitle")}
          description={tCommon("errorDescription")}
          retryLabel={tCommon("retry")}
          onRetry={() => activeQuery.refetch()}
        />
      ) : null}
      {!isLoading && !isError && products.length === 0 ? (
        <EmptyState title={tCommon("noResults")} />
      ) : null}
      {products.length > 0 && !isError ? (
        <DataTable
          columns={columns}
          data={products}
          getRowId={getProductRowId}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          estimateSize={64}
          minWidth={980}
        />
      ) : null}

      {viewMode === "infinite" && infiniteQuery.hasNextPage && !infiniteQuery.isFetchingNextPage && (
        <div ref={loadMoreRef} className="flex justify-center py-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => infiniteQuery.fetchNextPage()}
          >
            {tCommon("loading")}
          </Button>
        </div>
      )}
      {viewMode === "infinite" && infiniteQuery.isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <LoaderIcon className="size-5 animate-spin text-muted-foreground" />
        </div>
      )}

      {viewMode === "paginated" && (
        <DataTablePagination
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={setPage}
          onPageSizeChange={handlePageSizeChange}
          previousLabel={tCommon("previous")}
          nextLabel={tCommon("next")}
          pageLabel={tCommon("page", { page, total: totalPages })}
          rowsLabel={tCommon("rowsPerPage")}
        />
      )}
    </div>
  );
}
