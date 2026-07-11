"use client";

import { useCallback, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { LoaderIcon } from "lucide-react";
import { useOrdersQuery } from "@/entities/order/api/order-queries";
import { useOrdersInfiniteQuery } from "@/entities/order/api/order-infinite-queries";
import { useAllUsersQuery } from "@/entities/user/api/user-queries";
import {
  deriveOrderStatus,
  type Cart,
  type OrderStatus,
} from "@/entities/order/model/types";
import { getUserFullName } from "@/entities/user/model/types";
import { OrderItemsList } from "@/entities/order/ui/order-items-list";
import { OrderStatusBadge } from "@/entities/order/ui/order-status-badge";
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
import { DEFAULT_PAGE_SIZE } from "@/shared/config/constants";
import { formatCurrency } from "@/shared/lib/formatters";
import { useDebouncedValue } from "@/shared/hooks/use-debounced-value";

type ViewMode = "paginated" | "infinite";

const getOrderRowId = (row: Cart) => row.id;

export function OrdersPage() {
  const t = useTranslations("orders");
  const tCommon = useTranslations("common");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OrderStatus | "all">("all");
  const [sort, setSort] = useState<{ by: string; order: "asc" | "desc" }>({
    by: "total",
    order: "desc",
  });
  const [viewMode, setViewMode] = useState<ViewMode>("paginated");
  const debouncedSearch = useDebouncedValue(search, 300);

  const usersQuery = useAllUsersQuery(100);

  const query = useOrdersQuery({
    limit: pageSize,
    skip: (page - 1) * pageSize,
  });

  const infiniteQuery = useOrdersInfiniteQuery({
    limit: pageSize,
  });

  const usersById = useMemo(() => {
    const map = new Map<number, string>();
    for (const user of usersQuery.data ?? []) {
      map.set(user.id, getUserFullName(user));
    }
    return map;
  }, [usersQuery.data]);

  const statusLabels = useMemo(
    () =>
      ({
        pending: t("pending"),
        processing: t("processing"),
        shipped: t("shipped"),
        delivered: t("delivered"),
        cancelled: t("cancelled"),
      }) satisfies Record<OrderStatus, string>,
    [t],
  );

  const filterOrders = useCallback(
    (rows: Cart[]) => {
      let filtered = rows;
      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase();
        filtered = filtered.filter((cart) => {
          const buyer = usersById.get(cart.userId)?.toLowerCase() ?? "";
          const items = cart.products.map((p) => p.title.toLowerCase()).join(" ");
          return buyer.includes(q) || items.includes(q) || String(cart.id).includes(q);
        });
      }
      if (status !== "all") {
        filtered = filtered.filter((cart) => deriveOrderStatus(cart) === status);
      }
      return filtered;
    },
    [debouncedSearch, status, usersById],
  );

  const sortOrders = useCallback(
    (rows: Cart[]) => {
      return [...rows].sort((a, b) =>
        sort.order === "asc"
          ? a.discountedTotal - b.discountedTotal
          : b.discountedTotal - a.discountedTotal,
      );
    },
    [sort.order],
  );

  const paginatedOrders = useMemo(() => {
    return sortOrders(filterOrders(query.data?.carts ?? []));
  }, [query.data?.carts, filterOrders, sortOrders]);

  const infiniteOrders = useMemo(() => {
    const allCarts = infiniteQuery.data?.pages.flatMap((p) => p.carts) ?? [];
    return sortOrders(filterOrders(allCarts));
  }, [infiniteQuery.data, filterOrders, sortOrders]);

  const {
    hasNextPage: infiniteHasNextPage,
    isFetchingNextPage: infiniteIsFetchingNextPage,
    fetchNextPage: infiniteFetchNextPage,
  } = infiniteQuery;

  const handleNearEnd = useCallback(() => {
    if (infiniteHasNextPage && !infiniteIsFetchingNextPage) {
      infiniteFetchNextPage();
    }
  }, [infiniteHasNextPage, infiniteIsFetchingNextPage, infiniteFetchNextPage]);

  const orders = viewMode === "paginated" ? paginatedOrders : infiniteOrders;
  const total = viewMode === "paginated" ? (query.data?.total ?? 0) : infiniteOrders.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const isLoading = viewMode === "paginated" ? query.isLoading : infiniteQuery.isLoading;
  const isError = viewMode === "paginated" ? query.isError : infiniteQuery.isError;
  const activeQuery = viewMode === "paginated" ? query : infiniteQuery;

  const columns = useMemo<DataTableColumn<Cart>[]>(
    () => [
      {
        id: "id",
        header: "#",
        width: "64px",
        cell: (cart) => <TableText>{cart.id}</TableText>,
      },
      {
        id: "buyer",
        header: t("buyer"),
        width: "minmax(140px, 1.1fr)",
        cell: (cart) => (
          <TableText>
            {usersById.get(cart.userId) ?? `User #${cart.userId}`}
          </TableText>
        ),
      },
      {
        id: "items",
        header: t("items"),
        width: "minmax(180px, 1.6fr)",
        cell: (cart) => <OrderItemsList products={cart.products} />,
      },
      {
        id: "quantity",
        header: t("quantity"),
        width: "88px",
        cell: (cart) => <TableText>{cart.totalQuantity}</TableText>,
      },
      {
        id: "total",
        header: t("total"),
        sortable: true,
        width: "110px",
        cell: (cart) => (
          <TableText>{formatCurrency(cart.discountedTotal)}</TableText>
        ),
      },
      {
        id: "status",
        header: t("status"),
        width: "120px",
        cell: (cart) => {
          const value = deriveOrderStatus(cart);
          return <OrderStatusBadge status={value} label={statusLabels[value]} />;
        },
      },
    ],
    [t, usersById, statusLabels],
  );

  const handleSort = useCallback((columnId: string) => {
    setSort((prev) => ({
      by: columnId,
      order: prev.by === columnId ? (prev.order === "asc" ? "desc" : "asc") : "asc",
    }));
    setPage(1);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleStatusChange = useCallback((value: string | null) => {
    setStatus((value as OrderStatus | "all") ?? "all");
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
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder={t("filterStatus")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{tCommon("all")}</SelectItem>
              {(Object.keys(statusLabels) as OrderStatus[]).map((key) => (
                <SelectItem key={key} value={key}>
                  {statusLabels[key]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
      {!isLoading && !isError && orders.length === 0 ? (
        <EmptyState title={tCommon("noResults")} />
      ) : null}
      {orders.length > 0 && !isError ? (
        <DataTable
          columns={columns}
          data={orders}
          getRowId={getOrderRowId}
          sortBy={sort.by}
          sortOrder={sort.order}
          onSort={handleSort}
          estimateSize={72}
          minWidth={900}
          onNearEnd={viewMode === "infinite" ? handleNearEnd : undefined}
        />
      ) : null}

      {viewMode === "infinite" && infiniteQuery.isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <LoaderIcon className="size-5 animate-spin text-muted-foreground" />
        </div>
      )}
      {viewMode === "infinite" && !infiniteQuery.hasNextPage && orders.length > 0 && (
        <p className="text-center text-sm text-muted-foreground">{tCommon("noResults")}</p>
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
