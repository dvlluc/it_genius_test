"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { useUiSettingsStore } from "@/shared/stores/ui-settings";

export function ThemeSync() {
  const { setTheme } = useTheme();
  const theme = useUiSettingsStore((s) => s.theme);

  useEffect(() => {
    setTheme(theme);
  }, [theme, setTheme]);

  return null;
}
