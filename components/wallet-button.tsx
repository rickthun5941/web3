"use client";

import { useCallback } from "react";
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

  const handleOpenAccount = useCallback(() => {
    open({ view: "Account" });
  }, [open]);

  const handleDisconnect = useCallback(() => {
    disconnect();
    if (typeof window !== "undefined") {
      localStorage.removeItem("wagmi.store");
      localStorage.removeItem("wagmi.walletconnect");
    }
  }, [disconnect]);

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
        className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-white/10 px-5 py-2 text-sm font-semibold text-white shadow-[0_20px_45px_-20px_rgba(14,165,233,0.85)] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
        onClick={() => open()}
      >
        <span className="absolute inset-0 rounded-full bg-gradient-to-r from-fuchsia-600/80 via-indigo-500/80 to-cyan-500/80 opacity-90 transition duration-300 group-hover:opacity-100" />
        <span className="absolute inset-[-40%] rounded-full bg-gradient-to-r from-white/40 via-transparent to-transparent opacity-0 blur-2xl transition duration-500 group-hover:opacity-60" />
        <span className="relative z-10">{t("wallet.connect")}</span>
      </button>
    );
  }

  return (
    <div className="group relative flex items-center gap-4 overflow-hidden rounded-full border border-white/10 bg-slate-950/60 px-5 py-2 text-sm text-white shadow-[0_20px_50px_-22px_rgba(124,58,237,0.7)] backdrop-blur-md">
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-fuchsia-600/25 via-indigo-500/20 to-cyan-400/20 opacity-90" />
      <span className="pointer-events-none absolute inset-[-45%] bg-[radial-gradient(circle,_rgba(255,255,255,0.4)_0%,_transparent_55%)] opacity-0 blur-3xl transition duration-500 group-hover:opacity-60" />
      <div className="relative flex flex-col text-left">
        <span className="font-semibold tracking-wide">
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
        <span className="text-xs text-slate-300">
          {chain?.name ?? t("wallet.unknownChain")} • {formattedBalance} ETH
        </span>
      </div>
      <div className="relative z-10 flex items-center gap-3">
        <button
          type="button"
          className="relative overflow-hidden rounded-full border border-white/20 px-3 py-1 text-xs font-medium text-white transition duration-300 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
          onClick={handleOpenAccount}
        >
          <span className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/60 via-indigo-500/40 to-fuchsia-500/60 opacity-0 transition duration-300 group-hover:opacity-80" />
          <span className="relative z-10">{t("wallet.manage")}</span>
        </button>
        <button
          type="button"
          className="relative overflow-hidden rounded-full border border-white/20 px-3 py-1 text-xs font-medium text-white transition duration-300 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-400"
          onClick={handleDisconnect}
        >
          <span className="absolute inset-0 rounded-full bg-gradient-to-r from-fuchsia-500/60 via-indigo-500/40 to-cyan-400/60 opacity-0 transition duration-300 group-hover:opacity-80" />
          <span className="relative z-10">{t("wallet.disconnect")}</span>
        </button>
      </div>
    </div>
  );
}
