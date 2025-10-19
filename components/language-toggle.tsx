"use client";

import { useMemo } from "react";
import { useTranslation, type Locale } from "@/lib/i18n";

const localeLabelKeys: Record<Locale, string> = {
  en: "language.english",
  zh: "language.chinese",
  ko: "language.korean",
};

export function LanguageToggle() {
  const { locale, setLocale, t } = useTranslation();

  const options = useMemo(() => {
    return (Object.keys(localeLabelKeys) as Locale[]).map((code) => ({
      code,
      label: t(localeLabelKeys[code]),
    }));
  }, [t]);

  return (
    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1 text-xs text-white backdrop-blur">
      {options.map(({ code, label }) => {
        const isActive = code === locale;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLocale(code)}
            className={`rounded-full px-3 py-1 transition ${
              isActive
                ? "bg-white text-slate-900 shadow"
                : "text-slate-200 hover:bg-white/10"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
