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
    <div className="flex items-center gap-1 rounded-full border border-white/10 bg-slate-950/40 p-1 text-xs text-white shadow-[0_18px_40px_-24px_rgba(124,58,237,0.6)] backdrop-blur-md">
      {options.map(({ code, label }) => {
        const isActive = code === locale;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLocale(code)}
            className={`group relative overflow-hidden rounded-full px-3 py-1 font-medium transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 ${
              isActive ? "text-white" : "text-slate-300 hover:text-white"
            }`}
          >
            <span
              className={`absolute inset-0 rounded-full bg-gradient-to-r from-fuchsia-500/50 via-indigo-500/40 to-cyan-400/50 transition duration-300 ${
                isActive ? "opacity-100" : "opacity-0 group-hover:opacity-70"
              }`}
            />
            <span className="relative z-10">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
