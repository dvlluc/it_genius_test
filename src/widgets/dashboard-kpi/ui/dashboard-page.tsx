"use client";

import { useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  DownloadIcon,
  PackageIcon,
  ShoppingCartIcon,
  StarIcon,
  TriangleAlertIcon,
  UsersIcon,
  WalletIcon,
} from "lucide-react";
import { useAllUsersQuery } from "@/entities/user/api/user-queries";
import { useAllProductsQuery } from "@/entities/product/api/product-queries";
import { useAllOrdersQuery } from "@/entities/order/api/order-queries";
import { PageHeader } from "@/shared/ui/page-header";
import { Button } from "@/shared/ui/button";
import { StatCard } from "@/shared/ui/stat-card";
import { ErrorState } from "@/shared/ui/error-state";
import { Skeleton } from "@/shared/ui/skeleton";
import { formatCurrency, formatNumber, formatRating } from "@/shared/lib/formatters";
import { exportToCsv } from "@/shared/lib/csv";
import {
  buildCategoryDistribution,
  buildMonthlySeries,
  buildTopProducts,
  buildUsersByCountry,
  computeAverageRating,
  computeLowStockCount,
  computeRevenue,
} from "@/shared/lib/analytics";
import {
  DynamicCategoryBarChart,
  DynamicCountryPieChart,
  DynamicOrdersAreaChart,
  DynamicRevenueLineChart,
  DynamicTopProductsBarChart,
} from "@/widgets/dashboard-charts/ui/charts";
import { RecentActivity } from "@/widgets/recent-activity/ui/recent-activity";
import { DashboardGrid } from "@/widgets/dashboard-grid/ui/dashboard-grid";
import { getUserFullName } from "@/entities/user/model/types";

export function DashboardPage() {
  const t = useTranslations("dashboard");
  const tCommon = useTranslations("common");
  const usersQuery = useAllUsersQuery(100);
  const productsQuery = useAllProductsQuery(100);
  const ordersQuery = useAllOrdersQuery(100);

  const isLoading =
    usersQuery.isLoading || productsQuery.isLoading || ordersQuery.isLoading;
  const isError = usersQuery.isError || productsQuery.isError || ordersQuery.isError;

  const users = useMemo(() => usersQuery.data ?? [], [usersQuery.data]);
  const products = useMemo(() => productsQuery.data ?? [], [productsQuery.data]);
  const carts = useMemo(() => ordersQuery.data ?? [], [ordersQuery.data]);

  const kpis = useMemo(
    () => [
      {
        title: t("totalUsers"),
        value: formatNumber(usersQuery.data ? users.length : 0),
        icon: UsersIcon,
      },
      {
        title: t("totalProducts"),
        value: formatNumber(products.length),
        icon: PackageIcon,
      },
      {
        title: t("totalOrders"),
        value: formatNumber(carts.length),
        icon: ShoppingCartIcon,
      },
      {
        title: t("totalRevenue"),
        value: formatCurrency(computeRevenue(carts)),
        icon: WalletIcon,
      },
      {
        title: t("avgRating"),
        value: formatRating(computeAverageRating(products)),
        icon: StarIcon,
      },
      {
        title: t("lowStock"),
        value: formatNumber(computeLowStockCount(products)),
        icon: TriangleAlertIcon,
      },
    ],
    [t, users, products, carts, usersQuery.data],
  );

  const monthly = useMemo(() => buildMonthlySeries(carts), [carts]);
  const byCountry = useMemo(() => buildUsersByCountry(users), [users]);
  const byCategory = useMemo(() => buildCategoryDistribution(products), [products]);
  const topProducts = useMemo(() => buildTopProducts(products, carts), [products, carts]);

  const handleExport = useCallback(() => {
    const kpiRows = [
      { metric: "Total Users", value: users.length },
      { metric: "Total Products", value: products.length },
      { metric: "Total Orders", value: carts.length },
      { metric: "Total Revenue", value: Math.round(computeRevenue(carts)) },
      { metric: "Avg Rating", value: Number(computeAverageRating(products).toFixed(1)) },
      { metric: "Low Stock Items", value: computeLowStockCount(products) },
    ];
    const monthlyRows = monthly.map((m) => ({
      month: m.month,
      revenue: m.revenue,
      orders: m.orders,
    }));
    exportToCsv("dashboard-kpi.csv", kpiRows);
    exportToCsv("dashboard-monthly.csv", monthlyRows);
  }, [users, products, carts, monthly]);

  if (isError) {
    return (
      <ErrorState
        title={tCommon("errorTitle")}
        description={tCommon("errorDescription")}
        retryLabel={tCommon("retry")}
        onRetry={() => {
          usersQuery.refetch();
          productsQuery.refetch();
          ordersQuery.refetch();
        }}
      />
    );
  }

  return (
    <div className="w-full min-w-0 space-y-6">
      <PageHeader
        title={t("title")}
        subtitle={t("subtitle")}
        actions={
          <Button type="button" variant="outline" size="sm" onClick={handleExport}>
            <DownloadIcon className="size-4" />
            {tCommon("export")}
          </Button>
        }
      />

      <div className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-[104px] rounded-xl" />
            ))
          : kpis.map((kpi) => (
              <StatCard
                key={kpi.title}
                title={kpi.title}
                value={kpi.value}
                icon={kpi.icon}
              />
            ))}
      </div>

      {isLoading ? (
        <div className="grid min-w-0 gap-4 xl:grid-cols-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-[300px] rounded-xl" />
          ))}
        </div>
      ) : (
        <DashboardGrid
          widgets={[
            {
              id: "revenue",
              content: <DynamicRevenueLineChart title={t("revenueByMonth")} data={monthly} />,
            },
            {
              id: "orders",
              content: <DynamicOrdersAreaChart title={t("ordersTrend")} data={monthly} />,
            },
            {
              id: "countries",
              content: <DynamicCountryPieChart title={t("usersByCountry")} data={byCountry} />,
            },
            {
              id: "categories",
              content: <DynamicCategoryBarChart title={t("productsByCategory")} data={byCategory} />,
            },
            {
              id: "topProducts",
              content: (
                <div className="min-w-0 xl:col-span-2">
                  <DynamicTopProductsBarChart title={t("topProducts")} data={topProducts} />
                </div>
              ),
            },
            {
              id: "activity",
              content: (
                <div className="min-w-0 xl:col-span-2">
                  <RecentActivity
                    title={t("recentActivity")}
                    usersTitle={t("recentUsers")}
                    productsTitle={t("recentProducts")}
                    ordersTitle={t("recentOrders")}
                    users={users.slice(0, 5).map((user) => ({
                      id: user.id,
                      label: getUserFullName(user),
                      meta: user.email,
                    }))}
                    products={products.slice(0, 5).map((product) => ({
                      id: product.id,
                      label: product.title,
                      meta: product.category,
                    }))}
                    orders={carts.slice(0, 5).map((cart) => ({
                      id: cart.id,
                      label: `Order #${cart.id}`,
                      meta: formatCurrency(cart.discountedTotal),
                    }))}
                    loading={isLoading}
                  />
                </div>
              ),
            },
          ]}
        />
      )}
    </div>
  );
}
