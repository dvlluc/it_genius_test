"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  BarChart3Icon,
  LayoutDashboardIcon,
  PackageIcon,
  SettingsIcon,
  ShoppingCartIcon,
  UsersIcon,
} from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/ui/command";
import { useRouter } from "@/i18n/routing";
import { APP_ROUTES } from "@/shared/config/routes";

const ITEMS = [
  { href: APP_ROUTES.dashboard, icon: LayoutDashboardIcon, labelKey: "nav.dashboard" },
  { href: APP_ROUTES.users, icon: UsersIcon, labelKey: "nav.users" },
  { href: APP_ROUTES.products, icon: PackageIcon, labelKey: "nav.products" },
  { href: APP_ROUTES.orders, icon: ShoppingCartIcon, labelKey: "nav.orders" },
  { href: APP_ROUTES.analytics, icon: BarChart3Icon, labelKey: "nav.analytics" },
  { href: APP_ROUTES.settings, icon: SettingsIcon, labelKey: "nav.settings" },
] as const;

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const t = useTranslations();
  const tCommon = useTranslations("common");

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-command-palette", handler);
    return () => window.removeEventListener("open-command-palette", handler);
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <Command>
        <CommandInput placeholder={tCommon("openCommand")} />
        <CommandList>
          <CommandEmpty>{tCommon("noResults")}</CommandEmpty>
          <CommandGroup heading="Navigation">
            {ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <CommandItem
                  key={item.href}
                  value={item.labelKey}
                  onSelect={() => {
                    setOpen(false);
                    router.push(item.href);
                  }}
                >
                  <Icon className="size-4" />
                  {t(item.labelKey)}
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
