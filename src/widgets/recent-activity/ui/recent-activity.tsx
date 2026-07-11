import { Skeleton } from "@/shared/ui/skeleton";

type ActivityItem = {
  id: number;
  label: string;
  meta: string;
};

type RecentActivityProps = {
  title: string;
  usersTitle: string;
  productsTitle: string;
  ordersTitle: string;
  users: ActivityItem[];
  products: ActivityItem[];
  orders: ActivityItem[];
  loading?: boolean;
};

function ActivityColumn({
  title,
  items,
  loading,
}: {
  title: string;
  items: ActivityItem[];
  loading?: boolean;
}) {
  return (
    <section className="min-w-0 rounded-xl border bg-card p-4 shadow-sm">
      <h3 className="mb-3 truncate text-sm font-medium">{title}</h3>
      <ul className="space-y-3">
        {loading
          ? Array.from({ length: 5 }).map((_, index) => (
              <li key={index} className="space-y-1">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
              </li>
            ))
          : items.map((item) => (
              <li key={`${title}-${item.id}`} className="min-w-0">
                <p className="truncate text-sm font-medium" title={item.label}>
                  {item.label}
                </p>
                <p className="truncate text-xs text-muted-foreground" title={item.meta}>
                  {item.meta}
                </p>
              </li>
            ))}
      </ul>
    </section>
  );
}

export function RecentActivity({
  title,
  usersTitle,
  productsTitle,
  ordersTitle,
  users,
  products,
  orders,
  loading,
}: RecentActivityProps) {
  return (
    <section className="min-w-0 space-y-3">
      <h2 className="text-sm font-medium">{title}</h2>
      <div className="grid min-w-0 gap-4 lg:grid-cols-3">
        <ActivityColumn title={usersTitle} items={users} loading={loading} />
        <ActivityColumn title={productsTitle} items={products} loading={loading} />
        <ActivityColumn title={ordersTitle} items={orders} loading={loading} />
      </div>
    </section>
  );
}
