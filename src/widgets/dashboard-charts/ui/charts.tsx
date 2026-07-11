"use client";

import dynamic from "next/dynamic";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartCard } from "@/shared/ui/chart-card";
import { Skeleton } from "@/shared/ui/skeleton";

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "oklch(0.65 0.12 200)",
  "oklch(0.7 0.1 140)",
  "oklch(0.6 0.08 40)",
];

type SeriesPoint = { month: string; revenue?: number; orders?: number; users?: number };
type NamedValue = { name: string; value: number };
type TopProduct = { name: string; quantity: number; revenue: number };

export function RevenueLineChart({
  title,
  data,
}: {
  title: string;
  data: SeriesPoint[];
}) {
  return (
    <ChartCard title={title}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
          <YAxis tickLine={false} axisLine={false} fontSize={12} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="var(--chart-2)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function OrdersAreaChart({
  title,
  data,
}: {
  title: string;
  data: SeriesPoint[];
}) {
  return (
    <ChartCard title={title}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
          <YAxis tickLine={false} axisLine={false} fontSize={12} />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="orders"
            stroke="var(--chart-3)"
            fill="var(--chart-3)"
            fillOpacity={0.25}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function UsersLineChart({
  title,
  data,
}: {
  title: string;
  data: SeriesPoint[];
}) {
  return (
    <ChartCard title={title}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
          <YAxis tickLine={false} axisLine={false} fontSize={12} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="users"
            stroke="var(--chart-4)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function CategoryBarChart({
  title,
  data,
}: {
  title: string;
  data: NamedValue[];
}) {
  return (
    <ChartCard title={title}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="name" hide />
          <YAxis tickLine={false} axisLine={false} fontSize={12} />
          <Tooltip />
          <Bar dataKey="value" fill="var(--chart-2)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function CountryPieChart({
  title,
  data,
}: {
  title: string;
  data: NamedValue[];
}) {
  return (
    <ChartCard title={title}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80}>
            {data.map((entry, index) => (
              <Cell key={`${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function TopProductsBarChart({
  title,
  data,
}: {
  title: string;
  data: TopProduct[];
}) {
  return (
    <ChartCard title={title}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 16 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis type="number" tickLine={false} axisLine={false} fontSize={12} />
          <YAxis
            type="category"
            dataKey="name"
            width={100}
            tickLine={false}
            axisLine={false}
            fontSize={11}
          />
          <Tooltip />
          <Bar dataKey="quantity" fill="var(--chart-1)" radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function ChartSkeleton() {
  return <Skeleton className="h-[300px] w-full rounded-xl" />;
}

export const DynamicRevenueLineChart = dynamic(
  () => Promise.resolve(RevenueLineChart),
  { ssr: false, loading: () => <ChartSkeleton /> },
);
export const DynamicOrdersAreaChart = dynamic(
  () => Promise.resolve(OrdersAreaChart),
  { ssr: false, loading: () => <ChartSkeleton /> },
);
export const DynamicUsersLineChart = dynamic(
  () => Promise.resolve(UsersLineChart),
  { ssr: false, loading: () => <ChartSkeleton /> },
);
export const DynamicCategoryBarChart = dynamic(
  () => Promise.resolve(CategoryBarChart),
  { ssr: false, loading: () => <ChartSkeleton /> },
);
export const DynamicCountryPieChart = dynamic(
  () => Promise.resolve(CountryPieChart),
  { ssr: false, loading: () => <ChartSkeleton /> },
);
export const DynamicTopProductsBarChart = dynamic(
  () => Promise.resolve(TopProductsBarChart),
  { ssr: false, loading: () => <ChartSkeleton /> },
);
