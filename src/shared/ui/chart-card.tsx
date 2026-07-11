import { cn } from "@/shared/lib/utils";

type ChartCardProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
};

export function ChartCard({ title, children, className, action }: ChartCardProps) {
  return (
    <section
      className={cn(
        "min-w-0 overflow-hidden rounded-xl border bg-card p-4 text-card-foreground shadow-sm",
        className,
      )}
    >
      <div className="mb-4 flex min-w-0 items-center justify-between gap-2">
        <h2 className="min-w-0 truncate text-sm font-medium">{title}</h2>
        {action}
      </div>
      <div className="h-[260px] w-full min-w-0">{children}</div>
    </section>
  );
}
