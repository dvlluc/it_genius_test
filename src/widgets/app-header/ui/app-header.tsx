"use client";

import { useTranslations } from "next-intl";
import { MobileSidebar } from "@/widgets/app-sidebar/ui/app-sidebar";
import { ThemeSwitch } from "@/features/theme-switch/ui/theme-switch";
import { LocaleSwitch } from "@/features/locale-switch/ui/locale-switch";
import { CommandPaletteTrigger } from "@/widgets/command-palette/ui/command-palette-trigger";
import { Button } from "@/shared/ui/button";
import { PanelLeftIcon } from "lucide-react";
import { useUiSettingsStore } from "@/shared/stores/ui-settings";

export function AppHeader() {
  const t = useTranslations("common");
  const toggleSidebar = useUiSettingsStore((s) => s.toggleSidebar);

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b bg-background/90 px-4 backdrop-blur">
      <MobileSidebar />
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="hidden md:inline-flex"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        <PanelLeftIcon className="size-4" />
      </Button>
      <div className="ml-auto flex items-center gap-2">
        <CommandPaletteTrigger hint={t("commandHint")} />
        <LocaleSwitch />
        <ThemeSwitch />
      </div>
    </header>
  );
}
