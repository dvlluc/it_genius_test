"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { useAllUsersQuery } from "@/entities/user/api/user-queries";
import { useAllProductsQuery } from "@/entities/product/api/product-queries";
import { useAllOrdersQuery } from "@/entities/order/api/order-queries";
import { PageHeader } from "@/shared/ui/page-header";
import { ErrorState } from "@/shared/ui/error-state";
import {
  buildCategoryDistribution,
  buildMonthlySeries,
  buildTopProducts,
  buildUsersByCountry,
  buildUsersGrowth,
} from "@/shared/lib/analytics";
import {
  DynamicCategoryBarChart,
  DynamicCountryPieChart,
  DynamicOrdersAreaChart,
  DynamicRevenueLineChart,
  DynamicTopProductsBarChart,
  DynamicUsersLineChart,
} from "@/widgets/dashboard-charts/ui/charts";
import { Skeleton } from "@/shared/ui/skeleton";

export function AnalyticsPage() {
  const t = useTranslations("analytics");
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

  const monthly = useMemo(() => buildMonthlySeries(carts), [carts]);
  const usersGrowth = useMemo(() => buildUsersGrowth(users), [users]);
  const byCountry = useMemo(() => buildUsersByCountry(users), [users]);
  const byCategory = useMemo(() => buildCategoryDistribution(products), [products]);
  const topProducts = useMemo(() => buildTopProducts(products, carts), [products, carts]);

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
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      {isLoading ? (
        <div className="grid min-w-0 gap-4 xl:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-[300px] rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid min-w-0 gap-4 xl:grid-cols-2">
          <DynamicRevenueLineChart title={t("revenueDynamics")} data={monthly} />
          <DynamicOrdersAreaChart title={t("ordersCount")} data={monthly} />
          <DynamicUsersLineChart title={t("usersCount")} data={usersGrowth} />
          <DynamicCategoryBarChart title={t("popularCategories")} data={byCategory} />
          <DynamicCountryPieChart title={t("usersDistribution")} data={byCountry} />
          <DynamicTopProductsBarChart title={t("topSelling")} data={topProducts} />
        </div>
      )}
    </div>
  );
}
