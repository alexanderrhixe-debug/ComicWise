"use client";

import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { lazy, Suspense, type ComponentProps, type ReactNode } from "react";

const Toaster = lazy(() => import("ui/sonner").then((mod) => ({ default: mod.Toaster })));

type AppProps = {
  children: ReactNode;
  session?: Session | null;
} & ComponentProps<typeof ThemeProvider>;
export function Providers({ children, attribute, defaultTheme, enableSystem }: AppProps) {
  return (
    <SessionProvider>
      <ThemeProvider attribute={attribute} defaultTheme={defaultTheme} enableSystem={enableSystem}>
        {children}
        <Suspense fallback={null}>
          <Toaster expand={true} richColors closeButton />
        </Suspense>
      </ThemeProvider>
    </SessionProvider>
  );
}
