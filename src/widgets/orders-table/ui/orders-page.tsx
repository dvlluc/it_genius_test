"use client";

import { useCallback, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useOrdersQuery } from "@/entities/order/api/order-queries";
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

const getOrderRowId = (row: Cart) => row.id;

export function OrdersPage() {
  const t = useTranslations("orders");
  const tCommon = useTranslations("common");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OrderStatus | "all">("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const debouncedSearch = useDebouncedValue(search, 300);

  const query = useOrdersQuery({
    limit: pageSize,
    skip: (page - 1) * pageSize,
  });
  const usersQuery = useAllUsersQuery(100);

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

  const orders = useMemo(() => {
    let rows = [...(query.data?.carts ?? [])];
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      rows = rows.filter((cart) => {
        const buyer = usersById.get(cart.userId)?.toLowerCase() ?? "";
        const items = cart.products.map((p) => p.title.toLowerCase()).join(" ");
        return buyer.includes(q) || items.includes(q) || String(cart.id).includes(q);
      });
    }
    if (status !== "all") {
      rows = rows.filter((cart) => deriveOrderStatus(cart) === status);
    }
    rows.sort((a, b) =>
      sortOrder === "asc"
        ? a.discountedTotal - b.discountedTotal
        : b.discountedTotal - a.discountedTotal,
    );
    return rows;
  }, [query.data?.carts, debouncedSearch, status, sortOrder, usersById]);

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

  const handleSort = useCallback(() => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
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

  const total = query.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="w-full min-w-0 space-y-4">
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

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

      {query.isLoading && !query.isPlaceholderData ? <DataTableSkeleton /> : null}
      {query.isError ? (
        <ErrorState
          title={tCommon("errorTitle")}
          description={tCommon("errorDescription")}
          retryLabel={tCommon("retry")}
          onRetry={() => query.refetch()}
        />
      ) : null}
      {!query.isLoading && !query.isError && orders.length === 0 ? (
        <EmptyState title={tCommon("noResults")} />
      ) : null}
      {orders.length > 0 && !query.isError ? (
        <DataTable
          columns={columns}
          data={orders}
          getRowId={getOrderRowId}
          sortBy="total"
          sortOrder={sortOrder}
          onSort={handleSort}
          estimateSize={72}
          minWidth={900}
        />
      ) : null}

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
    </div>
  );
}
