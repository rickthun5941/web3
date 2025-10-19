"use client";

import { useEffect, useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiConfig } from "wagmi";
import { projectId, wagmiConfig } from "@/lib/web3modal";
import { LanguageProvider } from "@/lib/i18n";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    if (!projectId || projectId === "demo") {
      console.warn(
        "NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set. Using the demo project id; do not use in production."
      );
    }
  }, []);

  return (
    <LanguageProvider>
      <WagmiConfig config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </WagmiConfig>
    </LanguageProvider>
  );
}
