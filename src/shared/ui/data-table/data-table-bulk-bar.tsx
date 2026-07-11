"use client";

import { Button } from "@/shared/ui/button";

type DataTableBulkBarProps = {
  selectedCount: number;
  selectedLabel: string;
  clearLabel: string;
  onClear: () => void;
  actions?: React.ReactNode;
};

export function DataTableBulkBar({
  selectedCount,
  selectedLabel,
  clearLabel,
  onClear,
  actions,
}: DataTableBulkBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2 text-sm">
      <span>{selectedLabel}</span>
      <Button type="button" variant="ghost" size="sm" onClick={onClear}>
        {clearLabel}
      </Button>
      {actions}
    </div>
  );
}
