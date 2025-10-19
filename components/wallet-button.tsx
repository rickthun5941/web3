"use client";

import { useAccount, useBalance, useDisconnect } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useTranslation } from "@/lib/i18n";
import { ensureWeb3Modal } from "@/lib/web3modal";

ensureWeb3Modal();

export function WalletButton() {
  ensureWeb3Modal();
  const { open } = useWeb3Modal();
  const { isConnected, address, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const { t } = useTranslation();

  const { data: balance } = useBalance({
    address,
    unit: "ether",
    query: { enabled: Boolean(isConnected && address) },
  });
  const formattedBalance = balance
    ? Number.parseFloat(balance.formatted).toFixed(4)
    : "0.0000";

  if (!isConnected) {
    return (
      <button
        type="button"
        className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        onClick={() => open()}
      >
        {t("wallet.connect")}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-full border border-zinc-300 bg-white/80 px-4 py-2 text-sm text-zinc-800 shadow-sm backdrop-blur dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-zinc-100">
      <div className="flex flex-col text-left">
        <span className="font-semibold">
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          {chain?.name ?? t("wallet.unknownChain")} •{" "}
          {formattedBalance ?? "0.0000"} ETH
        </span>
      </div>
      <button
        type="button"
        className="rounded-full border border-zinc-300 px-3 py-1 text-xs font-medium transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
        onClick={() => disconnect()}
      >
        {t("wallet.disconnect")}
      </button>
    </div>
  );
}
