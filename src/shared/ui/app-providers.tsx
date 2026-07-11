"use client";

import { TooltipProvider } from "@/shared/ui/tooltip";
import { Toaster } from "@/shared/ui/sonner";
import { QueryProvider } from "@/shared/ui/query-provider";
import { ThemeProvider } from "@/shared/ui/theme-provider";
import { ThemeSync } from "@/features/theme-switch/ui/theme-sync";
import { ServiceWorkerRegistration } from "@/shared/ui/sw-register";
import type { ReactNode } from "react";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <TooltipProvider delay={200}>
          <ThemeSync />
          <ServiceWorkerRegistration />
          {children}
          <Toaster richColors position="top-right" />
        </TooltipProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
