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
    <nav className="hidden items-center gap-4 text-sm font-semibold md:flex">
      {links.map((link) => {
        const isActive =
          pathname === link.href || pathname?.startsWith(`${link.href}/`);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`relative rounded-full px-3 py-1.5 transition ${
              isActive
                ? "bg-white text-slate-900 shadow"
                : "text-slate-200 hover:bg-white/10"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
