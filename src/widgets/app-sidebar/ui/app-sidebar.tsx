"use client";

import {
  BarChart3Icon,
  LayoutDashboardIcon,
  MenuIcon,
  PackageIcon,
  SettingsIcon,
  ShoppingCartIcon,
  UsersIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { NAV_ITEMS } from "@/shared/config/routes";
import { useUiSettingsStore } from "@/shared/stores/ui-settings";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/ui/sheet";

const ICONS = {
  LayoutDashboard: LayoutDashboardIcon,
  Users: UsersIcon,
  Package: PackageIcon,
  ShoppingCart: ShoppingCartIcon,
  BarChart3: BarChart3Icon,
  Settings: SettingsIcon,
} as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const t = useTranslations();
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1" aria-label="Main">
      {NAV_ITEMS.map((item) => {
        const Icon = ICONS[item.icon];
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground/80 hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground",
            )}
            aria-current={active ? "page" : undefined}
          >
            <Icon className="size-4 shrink-0" aria-hidden />
            <span>{t(item.labelKey)}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function AppSidebar() {
  const collapsed = useUiSettingsStore((s) => s.sidebarCollapsed);

  return (
    <aside
      className={cn(
        "hidden h-svh shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:sticky md:top-0 md:flex md:flex-col",
        collapsed ? "w-[72px]" : "w-60",
      )}
    >
      <div className="flex h-14 items-center border-b border-sidebar-border px-4">
        <Link href="/dashboard" className="font-semibold tracking-tight">
          {collapsed ? "AD" : "Analytics"}
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        {collapsed ? (
          <nav className="flex flex-col items-center gap-1" aria-label="Main">
            {NAV_ITEMS.map((item) => {
              const Icon = ICONS[item.icon];
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg p-2 hover:bg-sidebar-accent"
                  aria-label={item.labelKey}
                >
                  <Icon className="size-4" />
                </Link>
              );
            })}
          </nav>
        ) : (
          <NavLinks />
        )}
      </div>
    </aside>
  );
}

export function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            className="md:hidden"
          />
        }
      >
        <MenuIcon className="size-4" />
        <span className="sr-only">Open menu</span>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 bg-sidebar p-0 text-sidebar-foreground">
        <SheetHeader className="border-b border-sidebar-border px-4 py-3">
          <SheetTitle>Analytics</SheetTitle>
        </SheetHeader>
        <div className="p-3">
          <NavLinks />
        </div>
      </SheetContent>
    </Sheet>
  );
}
