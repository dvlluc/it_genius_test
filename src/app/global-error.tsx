"use client";

import { Button } from "@/shared/ui/button";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ reset }: GlobalErrorProps) {
  return (
    <html lang="en">
      <body className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="text-2xl font-semibold">Server error</h1>
        <p className="text-muted-foreground">An unexpected error occurred.</p>
        <Button type="button" onClick={reset}>
          Retry
        </Button>
      </body>
    </html>
  );
}
