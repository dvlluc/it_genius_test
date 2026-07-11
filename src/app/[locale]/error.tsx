"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/shared/ui/button";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ reset }: ErrorProps) {
  const t = useTranslations("errors");
  const tCommon = useTranslations("common");

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <p className="text-sm text-muted-foreground">500</p>
      <h1 className="text-2xl font-semibold">{t("serverTitle")}</h1>
      <p className="max-w-md text-muted-foreground">{t("serverDescription")}</p>
      <Button type="button" onClick={reset}>
        {tCommon("retry")}
      </Button>
    </div>
  );
}
