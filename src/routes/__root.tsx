import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { Toaster } from "sonner";
import { I18nProvider } from "../lib/i18n";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import "../styles.css";

// NotFoundComponent と ErrorComponent はそのまま残す

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <div className="min-h-screen bg-background text-foreground flex flex-col">
          <Header />
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
        </div>
        <Toaster theme="light" richColors />
      </I18nProvider>
    </QueryClientProvider>
  );
}
