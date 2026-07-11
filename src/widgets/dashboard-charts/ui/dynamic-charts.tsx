"use client";

import dynamic from "next/dynamic";
import { ChartSkeleton } from "./charts";

const DynamicRevenueLineChart = dynamic(
  () => import("./charts").then((m) => ({ default: m.RevenueLineChart })),
  { ssr: false, loading: () => <ChartSkeleton /> },
);

const DynamicOrdersAreaChart = dynamic(
  () => import("./charts").then((m) => ({ default: m.OrdersAreaChart })),
  { ssr: false, loading: () => <ChartSkeleton /> },
);

const DynamicUsersLineChart = dynamic(
  () => import("./charts").then((m) => ({ default: m.UsersLineChart })),
  { ssr: false, loading: () => <ChartSkeleton /> },
);

const DynamicCategoryBarChart = dynamic(
  () => import("./charts").then((m) => ({ default: m.CategoryBarChart })),
  { ssr: false, loading: () => <ChartSkeleton /> },
);

const DynamicCountryPieChart = dynamic(
  () => import("./charts").then((m) => ({ default: m.CountryPieChart })),
  { ssr: false, loading: () => <ChartSkeleton /> },
);

const DynamicTopProductsBarChart = dynamic(
  () => import("./charts").then((m) => ({ default: m.TopProductsBarChart })),
  { ssr: false, loading: () => <ChartSkeleton /> },
);

export {
  DynamicRevenueLineChart,
  DynamicOrdersAreaChart,
  DynamicUsersLineChart,
  DynamicCategoryBarChart,
  DynamicCountryPieChart,
  DynamicTopProductsBarChart,
};
