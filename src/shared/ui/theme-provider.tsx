"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect, type ReactNode } from "react";

export function ThemeProvider({ children }: { children: ReactNode }) {
  // React 19 / Next 16: next-themes injects an inline script; suppress the false-positive warning.
  useEffect(() => {
    const originalError = console.error;
    console.error = (...args: unknown[]) => {
      const first = args[0];
      if (
        typeof first === "string" &&
        first.includes("Encountered a script tag while rendering React component")
      ) {
        return;
      }
      originalError.apply(console, args as Parameters<typeof console.error>);
    };
    return () => {
      console.error = originalError;
    };
  }, []);

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
