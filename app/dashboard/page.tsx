"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import {
  LOTTERY_CONTRACT_ADDRESS,
  getLotteryContract,
} from "@/lib/contracts";
import { getReadonlyProvider } from "@/lib/providers";
import { SINGLE_TICKET_USD_FORMATTED } from "@/lib/pricing";
import { useTranslation } from "@/lib/i18n";
import type { ComponentProps, ReactElement } from "react";

type DashboardStats = {
  jackpot: string;
  ticketPrice: string;
  totalSold: string;
};

type DashboardStatus = "loading" | "ready" | "fallback";

const fallbackStats: DashboardStats = {
  jackpot: "25.4",
  ticketPrice: SINGLE_TICKET_USD_FORMATTED,
  totalSold: "6,420",
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(fallbackStats);
  const [status, setStatus] = useState<DashboardStatus>("loading");
  const { t } = useTranslation();

  const featureCards: FeatureCardConfig[] = [
    {
      badge: "L1 / L2",
      title: t("dashboard.features.decentralized.title"),
      description: t("dashboard.features.decentralized.body"),
      accent: "from-fuchsia-600/40 via-purple-500/10 to-transparent",
      icon: <OrbitIcon className="h-8 w-8 text-fuchsia-300" />,
    },
    {
      badge: "Audit trail",
      title: t("dashboard.features.secure.title"),
      description: t("dashboard.features.secure.body"),
      accent: "from-emerald-500/30 via-emerald-500/10 to-transparent",
      icon: <ShieldIcon className="h-8 w-8 text-emerald-300" />,
    },
    {
      badge: "Anon by default",
      title: t("dashboard.features.privacy.title"),
      description: t("dashboard.features.privacy.body"),
      accent: "from-sky-500/30 via-blue-500/10 to-transparent",
      icon: <MaskIcon className="h-8 w-8 text-sky-300" />,
    },
    {
      badge: "Contracts",
      title: t("dashboard.features.contracts.title"),
      description: t("dashboard.features.contracts.body"),
      accent: "from-orange-500/30 via-amber-500/10 to-transparent",
      icon: <CircuitIcon className="h-8 w-8 text-amber-300" />,
    },
    {
      badge: "Multi-chain",
      title: t("dashboard.features.assets.title"),
      description: t("dashboard.features.assets.body"),
      accent: "from-cyan-500/30 via-cyan-500/10 to-transparent",
      icon: <CoinsIcon className="h-8 w-8 text-cyan-300" />,
    },
    {
      badge: "Global",
      title: t("dashboard.features.global.title"),
      description: t("dashboard.features.global.body"),
      accent: "from-pink-500/30 via-rose-500/10 to-transparent",
      icon: <GlobeIcon className="h-8 w-8 text-pink-300" />,
    },
  ];

  const statusStyles: Record<DashboardStatus, string> = {
    ready: "bg-emerald-500/15 text-emerald-200 shadow-[0_0_0_1px_rgba(16,185,129,0.25)]",
    loading: "bg-amber-500/15 text-amber-200 shadow-[0_0_0_1px_rgba(251,191,36,0.28)]",
    fallback: "bg-slate-500/15 text-slate-300 shadow-[0_0_0_1px_rgba(148,163,184,0.18)]",
  };

  const statusDotClasses: Record<DashboardStatus, string> = {
    ready: "bg-emerald-400 shadow-[0_0_16px_rgba(16,185,129,0.7)]",
    loading: "bg-amber-300 animate-pulse shadow-[0_0_16px_rgba(251,191,36,0.6)]",
    fallback: "bg-slate-400",
  };

  const statusLabel =
    status === "ready"
      ? t("dashboard.status.live")
      : status === "loading"
        ? t("dashboard.status.loading")
        : t("dashboard.status.fallback");

  useEffect(() => {
    let cancelled = false;

    async function loadStats() {
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
        const [jackpot, totalSold] = await Promise.all([
          contract.jackpot(),
          contract.totalSold(),
        ]);

        if (cancelled) return;
        setStats({
          jackpot: Number.parseFloat(ethers.formatEther(jackpot)).toFixed(2),
          ticketPrice: SINGLE_TICKET_USD_FORMATTED,
          totalSold: totalSold.toLocaleString(),
        });
        setStatus("ready");
      } catch (error) {
        console.warn("Falling back to sample stats:", error);
        if (!cancelled) {
          setStats(fallbackStats);
          setStatus("fallback");
        }
      }
    }

    loadStats();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="space-y-12">
      <header className="space-y-6">
        <div className="glow-card overflow-hidden px-8 py-10 lg:px-12">
          <div className="pointer-events-none absolute -left-28 top-[-140px] h-72 w-72 rounded-full bg-fuchsia-500/35 blur-3xl" />
          <div className="pointer-events-none absolute -right-32 bottom-[-140px] h-80 w-80 rounded-full bg-cyan-500/25 blur-3xl" />
          <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-6">
              <span className="accent-pill">
                <SparkIcon className="h-3 w-3 text-white/80" />
                {t("dashboard.hero.heading")}
              </span>
              <h1 className="text-4xl font-semibold text-white md:text-5xl">
                <span className="gradient-text">{t("dashboard.title")}</span>
              </h1>
              <p className="max-w-2xl text-sm text-slate-200/90 md:text-base">
                {t("dashboard.hero.body")}
              </p>
            </div>
            <div className="flex flex-col items-start gap-4">
              <span
                className={`inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.32em] transition duration-300 ${statusStyles[status]}`}
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full ${statusDotClasses[status]}`}
                />
                {statusLabel}
              </span>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-xs text-slate-300 shadow-[0_18px_40px_-24px_rgba(59,130,246,0.6)]">
                <p>{t("dashboard.description")}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          title={t("dashboard.stat.jackpot.title")}
          value={stats.jackpot}
          helper={t("dashboard.stat.jackpot.helper")}
          accent="from-fuchsia-500/30 to-purple-500/10"
        />
        <StatCard
          title={t("dashboard.stat.ticketPrice.title")}
          value={stats.ticketPrice}
          helper={t("dashboard.stat.ticketPrice.helper")}
          accent="from-sky-500/30 to-cyan-500/10"
        />
        <StatCard
          title={t("dashboard.stat.totalSold.title")}
          value={stats.totalSold}
          helper={t("dashboard.stat.totalSold.helper")}
          accent="from-lime-500/30 to-emerald-500/10"
        />
      </div>

      <section className="glow-card overflow-hidden px-8 py-10">
        <div className="pointer-events-none absolute -left-24 top-[-80px] h-56 w-56 rounded-full bg-fuchsia-500/25 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-[-70px] h-60 w-60 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="relative z-10 space-y-8">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-white md:text-3xl">
              {t("dashboard.features.title")}
            </h2>
            <p className="max-w-2xl text-sm text-slate-300/90 md:text-base">
              {t("dashboard.features.subtitle")}
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featureCards.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      <div className="glow-card overflow-hidden p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-28 top-[-80px] h-56 w-56 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="relative z-10 space-y-6">
          <h2 className="text-xl font-semibold text-white">
            {t("dashboard.config.title")}
          </h2>
          <dl className="grid gap-4 text-sm text-slate-300 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                {t("dashboard.config.contract")}
              </dt>
              <dd className="mt-2 break-all font-mono text-xs text-slate-300/80">
                {LOTTERY_CONTRACT_ADDRESS}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                {t("dashboard.config.provider")}
              </dt>
              <dd className="mt-2 text-slate-300/80">
                {process.env.NEXT_PUBLIC_RPC_URL ??
                  "https://ethereum-sepolia.publicnode.com"}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}

type StatCardProps = {
  title: string;
  value: string;
  helper: string;
  accent:
    | "from-fuchsia-500/30 to-purple-500/10"
    | "from-sky-500/30 to-cyan-500/10"
    | "from-lime-500/30 to-emerald-500/10";
};

function StatCard({ title, value, helper, accent }: StatCardProps) {
  return (
    <div className="glow-card overflow-hidden p-6">
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent} opacity-60`}
      />
      <div className="relative z-10 space-y-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-300">
          {title}
        </p>
        <p className="text-4xl font-semibold text-white">{value}</p>
        <div className="nebula-divider" />
        <p className="text-xs text-slate-400">{helper}</p>
      </div>
    </div>
  );
}

type FeatureCardConfig = {
  badge: string;
  title: string;
  description: string;
  accent: string;
  icon: ReactElement;
};

function FeatureCard({ badge, title, description, accent, icon }: FeatureCardConfig) {
  return (
    <div className="glow-card overflow-hidden p-6">
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent} opacity-60`}
      />
      <div className="relative z-10 flex flex-col gap-6">
        <div className="flex items-center justify-between gap-3">
          <span className="accent-pill">
            <SparkIcon className="h-3 w-3 text-white/80" />
            {badge}
          </span>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white/80 shadow-inner">
            {icon}
          </div>
        </div>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <div className="nebula-divider" />
        <p className="text-sm leading-relaxed text-slate-300">{description}</p>
      </div>
    </div>
  );
}

function SparkIcon(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path
        d="M12 3v4M12 17v4M5.636 5.636l2.829 2.828M15.535 15.536l2.829 2.828M3 12h4M17 12h4M5.636 18.364l2.829-2.828M15.535 8.464l2.829-2.828"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </svg>
  );
}

function OrbitIcon(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden {...props}>
      <circle cx="16" cy="16" r="4.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M5 9c3.5-4 19.5-4 23 0M5 23c3.5 4 19.5 4 23 0"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle cx="7" cy="9" r="2" fill="currentColor" />
      <circle cx="25" cy="23" r="2" fill="currentColor" />
    </svg>
  );
}

function ShieldIcon(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden {...props}>
      <path
        d="M16 4 6 8v8c0 6.6 4.4 11.6 10 12 5.6-.4 10-5.4 10-12V8l-10-4Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 16.5 14.8 19 20 13"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MaskIcon(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden {...props}>
      <path
        d="M6 11.5C6 8 11 5 16 5s10 3 10 6.5S21 18 16 18 6 15 6 11.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 20c0 3 5 6.5 10 6.5S26 23 26 20"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 11.5c0 .6-.7 1-1.5 1s-1.5-.4-1.5-1 .7-1 1.5-1 1.5.4 1.5 1Zm9 0c0 .6-.7 1-1.5 1s-1.5-.4-1.5-1 .7-1 1.5-1 1.5.4 1.5 1Z"
        fill="currentColor"
      />
      <path
        d="M12.5 21.5c1.2 1 5.8 1 7 0"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CircuitIcon(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden {...props}>
      <path
        d="M9 7h10l4 4v14H9V7Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M19 7v6h6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <circle cx="12" cy="20" r="2" fill="currentColor" />
      <circle cx="20" cy="20" r="2" fill="currentColor" />
      <path
        d="M12 14v4m2-2h4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CoinsIcon(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden {...props}>
      <ellipse
        cx="14"
        cy="9"
        rx="8"
        ry="4"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M6 9v6c0 2.2 3.6 4 8 4s8-1.8 8-4V9"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M6 15v6c0 2.2 3.6 4 8 4 1.29.02 2.58-.11 3.82-.39"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M20 13.8C21.868 13.087 23 12.087 23 11c0-1.06-1.083-2.04-2.886-2.744"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="23.5" cy="20.5" r="4.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M23.5 17v3l2 1"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GlobeIcon(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden {...props}>
      <circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M6.4 20c2.3-1.3 6-2 9.6-2 3.6 0 7.3.7 9.6 2"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M16 6c2.2 2.4 3.5 6 3.5 10S18.2 23.6 16 26c-2.2-2.4-3.5-6-3.5-10S13.8 8.4 16 6Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M6 16h20"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
