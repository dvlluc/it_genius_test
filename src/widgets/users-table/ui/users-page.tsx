"use client";

import { useCallback, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { DownloadIcon } from "lucide-react";
import { useUsersQuery } from "@/entities/user/api/user-queries";
import {
  deriveUserStatus,
  getUserFullName,
  type User,
  type UserStatus,
} from "@/entities/user/model/types";
import { UserAvatar } from "@/entities/user/ui/user-avatar";
import { UserStatusBadge } from "@/entities/user/ui/user-status-badge";
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
import { DataTableColumnToggle } from "@/shared/ui/data-table/data-table-column-toggle";
import { DataTableBulkBar } from "@/shared/ui/data-table/data-table-bulk-bar";
import { DataTableSkeleton } from "@/shared/ui/data-table/data-table-skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { useUiSettingsStore, type UserColumnId } from "@/shared/stores/ui-settings";
import { DEFAULT_PAGE_SIZE } from "@/shared/config/constants";
import { exportToCsv } from "@/shared/lib/csv";
import { notify } from "@/shared/lib/notifications";
import { useDebouncedValue } from "@/shared/hooks/use-debounced-value";

const getUserRowId = (row: User) => row.id;

export function UsersPage() {
  const t = useTranslations("users");
  const tCommon = useTranslations("common");
  const tNotify = useTranslations("notifications");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<UserStatus | "all">("all");
  const [country, setCountry] = useState("all");
  const [sortBy, setSortBy] = useState<string>("firstName");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const visibleColumns = useUiSettingsStore((s) => s.userColumns);
  const setUserColumns = useUiSettingsStore((s) => s.setUserColumns);
  const debouncedSearch = useDebouncedValue(search, 300);

  const query = useUsersQuery({
    limit: pageSize,
    skip: (page - 1) * pageSize,
    q: debouncedSearch || undefined,
    sortBy,
    order: sortOrder,
  });

  const statusLabels = useMemo(
    () =>
      ({
        active: t("active"),
        inactive: t("inactive"),
        pending: t("pending"),
      }) satisfies Record<UserStatus, string>,
    [t],
  );

  const countries = useMemo(() => {
    const set = new Set((query.data?.users ?? []).map((u) => u.address.country));
    return Array.from(set).sort();
  }, [query.data?.users]);

  const filteredUsers = useMemo(() => {
    let rows = query.data?.users ?? [];
    if (status !== "all") {
      rows = rows.filter((user) => deriveUserStatus(user) === status);
    }
    if (country !== "all") {
      rows = rows.filter((user) => user.address.country === country);
    }
    return rows;
  }, [query.data?.users, status, country]);

  const columns = useMemo(() => {
    const columnDefs: Record<UserColumnId, DataTableColumn<User>> = {
      avatar: {
        id: "avatar",
        header: t("avatar"),
        width: "52px",
        cell: (user) => <UserAvatar user={user} />,
      },
      name: {
        id: "firstName",
        header: t("name"),
        sortable: true,
        width: "minmax(140px, 1.2fr)",
        cell: (user) => <TableText>{getUserFullName(user)}</TableText>,
      },
      email: {
        id: "email",
        header: t("email"),
        sortable: true,
        width: "minmax(180px, 1.4fr)",
        cell: (user) => <TableText>{user.email}</TableText>,
      },
      phone: {
        id: "phone",
        header: t("phone"),
        width: "minmax(120px, 1fr)",
        cell: (user) => <TableText>{user.phone}</TableText>,
      },
      company: {
        id: "company",
        header: t("company"),
        width: "minmax(120px, 1fr)",
        cell: (user) => <TableText>{user.company.name}</TableText>,
      },
      country: {
        id: "country",
        header: t("country"),
        width: "minmax(100px, 0.8fr)",
        cell: (user) => <TableText>{user.address.country}</TableText>,
      },
      status: {
        id: "status",
        header: t("status"),
        width: "110px",
        cell: (user) => {
          const value = deriveUserStatus(user);
          return <UserStatusBadge status={value} label={statusLabels[value]} />;
        },
      },
      actions: {
        id: "actions",
        header: tCommon("actions"),
        width: "88px",
        cell: () => (
          <Button type="button" variant="ghost" size="sm">
            {tCommon("view")}
          </Button>
        ),
      },
    };

    return visibleColumns.map((id) => columnDefs[id]).filter(Boolean);
  }, [visibleColumns, t, tCommon, statusLabels]);

  const columnToggleOptions = useMemo(
    () => [
      { id: "avatar", label: t("avatar") },
      { id: "name", label: t("name") },
      { id: "email", label: t("email") },
      { id: "phone", label: t("phone") },
      { id: "company", label: t("company") },
      { id: "country", label: t("country") },
      { id: "status", label: t("status") },
      { id: "actions", label: tCommon("actions"), locked: true },
    ],
    [t, tCommon],
  );

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

  const handleStatusChange = useCallback((value: string | null) => {
    setStatus((value as UserStatus | "all") ?? "all");
    setPage(1);
  }, []);

  const handleCountryChange = useCallback((value: string | null) => {
    setCountry(value ?? "all");
    setPage(1);
  }, []);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setPage(1);
  }, []);

  const toggleRow = useCallback((id: string | number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      const numericId = Number(id);
      if (next.has(numericId)) next.delete(numericId);
      else next.add(numericId);
      return next;
    });
  }, []);

  const toggleAll = useCallback(
    (checked: boolean) => {
      setSelectedIds(
        checked ? new Set(filteredUsers.map((user) => user.id)) : new Set(),
      );
    },
    [filteredUsers],
  );

  const clearSelection = useCallback(() => setSelectedIds(new Set()), []);

  const handleColumnsChange = useCallback(
    (ids: string[]) => setUserColumns(ids as UserColumnId[]),
    [setUserColumns],
  );

  const exportSelected = useCallback(() => {
    const source =
      selectedIds.size > 0
        ? filteredUsers.filter((user) => selectedIds.has(user.id))
        : filteredUsers;
    exportToCsv(
      "users.csv",
      source.map((user) => ({
        id: user.id,
        name: getUserFullName(user),
        email: user.email,
        phone: user.phone,
        company: user.company.name,
        country: user.address.country,
        status: deriveUserStatus(user),
      })),
    );
    notify.csvExport(tNotify("csvExported", { filename: "Users" }));
  }, [filteredUsers, selectedIds, tNotify]);

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
          <>
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder={t("filterStatus")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{tCommon("all")}</SelectItem>
                <SelectItem value="active">{t("active")}</SelectItem>
                <SelectItem value="inactive">{t("inactive")}</SelectItem>
                <SelectItem value="pending">{t("pending")}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={country} onValueChange={handleCountryChange}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder={t("filterCountry")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{tCommon("all")}</SelectItem>
                {countries.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        }
        actions={
          <>
            <DataTableColumnToggle
              label={tCommon("columns")}
              columns={columnToggleOptions}
              visibleIds={visibleColumns}
              onChange={handleColumnsChange}
            />
            <Button type="button" variant="outline" size="sm" onClick={exportSelected}>
              <DownloadIcon className="size-4" />
              {tCommon("export")}
            </Button>
          </>
        }
      />

      <DataTableBulkBar
        selectedCount={selectedIds.size}
        selectedLabel={tCommon("selected", { count: selectedIds.size })}
        clearLabel={tCommon("clearSelection")}
        onClear={clearSelection}
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

      {!query.isLoading && !query.isError && filteredUsers.length === 0 ? (
        <EmptyState title={tCommon("noResults")} />
      ) : null}

      {filteredUsers.length > 0 && !query.isError ? (
        <DataTable
          columns={columns}
          data={filteredUsers}
          getRowId={getUserRowId}
          selectedIds={selectedIds}
          onToggleRow={toggleRow}
          onToggleAll={toggleAll}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          estimateSize={56}
          minWidth={1100}
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
