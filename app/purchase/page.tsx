"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
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
  DoubleColorPicker,
  type DoubleColorConfirmPayload,
  type BetType,
} from "@/components/double-color-picker";
import {
  SINGLE_TICKET_USD,
  SINGLE_TICKET_USD_FORMATTED,
} from "@/lib/pricing";

type PreviewTicket = {
  id: string;
  red: number[];
  blue: number[];
};

type ConfirmedBatch = {
  id: string;
  betType: BetType;
  mode: DoubleColorConfirmPayload["mode"];
  redBalls: number[];
  blueBalls: number[];
  combinations: number;
  preview: PreviewTicket[];
};

const PREVIEW_LIMIT_PER_BATCH = 12;

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

  const totalCombinations = useMemo(
    () => batches.reduce((sum, batch) => sum + batch.combinations, 0),
    [batches]
  );

  const comboCostUsd = useMemo(() => {
    if (totalCombinations <= 0) return "0.00";
    return (totalCombinations * SINGLE_TICKET_USD).toFixed(2);
  }, [totalCombinations]);

  const handleSelectionConfirm = useCallback(
    (payload: DoubleColorConfirmPayload) => {
      const batchId =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

      const previewCombos = generatePreviewCombos(
        payload.betType,
        payload.redBalls,
        payload.blueBalls,
        Math.max(
          1,
          Math.min(payload.combinations, PREVIEW_LIMIT_PER_BATCH)
        )
      );

      const preview = previewCombos.map((combo, index) => {
        const hash = hashString(`${batchId}:${index}`);
        return {
          id: `SSQ-${hash.toString(36).toUpperCase().padStart(6, "0")}`,
          red: combo.red,
          blue: combo.blue,
        };
      });

      setBatches((previous) => [
        ...previous,
        {
          id: batchId,
          betType: payload.betType,
          mode: payload.mode,
          redBalls: payload.redBalls.slice().sort((a, b) => a - b),
          blueBalls: payload.blueBalls.slice().sort((a, b) => a - b),
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
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">
          {t("purchase.title")}
        </h1>
        <p className="max-w-2xl text-sm text-slate-300">
          {t("purchase.description")}
        </p>
        <p className="text-xs text-slate-500">
          {t("purchase.network")}: {chain?.name ?? t("wallet.unknownChain")}
        </p>
      </header>

      <CurrencyConverter />
      <DoubleColorPicker onConfirm={handleSelectionConfirm} />

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-slate-200">
            {t("purchase.form.lotteryId.label")}
            <input
              type="number"
              min={0}
              value={lotteryId}
              onChange={(event) => setLotteryId(event.target.value)}
              className="w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-white focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
              placeholder={t("purchase.form.lotteryId.placeholder")}
              required
            />
          </label>

          <div className="space-y-2 text-sm font-medium text-slate-200">
            {t("purchase.summary.quantity")}
            <div className="rounded-lg border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-white">
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

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting
            ? t("purchase.form.submitting")
            : t("purchase.form.submit")}
        </button>

        <p className="text-xs text-slate-500">
          {t("purchase.form.info")}
        </p>

        {feedback && (
          <div
            className="rounded-lg border border-indigo-500/40 bg-indigo-500/10 px-4 py-3 text-sm text-indigo-100"
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
    <div className="rounded-xl border border-white/10 bg-slate-950/50 p-4 text-sm">
      <p className="text-xs uppercase text-slate-400">{label}</p>
      <p className="mt-2 text-lg font-semibold text-white">{value}</p>
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
    <div className="space-y-4 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-5 text-sm text-slate-200">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-white">
          {t("purchase.mode.ticketPreviewTitle")}
        </h3>
        <span className="text-xs text-slate-400">
          {t("purchase.mode.totalTickets", { count: total })}
        </span>
      </div>
      <p className="text-xs text-slate-400">
        {t("purchase.mode.ticketPreviewDescription")}
      </p>

      <div className="space-y-4">
        {batches.map((batch, index) => (
          <div
            key={batch.id}
            className="rounded-2xl border border-white/10 bg-white/5 p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-white">
                  {t("purchase.preview.groupLabel", { index: index + 1 })}
                </p>
                <p className="text-xs text-slate-400">
                  {t("purchase.mode.totalTickets", {
                    count: batch.combinations,
                  })}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onRemove(batch.id)}
                className="rounded-full border border-indigo-400/40 px-3 py-1 text-xs font-semibold text-indigo-100 transition hover:border-indigo-300 hover:text-white"
              >
                {t("purchase.preview.remove")}
              </button>
            </div>

            <div className="mt-3 space-y-1 text-[11px] text-slate-200">
              <div>
                <span className="font-semibold text-rose-200">R:</span>{" "}
                {formatNumbers(batch.redBalls)}
              </div>
              <div>
                <span className="font-semibold text-sky-200">B:</span>{" "}
                {formatNumbers(batch.blueBalls)}
              </div>
            </div>

            {batch.preview.length > 0 && (
              <>
                <p className="mt-3 text-[11px] uppercase tracking-wide text-slate-500">
                  {t("purchase.preview.samples")}
                </p>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                  {batch.preview.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="space-y-2 rounded-lg border border-indigo-400/40 bg-indigo-500/10 px-3 py-2 font-mono text-xs text-indigo-100"
                    >
                      <div className="text-indigo-200">{ticket.id}</div>
                      <div className="text-[10px] leading-tight text-indigo-100">
                        <span className="font-semibold text-rose-200">R:</span>{" "}
                        {formatNumbers(ticket.red)}
                      </div>
                      <div className="text-[10px] leading-tight text-sky-100">
                        <span className="font-semibold text-sky-200">B:</span>{" "}
                        {formatNumbers(ticket.blue)}
                      </div>
                    </div>
                  ))}
                </div>
                {batch.combinations > batch.preview.length && (
                  <p className="mt-2 text-xs text-slate-500">
                    {t("purchase.mode.ticketPreviewOverflow", {
                      count: batch.preview.length,
                      total: batch.combinations,
                    })}
                  </p>
                )}
              </>
            )}
          </div>
        ))}
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

type PreviewCombo = {
  red: number[];
  blue: number[];
};

function generatePreviewCombos(
  betType: BetType,
  redBalls: number[],
  blueBalls: number[],
  limit: number
) {
  const results: PreviewCombo[] = [];

  const pushCombo = (red: number[], blue: number[]) => {
    if (results.length < limit) {
      results.push({
        red: [...red].sort((a, b) => a - b),
        blue: [...blue].sort((a, b) => a - b),
      });
    }
  };

  const redValues = [...redBalls].sort((a, b) => a - b);
  const blueValues = [...blueBalls].sort((a, b) => a - b);

  switch (betType) {
    case "single": {
      pushCombo(redValues.slice(0, 6), blueValues.slice(0, 1));
      break;
    }
    case "redMulti": {
      const iterator = combinationIterator(redValues, 6);
      const blue = blueValues.slice(0, 1);
      for (const combo of iterator) {
        pushCombo(combo, blue);
        if (results.length >= limit) break;
      }
      break;
    }
    case "blueMulti": {
      const red = redValues.slice(0, 6);
      for (const combo of combinationIterator(blueValues, 1)) {
        pushCombo(red, combo);
        if (results.length >= limit) break;
      }
      break;
    }
    case "fullMulti": {
      for (const redCombo of combinationIterator(redValues, 6)) {
        for (const blueCombo of combinationIterator(blueValues, 1)) {
          pushCombo(redCombo, blueCombo);
          if (results.length >= limit) break;
        }
        if (results.length >= limit) break;
      }
      break;
    }
  }

  return results;
}

function* combinationIterator(values: number[], choose: number) {
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

function formatNumbers(numbers: number[]) {
  return numbers
    .map((number) => number.toString().padStart(2, "0"))
    .join(" ");
}
