"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "@/lib/i18n";

type SelectionMode = "manual" | "random";
type BetType = "single" | "redMulti" | "blueMulti" | "fullMulti";

type DoubleColorSelection = {
  redBalls: number[];
  blueBalls: number[];
  mode: SelectionMode;
  betType: BetType;
  combinations: number;
  validationMessage: string | null;
  isValid: boolean;
};

const RED_BALLS = Array.from({ length: 33 }, (_, index) => index + 1);
const BLUE_BALLS = Array.from({ length: 16 }, (_, index) => index + 1);

const MIN_RED_SINGLE = 6;
const MIN_BLUE_SINGLE = 1;

const RED_MULTI_RANGE = { min: 7, max: 20 };
const BLUE_MULTI_RANGE = { min: 2, max: 16 };

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

function calculateCombinationCount(
  betType: BetType,
  redCount: number,
  blueCount: number
): number {
  switch (betType) {
    case "single":
      return redCount === MIN_RED_SINGLE && blueCount === MIN_BLUE_SINGLE
        ? 1
        : 0;
    case "redMulti":
      if (
        redCount < RED_MULTI_RANGE.min ||
        redCount > RED_MULTI_RANGE.max ||
        blueCount !== 1
      ) {
        return 0;
      }
      return combinations(redCount, MIN_RED_SINGLE);
    case "blueMulti":
      if (
        redCount !== MIN_RED_SINGLE ||
        blueCount < BLUE_MULTI_RANGE.min ||
        blueCount > BLUE_MULTI_RANGE.max
      ) {
        return 0;
      }
      return combinations(blueCount, MIN_BLUE_SINGLE);
    case "fullMulti":
      if (
        redCount < RED_MULTI_RANGE.min ||
        redCount > RED_MULTI_RANGE.max ||
        blueCount < BLUE_MULTI_RANGE.min ||
        blueCount > BLUE_MULTI_RANGE.max
      ) {
        return 0;
      }
      return (
        combinations(redCount, MIN_RED_SINGLE) *
        combinations(blueCount, MIN_BLUE_SINGLE)
      );
  }
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

function generateRandomSelection(betType: BetType): {
  redBalls: number[];
  blueBalls: number[];
} {
  switch (betType) {
    case "single":
      return {
        redBalls: getRandomSubset(RED_BALLS, MIN_RED_SINGLE),
        blueBalls: getRandomSubset(BLUE_BALLS, MIN_BLUE_SINGLE),
      };
    case "redMulti": {
      const redSize =
        RED_MULTI_RANGE.min +
        Math.floor(
          Math.random() * (RED_MULTI_RANGE.max - RED_MULTI_RANGE.min + 1)
        );
      return {
        redBalls: getRandomSubset(RED_BALLS, redSize),
        blueBalls: getRandomSubset(BLUE_BALLS, MIN_BLUE_SINGLE),
      };
    }
    case "blueMulti": {
      const blueSize =
        BLUE_MULTI_RANGE.min +
        Math.floor(
          Math.random() * (BLUE_MULTI_RANGE.max - BLUE_MULTI_RANGE.min + 1)
        );
      return {
        redBalls: getRandomSubset(RED_BALLS, MIN_RED_SINGLE),
        blueBalls: getRandomSubset(BLUE_BALLS, blueSize),
      };
    }
    case "fullMulti": {
      const redSize =
        RED_MULTI_RANGE.min +
        Math.floor(
          Math.random() * (RED_MULTI_RANGE.max - RED_MULTI_RANGE.min + 1)
        );
      const blueSize =
        BLUE_MULTI_RANGE.min +
        Math.floor(
          Math.random() * (BLUE_MULTI_RANGE.max - BLUE_MULTI_RANGE.min + 1)
        );
      return {
        redBalls: getRandomSubset(RED_BALLS, redSize),
        blueBalls: getRandomSubset(BLUE_BALLS, blueSize),
      };
    }
  }
}

type DoubleColorConfirmPayload = {
  redBalls: number[];
  blueBalls: number[];
  mode: SelectionMode;
  betType: BetType;
  combinations: number;
};

type DoubleColorPickerProps = {
  onChange?: (selection: DoubleColorSelection) => void;
  onConfirm: (payload: DoubleColorConfirmPayload) => void;
};

export function DoubleColorPicker({
  onChange,
  onConfirm,
}: DoubleColorPickerProps) {
  const { t } = useTranslation();

  const [mode, setMode] = useState<SelectionMode>("manual");
  const [betType, setBetType] = useState<BetType>("single");
  const [redBalls, setRedBalls] = useState<number[]>([]);
  const [blueBalls, setBlueBalls] = useState<number[]>([]);

  const comboCount = useMemo(() => {
    return calculateCombinationCount(betType, redBalls.length, blueBalls.length);
  }, [betType, redBalls.length, blueBalls.length]);

  const validationMessage = useMemo(() => {
    switch (betType) {
      case "single":
        if (redBalls.length !== MIN_RED_SINGLE) {
          return t("purchase.mode.error.red.single");
        }
        if (blueBalls.length !== MIN_BLUE_SINGLE) {
          return t("purchase.mode.error.blue.single");
        }
        return null;
      case "redMulti":
        if (
          redBalls.length < RED_MULTI_RANGE.min ||
          redBalls.length > RED_MULTI_RANGE.max
        ) {
          return t("purchase.mode.error.red.redMulti");
        }
        if (blueBalls.length !== MIN_BLUE_SINGLE) {
          return t("purchase.mode.error.blue.redMulti");
        }
        return null;
      case "blueMulti":
        if (redBalls.length !== MIN_RED_SINGLE) {
          return t("purchase.mode.error.red.blueMulti");
        }
        if (
          blueBalls.length < BLUE_MULTI_RANGE.min ||
          blueBalls.length > BLUE_MULTI_RANGE.max
        ) {
          return t("purchase.mode.error.blue.blueMulti");
        }
        return null;
      case "fullMulti":
        if (
          redBalls.length < RED_MULTI_RANGE.min ||
          redBalls.length > RED_MULTI_RANGE.max
        ) {
          return t("purchase.mode.error.red.fullMulti");
        }
        if (
          blueBalls.length < BLUE_MULTI_RANGE.min ||
          blueBalls.length > BLUE_MULTI_RANGE.max
        ) {
          return t("purchase.mode.error.blue.fullMulti");
        }
        return null;
    }
  }, [betType, redBalls.length, blueBalls.length, t]);

  const isValid = !validationMessage && comboCount > 0;

  const handleRandomize = useCallback(() => {
    const { redBalls: generatedReds, blueBalls: generatedBlues } =
      generateRandomSelection(betType);
    setRedBalls(generatedReds);
    setBlueBalls(generatedBlues);
  }, [betType]);

  useEffect(() => {
    onChange?.({
      redBalls,
      blueBalls,
      mode,
      betType,
      combinations: comboCount,
      validationMessage,
      isValid,
    });
  }, [
    redBalls,
    blueBalls,
    mode,
    betType,
    comboCount,
    validationMessage,
    isValid,
    onChange,
  ]);

  useEffect(() => {
    if (mode === "random") {
      handleRandomize();
    }
  }, [mode, betType, handleRandomize]);

  const toggleNumber = useCallback(
    (value: number, type: "red" | "blue") => {
      if (mode === "random") return;
      if (type === "red") {
        setRedBalls((prev) =>
          prev.includes(value)
            ? prev.filter((item) => item !== value)
            : [...prev, value].sort((a, b) => a - b)
        );
      } else {
        setBlueBalls((prev) =>
          prev.includes(value)
            ? prev.filter((item) => item !== value)
            : [...prev, value].sort((a, b) => a - b)
        );
      }
    },
    [mode]
  );

  const handleClear = () => {
    setRedBalls([]);
    setBlueBalls([]);
  };

  const handleConfirm = () => {
    if (!isValid) return;
    onConfirm({
      redBalls,
      blueBalls,
      betType,
      mode,
      combinations: comboCount,
    });
    handleClear();
  };

  const betTypes: { value: BetType; label: string; helper: string }[] = [
    {
      value: "single",
      label: t("purchase.mode.single"),
      helper: t("purchase.mode.rules.single"),
    },
    {
      value: "redMulti",
      label: t("purchase.mode.redMulti"),
      helper: t("purchase.mode.rules.redMulti"),
    },
    {
      value: "blueMulti",
      label: t("purchase.mode.blueMulti"),
      helper: t("purchase.mode.rules.blueMulti"),
    },
    {
      value: "fullMulti",
      label: t("purchase.mode.fullMulti"),
      helper: t("purchase.mode.rules.fullMulti"),
    },
  ];

  return (
    <section className="rounded-2xl border border-white/10 bg-slate-950/60 p-6 shadow-lg backdrop-blur">
      <header className="space-y-2">
        <h2 className="text-xl font-semibold text-white">
          {t("purchase.mode.sectionTitle")}
        </h2>
        <p className="text-sm text-slate-300">
          {t("purchase.mode.description")}
        </p>
        <p className="text-xs text-slate-500">{t("purchase.mode.hint")}</p>
      </header>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase text-slate-400">
            {t("purchase.mode.manual")} / {t("purchase.mode.random")}
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setMode("manual")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                mode === "manual"
                  ? "bg-indigo-500 text-white shadow"
                  : "bg-white/10 text-slate-200 hover:bg-white/20"
              }`}
            >
              {t("purchase.mode.manual")}
            </button>
            <button
              type="button"
              onClick={() => setMode("random")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                mode === "random"
                  ? "bg-indigo-500 text-white shadow"
                  : "bg-white/10 text-slate-200 hover:bg-white/20"
              }`}
            >
              {t("purchase.mode.random")}
            </button>
            <button
              type="button"
              onClick={() => handleRandomize()}
              className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white/20"
            >
              {t("purchase.mode.randomize")}
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="rounded-full bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10"
            >
              {t("purchase.mode.clear")}
            </button>
          </div>
          <p className="text-xs text-slate-500">
            {mode === "manual"
              ? t("purchase.mode.rules.manual")
              : t("purchase.mode.rules.random")}
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase text-slate-400">
            {t("purchase.mode.totalCombos")}
          </p>
          <p className="text-3xl font-semibold text-white">
            {t("purchase.mode.totalTickets", { count: comboCount })}
          </p>
          <p className="text-xs text-slate-500">
            {t("purchase.summary.quantity")}: {comboCount}
          </p>
          <p className="text-xs text-rose-400">{validationMessage}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {betTypes.map((bet) => {
          const isActive = betType === bet.value;
          return (
            <button
              key={bet.value}
              type="button"
              onClick={() => {
                setBetType(bet.value);
                if (mode === "random") {
                  const { redBalls: generatedReds, blueBalls: generatedBlues } =
                    generateRandomSelection(bet.value);
                  setRedBalls(generatedReds);
                  setBlueBalls(generatedBlues);
                }
              }}
              className={`flex h-full flex-col items-start rounded-2xl border px-4 py-3 text-left transition ${
                isActive
                  ? "border-indigo-400 bg-indigo-500/10 text-white"
                  : "border-white/10 bg-white/5 text-slate-200 hover:border-indigo-300/70 hover:bg-indigo-500/5"
              }`}
            >
              <span className="text-sm font-semibold">{bet.label}</span>
              <span className="mt-1 text-xs text-slate-400">{bet.helper}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <NumberGrid
          title={t("purchase.mode.column.red")}
          selected={redBalls}
          numbers={RED_BALLS}
          onToggle={(value) => toggleNumber(value, "red")}
          accent="red"
          badgeLabel={t("purchase.mode.redCount", { count: redBalls.length })}
        />
        <NumberGrid
          title={t("purchase.mode.column.blue")}
          selected={blueBalls}
          numbers={BLUE_BALLS}
          onToggle={(value) => toggleNumber(value, "blue")}
          accent="blue"
          badgeLabel={t("purchase.mode.blueCount", { count: blueBalls.length })}
        />
      </div>

      <div className="mt-6 flex justify-end">
        {comboCount > 0 && (
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!isValid}
            className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {t("purchase.mode.confirm")}
          </button>
        )}
      </div>
    </section>
  );
}

type NumberGridProps = {
  title: string;
  selected: number[];
  numbers: number[];
  onToggle: (value: number) => void;
  accent: "red" | "blue";
  badgeLabel: string;
};

function NumberGrid({
  title,
  selected,
  numbers,
  onToggle,
  accent,
  badgeLabel,
}: NumberGridProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300">
          {badgeLabel}
        </span>
      </div>
      <div className="grid grid-cols-5 gap-3 sm:grid-cols-6 lg:grid-cols-8">
        {numbers.map((number) => {
          const isSelected = selected.includes(number);
          const selectedStyles =
            accent === "red"
              ? "bg-gradient-to-br from-rose-500 via-rose-400 to-rose-600 text-white shadow-lg shadow-rose-500/40 border-transparent"
              : "bg-gradient-to-br from-sky-500 via-sky-400 to-sky-600 text-white shadow-lg shadow-sky-500/40 border-transparent";

          return (
            <button
              key={number}
              type="button"
              onClick={() => onToggle(number)}
              className={`relative mx-auto flex h-12 w-12 items-center justify-center rounded-full border text-sm font-semibold transition-all duration-200 ease-out sm:h-14 sm:w-14 ${
                isSelected
                  ? selectedStyles + " scale-105"
                  : "border-white/10 bg-slate-900/50 text-slate-200 hover:border-white/40 hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              {number.toString().padStart(2, "0")}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export type {
  DoubleColorSelection,
  SelectionMode,
  BetType,
  DoubleColorConfirmPayload,
};
