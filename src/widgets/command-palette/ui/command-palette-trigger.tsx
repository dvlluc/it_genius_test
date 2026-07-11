"use client";

import { SearchIcon } from "lucide-react";
import { Button } from "@/shared/ui/button";

type CommandPaletteTriggerProps = {
  hint: string;
};

export function CommandPaletteTrigger({ hint }: CommandPaletteTriggerProps) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="hidden gap-2 text-muted-foreground sm:inline-flex"
      onClick={() => window.dispatchEvent(new Event("open-command-palette"))}
      aria-label={hint}
    >
      <SearchIcon className="size-3.5" />
      <span className="text-xs">{hint}</span>
    </Button>
  );
}
