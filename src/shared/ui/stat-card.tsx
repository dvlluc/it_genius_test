import { cn } from "@/shared/lib/utils";
import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string;
  icon: LucideIcon;
  hint?: string;
  className?: string;
};

export function StatCard({ title, value, icon: Icon, hint, className }: StatCardProps) {
  return (
    <article
      className={cn(
        "min-w-0 overflow-hidden rounded-xl border bg-card p-4 text-card-foreground shadow-sm",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-2">
          <p className="truncate text-sm text-muted-foreground">{title}</p>
          <p className="truncate text-2xl font-semibold tracking-tight">{value}</p>
          {hint ? (
            <p className="truncate text-xs text-muted-foreground">{hint}</p>
          ) : null}
        </div>
        <div className="shrink-0 rounded-lg bg-muted p-2">
          <Icon className="size-4 text-muted-foreground" aria-hidden />
        </div>
      </div>
    </article>
  );
}
