"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { SVGProps } from "react";
import { useTranslation } from "@/lib/i18n";

type RateStatus = "loading" | "live" | "fallback";

type StablecoinSymbol = "USDT" | "USDC" | "DAI";

type Stablecoin = {
  symbol: StablecoinSymbol;
  name: string;
};

const stablecoins: Stablecoin[] = [
  { symbol: "USDT", name: "Tether USD" },
  { symbol: "USDC", name: "USD Coin" },
  { symbol: "DAI", name: "Dai" },
];

const fallbackRates: Record<StablecoinSymbol, number> = {
  USDT: 3200,
  USDC: 3200,
  DAI: 3200,
};

export function CurrencyConverter() {
  const { t } = useTranslation();
  const [sellAmount, setSellAmount] = useState("0");
  const [selectedStablecoin, setSelectedStablecoin] =
    useState<StablecoinSymbol>("USDT");
  const [rates, setRates] =
    useState<Record<StablecoinSymbol, number>>(fallbackRates);
  const [status, setStatus] = useState<RateStatus>("loading");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const selectorRef = useRef<HTMLDivElement | null>(null);
  const [mode, setMode] =
    useState<"ethToStable" | "stableToEth">("ethToStable");

  const numberFormatter = useMemo(
    () =>
      new Intl.NumberFormat(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }),
    []
  );
  const preciseFormatter = useMemo(
    () =>
      new Intl.NumberFormat(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 6,
      }),
    []
  );

  const fetchRates = useCallback(async () => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      setStatus("loading");
      const response = await fetch(
        "https://api.coinbase.com/v2/prices/ETH-USD/spot"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch ETH spot price.");
      }

      const payload = await response.json();
      const price = Number.parseFloat(payload?.data?.amount);
      if (!Number.isFinite(price)) {
        throw new Error("Invalid rate returned from provider.");
      }

      const liveRates: Record<StablecoinSymbol, number> = {
        USDT: price,
        USDC: price,
        DAI: price,
      };

      setRates(liveRates);
      setStatus("live");
    } catch (error) {
      console.warn("Falling back to static conversion rates:", error);
      setRates(fallbackRates);
      setStatus("fallback");
    }
  }, []);

  useEffect(() => {
    void fetchRates();
  }, [fetchRates]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    function handleClick(event: MouseEvent) {
      if (
        selectorRef.current &&
        !selectorRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, []);

  const isEthToStable = mode === "ethToStable";
  const parsedSell = Number.parseFloat(sellAmount);
  const currentRate = rates[selectedStablecoin] ?? 0;
  const sellValueUsd =
    Number.isFinite(parsedSell) && parsedSell >= 0
      ? isEthToStable
        ? parsedSell * currentRate
        : parsedSell
      : 0;
  const buyValue =
    Number.isFinite(parsedSell) && parsedSell >= 0
      ? isEthToStable
        ? parsedSell * currentRate
        : currentRate > 0
          ? parsedSell / currentRate
          : 0
      : 0;

  const formattedSellCaption = numberFormatter.format(sellValueUsd);
  const formattedBuyAmount = isEthToStable
    ? numberFormatter.format(buyValue)
    : preciseFormatter.format(buyValue);

  const statusLabel =
    status === "live"
      ? t("converter.status.live")
      : status === "loading"
        ? t("converter.status.loading")
        : t("converter.status.fallback");

  const statusClasses =
    status === "live"
      ? "bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30"
      : status === "loading"
        ? "bg-amber-500/20 text-amber-200"
        : "bg-slate-500/20 text-slate-200 hover:bg-slate-500/30";

  function formatInputValue(value: number) {
    if (!Number.isFinite(value) || value <= 0) {
      return "0";
    }
    return Number(value.toPrecision(6)).toString();
  }

  function handleToggleDirection() {
    setIsDropdownOpen(false);
    setSellAmount((previous) => {
      const numeric = Number.parseFloat(previous);
      if (!Number.isFinite(numeric) || numeric < 0) {
        return "0";
      }
      if (isEthToStable) {
        return formatInputValue(numeric * currentRate);
      }
      if (currentRate === 0) {
        return "0";
      }
      return formatInputValue(numeric / currentRate);
    });
    setMode((prev) =>
      prev === "ethToStable" ? "stableToEth" : "ethToStable"
    );
  }

  const stableSelector = (
    attachRef: boolean,
    variant: "button" | "pill" = "button"
  ) => {
    if (variant === "pill") {
      return (
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-gradient-to-r from-fuchsia-500/30 to-pink-500/30 px-4 py-2 text-sm font-semibold text-white shadow">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-fuchsia-500/60 text-base text-white shadow-inner">
            {selectedStablecoin[0]}
          </span>
          <span>{selectedStablecoin}</span>
        </div>
      );
    }

    return (
      <div
        className="relative"
        ref={attachRef ? selectorRef : undefined}
      >
        <button
          type="button"
          onClick={() => setIsDropdownOpen((previous) => !previous)}
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 px-5 py-2 text-sm font-semibold text-white shadow-[0_20px_45px_-20px_rgba(236,72,153,0.9)] transition hover:from-fuchsia-400 hover:to-pink-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-300/50"
        >
          {t("converter.selectToken")}
          <ChevronDownIcon className="h-3 w-3 text-white" />
        </button>
        {isDropdownOpen && (
          <div className="absolute right-0 top-full z-20 mt-2 w-48 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/95 p-1 shadow-2xl backdrop-blur">
            {stablecoins.map((stablecoin) => {
              const isActive = stablecoin.symbol === selectedStablecoin;
              return (
                <button
                  type="button"
                  key={stablecoin.symbol}
                  onClick={() => {
                    setSelectedStablecoin(stablecoin.symbol);
                    setIsDropdownOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm transition hover:bg-white/10 ${
                    isActive ? "bg-white/10 text-white" : "text-slate-200"
                  }`}
                >
                  <span className="font-semibold">
                    {stablecoin.symbol}
                  </span>
                  <span className="text-xs text-slate-400">
                    {stablecoin.name}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const ethPill = (
    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/80 px-4 py-2 shadow">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 text-base font-semibold text-white shadow-inner">
        Ξ
      </span>
      <span className="text-sm font-semibold text-white">ETH</span>
    </div>
  );

  return (
    <section className="relative mx-auto mt-12 max-w-3xl overflow-hidden rounded-[36px] border border-white/10 bg-slate-950/80 px-6 py-12 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)]">
      <div className="pointer-events-none absolute -left-32 top-[-90px] h-80 w-80 rounded-full bg-indigo-500/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-[-80px] h-72 w-72 rounded-full bg-fuchsia-500/25 blur-3xl" />
      <div className="relative z-10 mx-auto max-w-xl space-y-10">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-semibold text-white">
            {t("converter.title")}
          </h2>
          <p className="text-sm text-slate-300">{t("converter.subtitle")}</p>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-black/40 p-6 shadow-inner backdrop-blur">
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-5 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                  {t("converter.sell.label")}
                </span>
                <button
                  type="button"
                  onClick={() => void fetchRates()}
                  disabled={status === "loading"}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide transition focus:outline-none focus:ring-2 focus:ring-white/20 disabled:cursor-not-allowed disabled:opacity-60 ${statusClasses}`}
                >
                  <RefreshCwIcon className="h-3 w-3" />
                  <span>{statusLabel}</span>
                </button>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[8rem]">
                  <input
                    type="number"
                    min={0}
                    step="any"
                    value={sellAmount}
                    onChange={(event) => setSellAmount(event.target.value)}
                    className="w-full border-none bg-transparent text-4xl font-semibold text-white outline-none focus:ring-0"
                    placeholder="0"
                  />
                  <p className="mt-2 text-sm font-medium text-slate-500">
                    {t("converter.sell.caption", { amount: formattedSellCaption })}
                  </p>
                </div>
                {isEthToStable
                  ? ethPill
                  : stableSelector(true)}
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleToggleDirection}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-slate-950 text-slate-200 shadow-lg transition hover:border-fuchsia-400 hover:text-fuchsia-300 focus:outline-none focus:ring-2 focus:ring-fuchsia-300/40"
                aria-label={t("converter.swap")}
              >
                <SwapIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-5 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                  {t("converter.buy.label")}
                </span>
                <span className="text-xs font-medium text-slate-500">
                  {t("converter.buy.caption", {
                    amount: formattedBuyAmount,
                    symbol: isEthToStable ? selectedStablecoin : "ETH",
                  })}
                </span>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[8rem]">
                  <p className="text-4xl font-semibold text-white">
                    {formattedBuyAmount}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    {isEthToStable ? selectedStablecoin : "ETH"}
                  </p>
                </div>
                {isEthToStable
                  ? stableSelector(true)
                  : stableSelector(false, "pill")}
              </div>
            </div>

            <button
              type="button"
              className="w-full rounded-full bg-gradient-to-r from-purple-700 via-fuchsia-600 to-pink-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_24px_60px_-30px_rgba(236,72,153,0.9)] transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-fuchsia-300/50"
            >
              {t("converter.cta")}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400">
          {t("converter.networks")}
        </p>
      </div>
    </section>
  );
}

function ChevronDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M10.5 1.5 6 5.5 1.5 1.5"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SwapIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M6.5 3.5 3.5 6.5l3 3"
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.5 6.5h7"
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinecap="round"
      />
      <path
        d="m13.5 16.5 3-3-3-3"
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.5 13.5h-7"
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinecap="round"
      />
    </svg>
  );
}

function RefreshCwIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M13.333 2.667v3h-3"
        stroke="currentColor"
        strokeWidth={1.3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.667 13.333v-3h3"
        stroke="currentColor"
        strokeWidth={1.3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.047 4.047a5.333 5.333 0 0 1 7.906-.044l.04.044"
        stroke="currentColor"
        strokeWidth={1.3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.953 11.953a5.333 5.333 0 0 1-7.906.044l-.04-.044"
        stroke="currentColor"
        strokeWidth={1.3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
