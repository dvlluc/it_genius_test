"use client";

import { LanguagesIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { useUiSettingsStore } from "@/shared/stores/ui-settings";
import type { Locale } from "@/shared/config/constants";

export function LocaleSwitch() {
  const t = useTranslations("settings");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const setLocale = useUiSettingsStore((s) => s.setLocale);

  const changeLocale = (next: Locale) => {
    setLocale(next);
    router.replace(pathname, { locale: next });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button type="button" variant="outline" size="icon-sm" aria-label={t("language")} />
        }
      >
        <LanguagesIcon className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          disabled={locale === "en"}
          onClick={() => changeLocale("en")}
        >
          English
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={locale === "ru"}
          onClick={() => changeLocale("ru")}
        >
          Русский
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
