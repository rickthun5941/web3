"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ComponentProps } from "react";
import { useAccount } from "wagmi";
import { useSearchParams } from "next/navigation";
import { ethers } from "ethers";
import {
  LOTTERY_CONTRACT_ADDRESS,
  getLotteryContract,
} from "@/lib/contracts";
import { getReadonlyProvider, getSigner } from "@/lib/providers";
import { useTranslation } from "@/lib/i18n";
import { CurrencyConverter } from "@/components/currency-converter";
import {
  LotteryPicker,
  type LotteryConfirmPayload,
} from "@/components/lottery-picker";
import {
  SINGLE_TICKET_USD,
  SINGLE_TICKET_USD_FORMATTED,
} from "@/lib/pricing";
import {
  LOTTERY_GAMES,
  LOTTERY_GAME_MAP,
  type LotteryGameDefinition,
  type LotteryGameId,
  type LotteryModeDefinition,
  type LotterySelection,
} from "@/lib/lottery-games";

type PreviewTicket = {
  id: string;
  selections: LotterySelection;
};

type ConfirmedBatch = {
  id: string;
  gameId: LotteryGameId;
  modeId: string;
  selections: LotterySelection;
  combinations: number;
  preview: PreviewTicket[];
};

const PREVIEW_LIMIT_PER_BATCH = 12;
const DEFAULT_GAME_ID =
  (LOTTERY_GAMES[0]?.id as LotteryGameId | undefined) ?? "lottoMax";

export default function PurchasePage() {
  const searchParams = useSearchParams();
  const defaultLotteryId = searchParams?.get("lotteryId") ?? "";

  const { isConnected, chain } = useAccount();
  const { t } = useTranslation();

  const [lotteryId, setLotteryId] = useState(defaultLotteryId);
  const [ticketPriceWei, setTicketPriceWei] = useState<bigint | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [batches, setBatches] = useState<ConfirmedBatch[]>([]);
  const [selectedGameId, setSelectedGameId] =
    useState<LotteryGameId>(DEFAULT_GAME_ID);

  const selectedGame =
    LOTTERY_GAME_MAP[selectedGameId] ??
    LOTTERY_GAME_MAP[DEFAULT_GAME_ID] ??
    LOTTERY_GAMES[0];

  const totalCombinations = useMemo(
    () => batches.reduce((sum, batch) => sum + batch.combinations, 0),
    [batches]
  );

  const comboCostUsd = useMemo(() => {
    if (totalCombinations <= 0) return "0.00";
    return (totalCombinations * SINGLE_TICKET_USD).toFixed(2);
  }, [totalCombinations]);

  const handleSelectionConfirm = useCallback(
    (payload: LotteryConfirmPayload) => {
      const batchId =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

      const game = LOTTERY_GAME_MAP[payload.gameId];
      if (!game) {
        console.warn("Unknown lottery game:", payload.gameId);
        return;
      }

      const mode =
        game.modes.find((item) => item.id === payload.modeId) ??
        game.modes[0];

      const normalizedSelections = normalizeSelections(
        game,
        payload.selections
      );

      const previewCombos = generatePreviewCombos(
        game,
        mode,
        normalizedSelections,
        Math.max(
          1,
          Math.min(payload.combinations, PREVIEW_LIMIT_PER_BATCH)
        )
      );

      const preview = previewCombos.map((combo, index) => {
        const hash = hashString(`${batchId}:${index}`);
        return {
          id: `${game.ticketPrefix}-${hash
            .toString(36)
            .toUpperCase()
            .padStart(6, "0")}`,
          selections: combo,
        };
      });

      setBatches((previous) => [
        ...previous,
        {
          id: batchId,
          gameId: game.id,
          modeId: mode.id,
          selections: normalizedSelections,
          combinations: payload.combinations,
          preview,
        },
      ]);

      setFeedback(null);
    },
    []
  );

  const handleRemoveBatch = useCallback((batchId: string) => {
    setBatches((previous) => previous.filter((batch) => batch.id !== batchId));
    setFeedback(null);
  }, []);

  const handleClearAllBatches = useCallback(() => {
    setBatches([]);
    setFeedback(null);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function fetchTicketPrice() {
      try {
        const provider = await getReadonlyProvider();
        if (
          !LOTTERY_CONTRACT_ADDRESS ||
          LOTTERY_CONTRACT_ADDRESS ===
            "0x0000000000000000000000000000000000000000"
        ) {
          throw new Error("Lottery contract address missing.");
        }

        const contract = getLotteryContract(provider);
        const price = await contract.ticketPrice();
        if (!cancelled) {
          setTicketPriceWei(price);
        }
      } catch (error) {
        console.warn("Falling back to demo ticket price:", error);
        if (!cancelled) {
          setTicketPriceWei(ethers.parseEther("0.05"));
        }
      }
    }

    fetchTicketPrice();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    if (!isConnected) {
      setFeedback(t("purchase.feedback.connectWallet"));
      return;
    }

    if (!ticketPriceWei) {
      setFeedback(t("purchase.feedback.priceUnavailable"));
      return;
    }

    if (totalCombinations <= 0) {
      setFeedback(t("purchase.feedback.noTickets"));
      return;
    }

    const parsedLotteryId = Number.parseInt(lotteryId, 10);

    if (Number.isNaN(parsedLotteryId) || parsedLotteryId < 0) {
      setFeedback(t("purchase.feedback.invalidLotteryId"));
      return;
    }

    try {
      setIsSubmitting(true);
      const signer = await getSigner();
      const contract = getLotteryContract(signer);

      const totalCost = ticketPriceWei * BigInt(totalCombinations);
      const tx = await contract.buyTickets(
        parsedLotteryId,
        totalCombinations,
        {
          value: totalCost,
        }
      );

      setFeedback(t("purchase.feedback.txPending"));
      await tx.wait();
      setFeedback(t("purchase.feedback.txSuccess"));
    } catch (error) {
      console.error("Purchase failed", error);
      const message =
        error instanceof Error ? error.message : "Unknown transaction error.";
      setFeedback(t("purchase.feedback.txFailed", { message }));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="space-y-10">
      <header className="space-y-6">
        <div className="glow-card overflow-hidden px-8 py-9 lg:px-10">
          <div className="pointer-events-none absolute -left-28 top-[-110px] h-72 w-72 rounded-full bg-fuchsia-500/25 blur-3xl" />
          <div className="pointer-events-none absolute -right-32 bottom-[-120px] h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-4">
              <span className="accent-pill">
                <PurchaseIcon className="h-3 w-3 text-white/80" />
                {t("nav.purchase")}
              </span>
              <h1 className="text-3xl font-semibold text-white md:text-4xl">
                <span className="gradient-text">{t("purchase.title")}</span>
              </h1>
              <p className="max-w-2xl text-sm text-slate-300/90 md:text-base">
                {t("purchase.description")}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-xs text-slate-300 shadow-[0_18px_40px_-24px_rgba(14,165,233,0.6)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">
                {t("purchase.network")}
              </p>
              <p className="mt-3 font-mono text-sm text-white">
                {chain?.name ?? t("wallet.unknownChain")}
              </p>
            </div>
          </div>
        </div>
      </header>

      <CurrencyConverter />

      <div className="grid gap-6 lg:grid-cols-[240px,1fr]">
        <GameSelector
          games={LOTTERY_GAMES}
          selectedGameId={selectedGameId}
          onSelect={(id) => setSelectedGameId(id)}
        />
        {selectedGame ? (
          <LotteryPicker game={selectedGame} onConfirm={handleSelectionConfirm} />
        ) : null}
      </div>

      <form
        onSubmit={handleSubmit}
        className="glow-card space-y-6 overflow-hidden p-6 sm:p-8"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <label className="space-y-3 text-sm font-semibold text-slate-100">
            {t("purchase.form.lotteryId.label")}
            <input
              type="number"
              min={0}
              value={lotteryId}
              onChange={(event) => setLotteryId(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white shadow-[0_16px_45px_-32px_rgba(124,58,237,0.7)] focus:border-fuchsia-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/40"
              placeholder={t("purchase.form.lotteryId.placeholder")}
              required
            />
          </label>

          <div className="space-y-3 text-sm font-semibold text-slate-100">
            {t("purchase.summary.quantity")}
            <div className="rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white">
              {totalCombinations}
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <SummaryCard
            label={t("purchase.summary.ticketPriceUsd")}
            value={SINGLE_TICKET_USD_FORMATTED}
          />
          <SummaryCard
            label={t("purchase.summary.groups")}
            value={batches.length.toString()}
          />
          <SummaryCard
            label={t("purchase.summary.quantity")}
            value={totalCombinations.toString()}
          />
          <SummaryCard
            label={t("purchase.summary.totalUsd")}
            value={comboCostUsd}
          />
        </div>

        {batches.length > 0 && (
          <TicketPreview
            batches={batches}
            total={totalCombinations}
            onRemove={handleRemoveBatch}
          />
        )}

        <div className="flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={handleClearAllBatches}
            disabled={batches.length === 0}
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-slate-200 transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="absolute inset-0 rounded-full bg-white/5 opacity-0 transition duration-300 group-hover:opacity-50" />
            <span className="relative z-10">{t("purchase.preview.clearAll")}</span>
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-white/10 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_24px_60px_-30px_rgba(16,185,129,0.9)] transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500/80 via-cyan-500/70 to-fuchsia-500/70 opacity-90 transition duration-300 group-hover:opacity-100" />
            <span className="relative z-10">
              {isSubmitting
                ? t("purchase.form.submitting")
                : t("purchase.form.submit")}
            </span>
          </button>
        </div>

        <p className="text-xs text-slate-500">
          {t("purchase.form.info")}
        </p>

        {feedback && (
          <div
            className="rounded-2xl border border-fuchsia-500/30 bg-fuchsia-500/10 px-4 py-3 text-sm text-fuchsia-100 shadow-[0_16px_40px_-28px_rgba(232,121,249,0.6)]"
            role="status"
          >
            {feedback}
          </div>
        )}
      </form>
    </section>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="glow-card overflow-hidden p-4 text-sm">
      <div className="relative z-10 space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">
          {label}
        </p>
        <p className="text-lg font-semibold text-white">{value}</p>
      </div>
    </div>
  );
}

function GameSelector({
  games,
  selectedGameId,
  onSelect,
}: {
  games: LotteryGameDefinition[];
  selectedGameId: LotteryGameId;
  onSelect: (id: LotteryGameId) => void;
}) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const selectedGame = useMemo(
    () => games.find((game) => game.id === selectedGameId) ?? null,
    [games, selectedGameId]
  );

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  const handleSelect = (id: LotteryGameId) => {
    onSelect(id);
    setIsOpen(false);
  };

  return (
    <div className="glow-card overflow-hidden p-5" ref={containerRef}>
      <div className="relative z-10 space-y-4">
        <label className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">
          {t("purchase.games.selectorTitle")}
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen((previous) => !previous)}
            className="flex w-full items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm font-semibold text-slate-100 transition duration-300 hover:border-fuchsia-400/60 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-400"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
          >
            <span>
              {selectedGame
                ? t(selectedGame.nameKey)
                : t("purchase.games.selectorPlaceholder")}
            </span>
            <span className="text-xs text-slate-400">
              {isOpen ? "▲" : "▼"}
            </span>
          </button>

          {isOpen && (
            <ul
              role="listbox"
              className="absolute left-0 right-0 z-20 mt-2 max-h-72 overflow-y-auto rounded-2xl border border-white/10 bg-slate-950/95 shadow-2xl backdrop-blur"
            >
              {games.map((game) => {
                const active = game.id === selectedGameId;
                return (
                  <li key={game.id}>
                    <button
                      type="button"
                      onClick={() => handleSelect(game.id)}
                      role="option"
                      aria-selected={active}
                      className={`flex w-full items-center justify-between px-4 py-3 text-sm transition duration-200 ${
                        active
                          ? "rounded-xl bg-fuchsia-500/20 text-fuchsia-100"
                          : "text-slate-200 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <span>{t(game.nameKey)}</span>
                      {active && (
                        <span className="text-xs uppercase text-fuchsia-200">
                          {t("purchase.games.selected")}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function TicketPreview({
  batches,
  total,
  onRemove,
}: {
  batches: ConfirmedBatch[];
  total: number;
  onRemove: (id: string) => void;
}) {
  const { t } = useTranslation();

  if (batches.length === 0) {
    return null;
  }

  return (
    <div className="glow-card space-y-4 overflow-hidden p-5 text-sm text-slate-200">
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-white">
          {t("purchase.games.preview.title")}
        </h3>
        <span className="text-xs text-slate-400">
          {t("purchase.games.totalTickets", { count: total })}
        </span>
      </div>
      <p className="relative z-10 text-xs text-slate-400">
        {t("purchase.games.preview.description")}
      </p>

      <div className="relative z-10 space-y-4">
        {batches.map((batch, index) => {
          const game = LOTTERY_GAME_MAP[batch.gameId];
          if (!game) {
            return null;
          }
          const mode =
            game.modes.find((item) => item.id === batch.modeId) ??
            game.modes[0];

          return (
            <div
              key={batch.id}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-white">
                    {t("purchase.preview.groupLabel", { index: index + 1 })}
                  </p>
                  <p className="text-xs text-slate-400">
                    {t(game.nameKey)} · {t(mode.labelKey)}
                  </p>
                  <p className="text-xs text-slate-400">
                    {t("purchase.games.totalTickets", {
                      count: batch.combinations,
                    })}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(batch.id)}
                  className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-white/15 px-3 py-1 text-xs font-semibold text-slate-100 transition duration-300 hover:text-white"
                >
                  <span className="absolute inset-0 rounded-full bg-white/10 opacity-0 transition duration-300 group-hover:opacity-60" />
                  <span className="relative z-10">
                    {t("purchase.preview.remove")}
                  </span>
                </button>
              </div>

              <div className="mt-3 space-y-1 text-[11px] text-slate-200">
                {game.pools.map((pool) => (
                  <div key={pool.id}>
                    <span className="font-semibold text-indigo-200">
                      {t(pool.labelKey)}:
                    </span>{" "}
                    {formatNumbers(
                      batch.selections[pool.id] ?? [],
                      pool.padTo ?? 2
                    )}
                  </div>
                ))}
              </div>

              {batch.preview.length > 0 && (
                <>
                  <p className="mt-3 text-[11px] uppercase tracking-[0.24em] text-slate-500">
                    {t("purchase.preview.samples")}
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                    {batch.preview.map((ticket) => (
                      <div
                        key={ticket.id}
                        className="space-y-2 rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 font-mono text-xs text-indigo-100"
                      >
                        <div className="text-indigo-200">{ticket.id}</div>
                        {game.pools.map((pool) => (
                          <div
                            key={pool.id}
                            className="text-[10px] leading-tight text-indigo-100"
                          >
                            <span className="font-semibold text-indigo-200">
                              {t(pool.labelKey)}:
                            </span>{" "}
                            {formatNumbers(
                              ticket.selections[pool.id] ?? [],
                              pool.padTo ?? 2
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                  {batch.combinations > batch.preview.length && (
                    <p className="mt-2 text-xs text-slate-500">
                      {t("purchase.games.preview.overflow", {
                        count: batch.preview.length,
                        total: batch.combinations,
                      })}
                    </p>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function hashString(input: string) {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    const character = input.charCodeAt(index);
    hash = (hash << 5) - hash + character;
    hash |= 0;
  }
  return Math.abs(hash);
}

function generatePreviewCombos(
  game: LotteryGameDefinition,
  mode: LotteryModeDefinition,
  selections: LotterySelection,
  limit: number
) {
  const results: LotterySelection[] = [];

  function backtrack(index: number, current: LotterySelection) {
    if (results.length >= limit) return;
    if (index >= game.pools.length) {
      results.push(
        Object.fromEntries(
          Object.entries(current).map(([poolId, values]) => [
            poolId,
            [...values].sort((a, b) => a - b),
          ])
        )
      );
      return;
    }

    const pool = game.pools[index];
    const requirement = mode.poolRequirements[pool.id];
    if (!requirement) {
      backtrack(index + 1, current);
      return;
    }

    const selected = selections[pool.id] ?? [];
    const choose = requirement.min;
    if (selected.length < choose) {
      return;
    }

    const combosIterable =
      selected.length === choose
        ? [selected]
        : combinationIterator(selected, choose);

    for (const combo of combosIterable) {
      if (results.length >= limit) break;
      backtrack(index + 1, {
        ...current,
        [pool.id]: [...combo].sort((a, b) => a - b),
      });
    }
  }

  backtrack(0, {});
  return results;
}

function* combinationIterator(
  values: number[],
  choose: number
): Generator<number[]> {
  const combination: number[] = [];

  function* backtrack(start: number, k: number): Generator<number[]> {
    if (k === 0) {
      yield combination.slice();
      return;
    }

    for (let index = start; index <= values.length - k; index += 1) {
      combination.push(values[index]);
      yield* backtrack(index + 1, k - 1);
      combination.pop();
    }
  }

  yield* backtrack(0, choose);
}

function normalizeSelections(
  game: LotteryGameDefinition,
  selections: LotterySelection
): LotterySelection {
  return game.pools.reduce<LotterySelection>((accumulator, pool) => {
    const values = selections[pool.id] ?? [];
    accumulator[pool.id] = [...values].sort((a, b) => a - b);
    return accumulator;
  }, {});
}

function formatNumbers(numbers: number[], padTo = 2) {
  return numbers.map((number) => number.toString().padStart(padTo, "0")).join(" ");
}

function PurchaseIcon(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <rect
        x={2.5}
        y={6}
        width={19}
        height={12}
        rx={2.5}
        stroke="currentColor"
        strokeWidth={1.5}
      />
      <path
        d="M2.5 10h19"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <path
        d="M8.5 14h3"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <circle cx={17.5} cy={14} r={1.5} fill="currentColor" />
    </svg>
  );
}
