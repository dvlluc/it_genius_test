"use client";

import type { ReactNode } from "react";
import { AppSidebar } from "@/widgets/app-sidebar/ui/app-sidebar";
import { AppHeader } from "@/widgets/app-header/ui/app-header";
import { CommandPalette } from "@/widgets/command-palette/ui/command-palette";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh w-full overflow-x-hidden">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:rounded-lg focus:bg-background focus:p-3 focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Skip to content
      </a>
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-x-hidden">
        <AppHeader />
        <main
          id="main-content"
          className="min-w-0 flex-1 overflow-x-hidden p-4 md:p-6"
          tabIndex={-1}
        >
          <div className="mx-auto w-full min-w-0 max-w-[1600px]">{children}</div>
        </main>
      </div>
      <CommandPalette />
    </div>
  );
}
