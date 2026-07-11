"use client";

import { Columns3Icon } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

type ColumnOption = {
  id: string;
  label: string;
  locked?: boolean;
};

type DataTableColumnToggleProps = {
  label: string;
  columns: ColumnOption[];
  visibleIds: string[];
  onChange: (ids: string[]) => void;
};

export function DataTableColumnToggle({
  label,
  columns,
  visibleIds,
  onChange,
}: DataTableColumnToggleProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button type="button" variant="outline" size="sm" />}
      >
        <Columns3Icon className="size-4" />
        {label}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{label}</DropdownMenuLabel>
          {columns.map((column) => (
            <DropdownMenuCheckboxItem
              key={column.id}
              checked={visibleIds.includes(column.id)}
              disabled={column.locked}
              onCheckedChange={(checked) => {
                if (checked) {
                  onChange([...visibleIds, column.id]);
                } else {
                  onChange(visibleIds.filter((id) => id !== column.id));
                }
              }}
            >
              {column.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
