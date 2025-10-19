"use client";

import { createWeb3Modal } from "@web3modal/wagmi/react";
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { arbitrumSepolia, mainnet, sepolia } from "wagmi/chains";

export const projectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID?.trim() || "demo";

const metadata = {
  name: "Lottery Dashboard",
  description: "Manage decentralised lottery draws and ticket purchases.",
  url: "https://example.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

export const chains = [mainnet, sepolia, arbitrumSepolia] as const;

export const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  enableEmail: false,
});

declare global {
  interface Window {
    __WEB3MODAL_INITIALIZED__?: boolean;
  }
}

export function ensureWeb3Modal() {
  if (
    typeof window === "undefined" ||
    window.__WEB3MODAL_INITIALIZED__ ||
    projectId === ""
  ) {
    return;
  }

  createWeb3Modal({
    wagmiConfig,
    projectId,
    chains,
    themeMode: "light",
    enableAnalytics: false,
  });

  window.__WEB3MODAL_INITIALIZED__ = true;
}

if (typeof window !== "undefined") {
  ensureWeb3Modal();
}
