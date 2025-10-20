"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/lib/i18n";

export function Navigation() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const links = [
    { href: "/dashboard", label: t("nav.dashboard") },
    { href: "/lotteries", label: t("nav.lotteries") },
    { href: "/purchase", label: t("nav.purchase") },
  ];

  return (
    <nav className="hidden items-center gap-2 text-sm font-medium md:flex">
      {links.map((link) => {
        const isActive =
          pathname === link.href || pathname?.startsWith(`${link.href}/`);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`group relative overflow-hidden rounded-full px-4 py-1.5 transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 ${
              isActive
                ? "text-white shadow-[0_8px_30px_-14px_rgba(56,189,248,0.8)]"
                : "text-slate-300 hover:text-white"
            }`}
          >
            <span
              className={`absolute inset-0 rounded-full bg-gradient-to-r from-fuchsia-600/60 via-indigo-500/40 to-cyan-500/60 transition duration-300 ${
                isActive ? "opacity-90" : "opacity-0 group-hover:opacity-70"
              }`}
            />
            <span className="relative z-10">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
