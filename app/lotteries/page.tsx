"use client";

import { useEffect, useState } from "react";
import type { ComponentProps } from "react";
import Link from "next/link";
import { ethers } from "ethers";
import {
  LOTTERY_CONTRACT_ADDRESS,
  getLotteryContract,
} from "@/lib/contracts";
import { getReadonlyProvider } from "@/lib/providers";
import { useTranslation } from "@/lib/i18n";

type Lottery = {
  id: number;
  title: string;
  jackpot: string;
  ticketPrice: string;
  closesAt: string;
};

const fallbackLotteries: Lottery[] = [
  {
    id: 1,
    title: "Mega Weekly Draw",
    jackpot: "12.8",
    ticketPrice: "0.05",
    closesAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: 2,
    title: "Community Raffle",
    jackpot: "3.1",
    ticketPrice: "0.01",
    closesAt: new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    id: 3,
    title: "High Roller Flash Pot",
    jackpot: "45.0",
    ticketPrice: "0.25",
    closesAt: new Date(Date.now() + 1000 * 60 * 60 * 6).toISOString(),
  },
];

export default function LotteriesPage() {
  const [lotteries, setLotteries] = useState<Lottery[]>(fallbackLotteries);
  const [refreshTime, setRefreshTime] = useState<Date | null>(null);
  const { t } = useTranslation();
  const accentGradients = [
    "from-fuchsia-500/35 via-transparent to-indigo-500/20",
    "from-cyan-500/30 via-transparent to-emerald-500/20",
    "from-amber-500/30 via-transparent to-pink-500/20",
  ];

  useEffect(() => {
    let cancelled = false;

    async function loadLotteries() {
      try {
        const provider = await getReadonlyProvider();
        if (
          !LOTTERY_CONTRACT_ADDRESS ||
          LOTTERY_CONTRACT_ADDRESS ===
            "0x0000000000000000000000000000000000000000"
        ) {
          throw new Error("Lottery contract address not configured.");
        }

        const contract = getLotteryContract(provider);
        const response = await contract.getActiveLotteries();

        if (cancelled) return;

        const mapped = response.map(
          (lottery: {
            id: bigint;
            title: string;
            jackpot: bigint;
            ticketPrice: bigint;
            closesAt: bigint;
          }) => ({
            id: Number(lottery.id),
            title: lottery.title,
            jackpot: Number.parseFloat(
              ethers.formatEther(lottery.jackpot)
            ).toFixed(2),
            ticketPrice: ethers.formatEther(lottery.ticketPrice),
            closesAt: new Date(Number(lottery.closesAt) * 1000).toISOString(),
          })
        );

        setLotteries(mapped);
        setRefreshTime(new Date());
      } catch (error) {
        console.warn("Falling back to sample lotteries:", error);
        if (!cancelled) {
          setLotteries(fallbackLotteries);
          setRefreshTime(null);
        }
      }
    }

    loadLotteries();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="space-y-12">
      <header className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="space-y-4">
            <span className="accent-pill">
              <TicketIcon className="h-3 w-3 text-white/80" />
              {t("nav.lotteries")}
            </span>
            <h1 className="text-3xl font-semibold text-white md:text-4xl">
              <span className="gradient-text">{t("lotteries.title")}</span>
            </h1>
            <p className="max-w-2xl text-sm text-slate-300/90 md:text-base">
              {t("lotteries.description")}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/50 px-5 py-3 text-xs text-slate-300 shadow-[0_16px_40px_-24px_rgba(124,58,237,0.6)]">
            <p>
              {refreshTime
                ? t("lotteries.refresh.updated", {
                    time: refreshTime.toLocaleTimeString(),
                  })
                : t("lotteries.refresh.demo")}
            </p>
          </div>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {lotteries.map((lottery, index) => {
          const accent =
            accentGradients[index % accentGradients.length];
          return (
            <article
              key={lottery.id}
              className="glow-card flex h-full flex-col justify-between overflow-hidden p-6"
            >
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent} opacity-60`}
              />
              <div className="relative z-10 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-indigo-200">
                    #{lottery.id.toString().padStart(3, "0")}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-white">
                  {lottery.title}
                </h2>
                <div className="nebula-divider" />
                <dl className="grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                      {t("lotteries.card.jackpot")}
                    </dt>
                    <dd className="mt-2 text-lg font-semibold text-emerald-300">
                      {lottery.jackpot} ETH
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                      {t("lotteries.card.ticketPrice")}
                    </dt>
                    <dd className="mt-2 text-slate-300/90">
                      {lottery.ticketPrice} ETH
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                      {t("lotteries.card.closes")}
                    </dt>
                    <dd className="mt-2 font-mono text-xs text-slate-300/80">
                      {new Date(lottery.closesAt).toLocaleString()}
                    </dd>
                  </div>
                </dl>
              </div>
              <Link
                href={`/purchase?lotteryId=${lottery.id}`}
                className="group relative mt-6 inline-flex items-center justify-center overflow-hidden rounded-full border border-white/10 px-5 py-2 text-sm font-semibold text-white transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-400"
              >
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500/80 via-fuchsia-500/70 to-cyan-500/80 opacity-80 transition duration-300 group-hover:opacity-100" />
                <span className="relative z-10">
                  {t("lotteries.card.button")}
                </span>
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function TicketIcon(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path
        d="M5 5h14l2 4-3 3 3 3-2 4H5l-2-4 3-3-3-3 2-4Z"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <path
        d="M11 7v10"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <circle cx={14.5} cy={12} r={1.5} fill="currentColor" />
    </svg>
  );
}
