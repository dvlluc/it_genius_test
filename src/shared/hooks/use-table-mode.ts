"use client";

import { useCallback, useState } from "react";

type ViewMode = "paginated" | "infinite";

type UseTableModeReturn = {
  viewMode: ViewMode;
  toggleViewMode: () => void;
};

export function useTableMode(initial: ViewMode = "paginated"): UseTableModeReturn {
  const [viewMode, setViewMode] = useState<ViewMode>(initial);

  const toggleViewMode = useCallback(() => {
    setViewMode((prev) => (prev === "paginated" ? "infinite" : "paginated"));
  }, []);

  return { viewMode, toggleViewMode };
}
