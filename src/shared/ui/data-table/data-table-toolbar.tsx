"use client";

import { SearchIcon } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { cn } from "@/shared/lib/utils";

type DataTableToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  filters?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
};

export function DataTableToolbar({
  search,
  onSearchChange,
  searchPlaceholder,
  filters,
  actions,
  className,
}: DataTableToolbarProps) {
  return (
    <div className={cn("flex w-full min-w-0 flex-col gap-3", className)}>
      <div className="relative w-full sm:max-w-sm">
        <SearchIcon
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full pl-9"
          aria-label={searchPlaceholder}
        />
      </div>
      <div className="flex w-full min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        {filters ? (
          <div className="flex min-w-0 flex-wrap items-center gap-2">{filters}</div>
        ) : null}
        {actions ? (
          <div className="flex min-w-0 flex-wrap items-center gap-2 sm:ml-auto">
            {actions}
          </div>
        ) : null}
      </div>
    </div>
  );
}
