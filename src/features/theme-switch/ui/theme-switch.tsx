"use client";

import { MoonIcon, SunIcon, MonitorIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { useUiSettingsStore } from "@/shared/stores/ui-settings";
import type { ThemePreference } from "@/shared/stores/ui-settings";

export function ThemeSwitch() {
  const { setTheme } = useTheme();
  const setStoreTheme = useUiSettingsStore((s) => s.setTheme);
  const t = useTranslations("settings");

  const apply = (theme: ThemePreference) => {
    setTheme(theme);
    setStoreTheme(theme);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button type="button" variant="outline" size="icon-sm" aria-label={t("theme")} />
        }
      >
        <SunIcon className="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
        <MoonIcon className="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => apply("light")}>
          <SunIcon className="size-4" />
          {t("themeLight")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => apply("dark")}>
          <MoonIcon className="size-4" />
          {t("themeDark")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => apply("system")}>
          <MonitorIcon className="size-4" />
          {t("themeSystem")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
