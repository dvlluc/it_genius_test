import { Skeleton } from "@/shared/ui/skeleton";
import { cn } from "@/shared/lib/utils";

type DataTableSkeletonProps = {
  rows?: number;
  columns?: number;
  className?: string;
};

export function DataTableSkeleton({
  rows = 8,
  columns = 6,
  className,
}: DataTableSkeletonProps) {
  return (
    <div
      className={cn("w-full min-w-0 space-y-3", className)}
      aria-busy="true"
      aria-live="polite"
    >
      <div className="flex min-w-0 flex-wrap gap-2">
        <Skeleton className="h-9 w-full max-w-64" />
        <Skeleton className="h-9 w-28" />
        <Skeleton className="h-9 w-28 sm:ml-auto" />
      </div>
      <div className="overflow-hidden rounded-xl border">
        <div className="min-w-0 overflow-x-auto">
          <div className="min-w-[640px]">
            <div
              className="grid gap-3 border-b bg-muted/40 px-4 py-3"
              style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
            >
              {Array.from({ length: columns }).map((_, index) => (
                <Skeleton key={index} className="h-4 w-20 max-w-full" />
              ))}
            </div>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <div
                key={rowIndex}
                className="grid gap-3 border-b px-4 py-3 last:border-b-0"
                style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
              >
                {Array.from({ length: columns }).map((__, colIndex) => (
                  <Skeleton key={colIndex} className="h-4 w-24 max-w-full" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
