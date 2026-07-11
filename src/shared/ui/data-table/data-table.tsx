"use client";

import { useVirtualizer } from "@tanstack/react-virtual";
import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { cn } from "@/shared/lib/utils";

export type DataTableColumn<T> = {
  id: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  className?: string;
  sortable?: boolean;
  width?: string;
};

type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  data: T[];
  getRowId: (row: T) => string | number;
  selectedIds?: Set<string | number>;
  onToggleRow?: (id: string | number) => void;
  onToggleAll?: (checked: boolean) => void;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onSort?: (columnId: string) => void;
  className?: string;
  estimateSize?: number;
  height?: number;
  minWidth?: number;
  onNearEnd?: () => void;
};

type DataTableRowProps<T> = {
  row: T;
  columns: DataTableColumn<T>[];
  gridTemplate: string;
  showSelection: boolean;
  selected: boolean;
  rowId: string | number;
  onToggleRow?: (id: string | number) => void;
  start: number;
  index: number;
  measureElement?: (node: Element | null) => void;
  size: number;
};

function DataTableRowInner<T>({
  row,
  columns,
  gridTemplate,
  showSelection,
  selected,
  rowId,
  onToggleRow,
  start,
  index,
  size,
}: DataTableRowProps<T>) {
  return (
    <div
      data-index={index}
      role="row"
      data-state={selected ? "selected" : undefined}
      className={cn(
        "absolute top-0 left-0 grid w-full items-center gap-3 border-b px-3 py-2.5 text-sm data-[state=selected]:bg-muted/40 sm:gap-4 sm:px-4",
        showSelection ? "grid-cols-[40px_1fr]" : "grid-cols-1",
      )}
      style={{
        height: size,
        transform: `translateY(${start}px)`,
      }}
    >
      {showSelection ? (
        <div className="flex items-center justify-center" role="cell">
          <input
            type="checkbox"
            className="size-4 accent-foreground"
            checked={selected}
            onChange={() => onToggleRow?.(rowId)}
            aria-label={`Select row ${rowId}`}
          />
        </div>
      ) : null}
      <div
        className="grid min-w-0 items-center gap-3 sm:gap-4"
        style={{ gridTemplateColumns: gridTemplate }}
      >
        {columns.map((column) => (
          <div
            key={column.id}
            className={cn("min-w-0 overflow-hidden", column.className)}
            role="cell"
          >
            {column.cell(row)}
          </div>
        ))}
      </div>
    </div>
  );
}

const DataTableRow = memo(DataTableRowInner) as typeof DataTableRowInner;

function DataTableInner<T>({
  columns,
  data,
  getRowId,
  selectedIds,
  onToggleRow,
  onToggleAll,
  sortBy,
  sortOrder,
  onSort,
  className,
  estimateSize = 64,
  height = 480,
  minWidth,
  onNearEnd,
}: DataTableProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);
  const showSelection = Boolean(selectedIds && onToggleRow);

  const allSelected =
    data.length > 0 && data.every((row) => selectedIds?.has(getRowId(row)));
  const someSelected =
    data.some((row) => selectedIds?.has(getRowId(row))) && !allSelected;

  const getEstimateSize = useCallback(() => estimateSize, [estimateSize]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: getEstimateSize,
    overscan: 6,
  });

  const gridTemplate = useMemo(
    () => columns.map((column) => column.width ?? "minmax(120px, 1fr)").join(" "),
    [columns],
  );

  const tableMinWidth = useMemo(
    () => minWidth ?? Math.max(640, columns.length * 140 + (showSelection ? 40 : 0)),
    [minWidth, columns.length, showSelection],
  );

  const virtualItems = virtualizer.getVirtualItems();
  const totalSize = virtualizer.getTotalSize();

  useEffect(() => {
    if (!onNearEnd || virtualItems.length === 0) return;
    const lastItem = virtualItems[virtualItems.length - 1];
    if (lastItem.index >= data.length - 1) {
      onNearEnd();
    }
  }, [virtualItems, data.length, onNearEnd]);

  return (
    <div
      className={cn("w-full min-w-0 overflow-hidden rounded-xl border", className)}
      role="table"
      aria-rowcount={data.length}
    >
      <div ref={parentRef} className="max-w-full overflow-auto" style={{ height }}>
        <div style={{ minWidth: tableMinWidth }}>
          <div
            className={cn(
              "sticky top-0 z-10 grid items-center gap-3 border-b bg-muted/50 px-3 py-2.5 text-xs font-medium text-muted-foreground backdrop-blur-sm sm:gap-4 sm:px-4 sm:text-sm",
              showSelection ? "grid-cols-[40px_1fr]" : "grid-cols-1",
            )}
            role="row"
          >
            {showSelection ? (
              <div className="flex items-center justify-center" role="columnheader">
                <input
                  type="checkbox"
                  className="size-4 accent-foreground"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected;
                  }}
                  onChange={(e) => onToggleAll?.(e.target.checked)}
                  aria-label="Select all rows"
                />
              </div>
            ) : null}
            <div
              className="grid min-w-0 items-center gap-3 sm:gap-4"
              style={{ gridTemplateColumns: gridTemplate }}
            >
              {columns.map((column) => (
                <div
                  key={column.id}
                  className={cn("min-w-0 truncate", column.className)}
                  role="columnheader"
                  aria-sort={
                    sortBy === column.id
                      ? sortOrder === "asc"
                        ? "ascending"
                        : "descending"
                      : column.sortable
                        ? "none"
                        : undefined
                  }
                >
                  {column.sortable && onSort ? (
                    <button
                      type="button"
                      className="inline-flex max-w-full items-center gap-1 truncate font-medium text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      onClick={() => onSort(column.id)}
                    >
                      <span className="truncate">{column.header}</span>
                      {sortBy === column.id ? (
                        <span className="shrink-0">
                          {sortOrder === "asc" ? "↑" : "↓"}
                        </span>
                      ) : null}
                    </button>
                  ) : (
                    column.header
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="relative w-full" style={{ height: totalSize }}>
            {virtualItems.map((item) => {
              const row = data[item.index];
              const rowId = getRowId(row);
              return (
                <DataTableRow
                  key={item.key}
                  row={row}
                  columns={columns}
                  gridTemplate={gridTemplate}
                  showSelection={showSelection}
                  selected={selectedIds?.has(rowId) ?? false}
                  rowId={rowId}
                  onToggleRow={onToggleRow}
                  start={item.start}
                  index={item.index}
                  size={item.size}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function setsEqual(
  a?: Set<string | number>,
  b?: Set<string | number>,
): boolean {
  if (a === b) return true;
  if (!a || !b || a.size !== b.size) return false;
  for (const value of a) {
    if (!b.has(value)) return false;
  }
  return true;
}

function dataTablePropsAreEqual<T>(
  prev: DataTableProps<T>,
  next: DataTableProps<T>,
): boolean {
  return (
    prev.data === next.data &&
    prev.columns === next.columns &&
    prev.getRowId === next.getRowId &&
    prev.onToggleRow === next.onToggleRow &&
    prev.onToggleAll === next.onToggleAll &&
    prev.onSort === next.onSort &&
    prev.sortBy === next.sortBy &&
    prev.sortOrder === next.sortOrder &&
    prev.className === next.className &&
    prev.estimateSize === next.estimateSize &&
    prev.height === next.height &&
    prev.minWidth === next.minWidth &&
    prev.onNearEnd === next.onNearEnd &&
    setsEqual(prev.selectedIds, next.selectedIds)
  );
}

export const DataTable = memo(DataTableInner, dataTablePropsAreEqual) as <T>(
  props: DataTableProps<T>,
) => React.ReactElement;

export const TableText = memo(function TableText({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn("block truncate", className)}
      title={typeof children === "string" ? children : undefined}
    >
      {children}
    </span>
  );
});
