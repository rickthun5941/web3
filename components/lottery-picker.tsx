"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useTranslation } from "@/lib/i18n";
import {
  type LotteryGameDefinition,
  type LotteryModeDefinition,
  type LotterySelection,
  type LotteryPoolDefinition,
} from "@/lib/lottery-games";

type SelectionStyle = "manual" | "random";

export type LotteryConfirmPayload = {
  gameId: LotteryGameDefinition["id"];
  modeId: LotteryModeDefinition["id"];
  selections: LotterySelection;
  combinations: number;
};

export type LotteryPickerState = {
  selections: LotterySelection;
  modeId: LotteryModeDefinition["id"];
  style: SelectionStyle;
  combinations: number;
  validationMessage: string | null;
  isValid: boolean;
};

export type LotteryPickerProps = {
  game: LotteryGameDefinition;
  onConfirm: (payload: LotteryConfirmPayload) => void;
  onChange?: (state: LotteryPickerState) => void;
};

function factorial(n: number): number {
  let result = 1;
  for (let index = 2; index <= n; index += 1) {
    result *= index;
  }
  return result;
}

function combinations(n: number, k: number): number {
  if (k < 0 || n < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  return factorial(n) / (factorial(k) * factorial(n - k));
}

function getMode(
  game: LotteryGameDefinition,
  modeId: LotteryModeDefinition["id"]
) {
  return game.modes.find((item) => item.id === modeId) ?? game.modes[0];
}

function getNumberPool(pool: LotteryPoolDefinition) {
  const numbers: number[] = [];
  for (let index = pool.start; index <= pool.end; index += 1) {
    numbers.push(index);
  }
  return numbers;
}

function getRandomSubset(pool: number[], count: number) {
  const clone = [...pool];
  const selection: number[] = [];
  while (selection.length < count && clone.length > 0) {
    const index = Math.floor(Math.random() * clone.length);
    selection.push(clone.splice(index, 1)[0]);
  }
  return selection.sort((a, b) => a - b);
}

function generateRandomSelection(
  game: LotteryGameDefinition,
  mode: LotteryModeDefinition
): LotterySelection {
  const result: LotterySelection = {};
  for (const pool of game.pools) {
    const requirement = mode.poolRequirements[pool.id];
    if (!requirement) continue;
    const numbers = getNumberPool(pool);
    result[pool.id] = getRandomSubset(numbers, requirement.max);
  }
  return result;
}

function calculateCombinationCount(
  game: LotteryGameDefinition,
  mode: LotteryModeDefinition,
  selections: LotterySelection
) {
  let total = 1;
  for (const pool of game.pools) {
    const requirement = mode.poolRequirements[pool.id];
    if (!requirement) continue;
    const selected = selections[pool.id] ?? [];
    if (
      selected.length < requirement.min ||
      selected.length > requirement.max
    ) {
      return 0;
    }
    total *= combinations(selected.length, requirement.min);
  }
  return total;
}

export function LotteryPicker({ game, onConfirm, onChange }: LotteryPickerProps) {
  const { t } = useTranslation();
  const [modeId, setModeId] = useState(game.defaultModeId);
  const [style, setStyle] = useState<SelectionStyle>("manual");
  const [selections, setSelections] = useState<LotterySelection>({});

  const mode = useMemo(() => getMode(game, modeId), [game, modeId]);

  const combinationCount = useMemo(() => {
    return calculateCombinationCount(game, mode, selections);
  }, [game, mode, selections]);

  const validationMessage = useMemo(() => {
    for (const pool of game.pools) {
      const requirement = mode.poolRequirements[pool.id];
      if (!requirement) continue;
      const selected = selections[pool.id] ?? [];
      if (
        selected.length < requirement.min ||
        selected.length > requirement.max
      ) {
        const key = mode.errorKeys[pool.id];
        if (!key) continue;
        return t(key, {
          min: requirement.min,
          max: requirement.max,
          label: t(pool.labelKey),
        });
      }
    }
    if (combinationCount <= 0 && mode.totalErrorKey) {
      return t(mode.totalErrorKey);
    }
    return null;
  }, [combinationCount, game.pools, mode, selections, t]);

  const isValid = !validationMessage && combinationCount > 0;

  useEffect(() => {
    setModeId(game.defaultModeId);
    setSelections({});
    setStyle("manual");
  }, [game]);

  useEffect(() => {
    if (style === "random") {
      setSelections(generateRandomSelection(game, mode));
    }
  }, [style, game, mode]);

  useEffect(() => {
    onChange?.({
      selections,
      modeId,
      style,
      combinations: combinationCount,
      validationMessage,
      isValid,
    });
  }, [
    selections,
    modeId,
    style,
    combinationCount,
    validationMessage,
    isValid,
    onChange,
  ]);

  const handleToggle = useCallback(
    (poolId: string, value: number) => {
      if (style === "random") return;
      setSelections((previous) => {
        const current = previous[poolId] ?? [];
        if (current.includes(value)) {
          return {
            ...previous,
            [poolId]: current.filter((item) => item !== value),
          };
        }
        return {
          ...previous,
          [poolId]: [...current, value].sort((a, b) => a - b),
        };
      });
    },
    [style]
  );

  const handleRandomize = useCallback(() => {
    setSelections(generateRandomSelection(game, mode));
  }, [game, mode]);

  const handleClear = useCallback(() => {
    setSelections({});
  }, []);

  const handleConfirm = useCallback(() => {
    if (!isValid) return;
    onConfirm({
      gameId: game.id,
      modeId: mode.id,
      selections,
      combinations: combinationCount,
    });
    handleClear();
  }, [game.id, mode.id, selections, combinationCount, isValid, onConfirm, handleClear]);

  useEffect(() => {
    if (style === "random") {
      handleRandomize();
    }
  }, [mode.id, style, handleRandomize]);

  return (
    <section className="glow-card overflow-hidden p-6 sm:p-8">
      <div className="pointer-events-none absolute -right-28 top-[-110px] h-72 w-72 rounded-full bg-fuchsia-500/25 blur-3xl" />
      <div className="pointer-events-none absolute -left-36 bottom-[-120px] h-80 w-80 rounded-full bg-cyan-500/25 blur-3xl" />
      <div className="relative z-10 space-y-6">
        <header className="space-y-2">
          <h2 className="text-xl font-semibold text-white">
            <span className="gradient-text">{t(game.nameKey)}</span>
          </h2>
          <p className="text-sm text-slate-300">{t(game.descriptionKey)}</p>
          <p className="text-xs text-slate-500">{t(game.hintKey)}</p>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">
              {t("purchase.games.selectionStyle")}
            </p>
            <div className="flex flex-wrap gap-3">
              <StyleButton
                active={style === "manual"}
                label={t("purchase.games.manual")}
                onClick={() => setStyle("manual")}
              />
              <StyleButton
                active={style === "random"}
                label={t("purchase.games.random")}
                onClick={() => setStyle("random")}
              />
              <GhostButton onClick={handleRandomize}>
                {t("purchase.games.randomize")}
              </GhostButton>
              <GhostButton variant="subtle" onClick={handleClear}>
                {t("purchase.games.clear")}
              </GhostButton>
            </div>
            <p className="text-xs text-slate-500">
              {style === "manual"
                ? t("purchase.games.manualHelper")
                : t("purchase.games.randomHelper")}
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">
              {t("purchase.games.totalCombos")}
            </p>
            <p className="text-3xl font-semibold text-white">
              {t("purchase.games.totalTickets", { count: combinationCount })}
            </p>
            <p className="text-xs text-slate-500">
              {t("purchase.summary.quantity")}: {combinationCount}
            </p>
            {validationMessage ? (
              <p className="text-xs text-rose-400">{validationMessage}</p>
            ) : null}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {game.modes.map((option) => {
            const active = option.id === mode.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setModeId(option.id)}
                className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-left transition duration-300 ${
                  active ? "text-white" : "text-slate-200 hover:text-white"
                }`}
              >
                <span
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-fuchsia-500/25 via-transparent to-cyan-500/25 opacity-0 transition duration-300 ${
                    active ? "opacity-90" : "group-hover:opacity-60"
                  }`}
                />
                <span className="relative z-10 text-sm font-semibold">
                  {t(option.labelKey)}
                </span>
                <span className="relative z-10 mt-1 block text-xs text-slate-400">
                  {t(option.helperKey)}
                </span>
              </button>
            );
          })}
        </div>

        <div className="space-y-8">
          {game.pools.map((pool) => (
            <NumberGrid
              key={pool.id}
              pool={pool}
              selected={selections[pool.id] ?? []}
              onToggle={(value) => handleToggle(pool.id, value)}
              requirement={mode.poolRequirements[pool.id]}
            />
          ))}
        </div>

        <div className="flex justify-end">
          {combinationCount > 0 && (
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!isValid}
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-white/10 px-5 py-2 text-sm font-semibold text-white shadow-[0_24px_60px_-30px_rgba(16,185,129,0.9)] transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500/80 via-cyan-500/70 to-fuchsia-500/70 opacity-90 transition duration-300 group-hover:opacity-100" />
              <span className="relative z-10">
                {t("purchase.games.confirm")}
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

function StyleButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative overflow-hidden rounded-full px-4 py-2 text-sm font-semibold transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-400 ${
        active ? "text-white" : "text-slate-200 hover:text-white"
      }`}
    >
      <span
        className={`absolute inset-0 rounded-full bg-gradient-to-r from-fuchsia-500/70 via-indigo-500/60 to-cyan-500/60 opacity-0 transition duration-300 ${
          active ? "opacity-90" : "group-hover:opacity-60"
        }`}
      />
      <span className="relative z-10">{label}</span>
    </button>
  );
}

function GhostButton({
  children,
  onClick,
  variant = "default",
}: {
  children: ReactNode;
  onClick: () => void;
  variant?: "default" | "subtle";
}) {
  const textClass =
    variant === "subtle" ? "text-slate-300 hover:text-white" : "text-slate-100";
  const overlayClass = variant === "subtle" ? "bg-white/5" : "bg-white/10";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative overflow-hidden rounded-full px-4 py-2 text-sm font-semibold transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-400 ${textClass}`}
    >
      <span
        className={`absolute inset-0 rounded-full ${overlayClass} opacity-0 transition duration-300 group-hover:opacity-60`}
      />
      <span className="relative z-10">{children}</span>
    </button>
  );
}

type NumberGridProps = {
  pool: LotteryPoolDefinition;
  selected: number[];
  onToggle: (value: number) => void;
  requirement?: { min: number; max: number };
};

function NumberGrid({
  pool,
  selected,
  onToggle,
  requirement,
}: NumberGridProps) {
  const { t } = useTranslation();
  const numbers = useMemo(() => getNumberPool(pool), [pool]);
  const badgeLabel =
    requirement && requirement.min === requirement.max
      ? t("purchase.games.selectedExact", {
          count: selected.length,
          required: requirement.min,
        })
      : t("purchase.games.selectedRange", {
          count: selected.length,
          min: requirement?.min ?? 0,
          max: requirement?.max ?? 0,
        });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">
          {t(pool.labelKey)}
        </h3>
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-200">
          {badgeLabel}
        </span>
      </div>
      <div className="grid grid-cols-5 gap-3 sm:grid-cols-6 lg:grid-cols-8">
        {numbers.map((number) => {
          const isSelected = selected.includes(number);
          return (
            <button
              key={number}
              type="button"
              onClick={() => onToggle(number)}
              className={`group relative mx-auto flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-slate-900/60 text-sm font-semibold transition duration-200 ease-out sm:h-14 sm:w-14 ${
                isSelected
                  ? "border-transparent text-white shadow-[0_20px_50px_-25px_rgba(124,58,237,0.9)]"
                  : "text-slate-200 hover:border-white/30 hover:text-white"
              }`}
            >
              <span
                className={`absolute inset-0 rounded-full bg-gradient-to-br from-fuchsia-500 via-indigo-500 to-cyan-500 opacity-0 transition duration-200 ${
                  isSelected ? "opacity-100" : "group-hover:opacity-60"
                }`}
              />
              <span className="relative z-10 font-semibold">
                {pool.padTo
                  ? number.toString().padStart(pool.padTo, "0")
                  : number.toString()}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
