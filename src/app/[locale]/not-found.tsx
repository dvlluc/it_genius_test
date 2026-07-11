"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { buttonVariants } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

export default function NotFound() {
  const t = useTranslations("errors");

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <p className="text-sm text-muted-foreground">404</p>
      <h1 className="text-2xl font-semibold">{t("notFoundTitle")}</h1>
      <p className="max-w-md text-muted-foreground">{t("notFoundDescription")}</p>
      <Link href="/dashboard" className={cn(buttonVariants())}>
        {t("goHome")}
      </Link>
    </div>
  );
}
