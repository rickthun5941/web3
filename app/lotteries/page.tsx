"use client";

import { useEffect, useState } from "react";
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
    <section className="space-y-10">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">
          {t("lotteries.title")}
        </h1>
        <p className="max-w-2xl text-sm text-slate-300">
          {t("lotteries.description")}
        </p>
        <p className="text-xs text-slate-500">
          {refreshTime
            ? t("lotteries.refresh.updated", {
                time: refreshTime.toLocaleTimeString(),
              })
            : t("lotteries.refresh.demo")}
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {lotteries.map((lottery) => (
          <article
            key={lottery.id}
            className="flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur"
          >
            <div className="space-y-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-200">
                #{lottery.id.toString().padStart(3, "0")}
              </span>
              <h2 className="text-xl font-semibold text-white">
                {lottery.title}
              </h2>
              <dl className="grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
                <div>
                  <dt className="font-medium text-slate-200">
                    {t("lotteries.card.jackpot")}
                  </dt>
                  <dd className="mt-1 text-lg font-semibold text-emerald-300">
                    {lottery.jackpot} ETH
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-200">
                    {t("lotteries.card.ticketPrice")}
                  </dt>
                  <dd className="mt-1">{lottery.ticketPrice} ETH</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="font-medium text-slate-200">
                    {t("lotteries.card.closes")}
                  </dt>
                  <dd className="mt-1 font-mono text-xs text-slate-400">
                    {new Date(lottery.closesAt).toLocaleString()}
                  </dd>
                </div>
              </dl>
            </div>
            <Link
              href={`/purchase?lotteryId=${lottery.id}`}
              className="mt-6 inline-flex items-center justify-center rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
            >
              {t("lotteries.card.button")}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
