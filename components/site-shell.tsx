"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type SVGProps,
} from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { WalletButton } from "@/components/wallet-button";
import { LanguageToggle } from "@/components/language-toggle";
import { useTranslation } from "@/lib/i18n";

export function SiteShell({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const year = new Date().getFullYear();
  const mobileMenuLinks = [
    { href: "/dashboard", label: t("nav.dashboard") },
    { href: "/lotteries", label: t("nav.lotteries") },
    { href: "/purchase", label: t("nav.purchase") },
  ];
  const mobileMenuLabels = {
    open: t("nav.menu.open"),
    close: t("nav.menu.close"),
  };

  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="pointer-events-none absolute inset-x-0 top-[-10%] z-0 h-[420px] bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.22),_transparent_65%)] blur-[120px]" />
      <div className="pointer-events-none absolute inset-y-0 right-[-6%] z-0 w-[88%] bg-[radial-gradient(circle_at_center,_rgba(56,189,248,0.18),_transparent_60%)] blur-[100px] sm:right-[-18%] sm:w-[72%] lg:right-[-35%] lg:w-[60%]" />
      <header className="relative z-40 border-b border-white/10 bg-slate-950/40">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(124,58,237,0.16),rgba(15,23,42,0.2),rgba(56,189,248,0.12))] opacity-70" />
        <div className="relative mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-5 sm:flex-nowrap">
          <div className="flex min-w-0 flex-1 items-center gap-3 sm:flex-none">
            <MobileMenu links={mobileMenuLinks} labels={mobileMenuLabels} />
            <Link href="/dashboard" className="group inline-flex flex-col">
              <span className="gradient-text text-lg font-semibold tracking-tight drop-shadow">
                {t("site.title")}
              </span>
              <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-400 transition group-hover:text-slate-200">
                {t("site.baseline")}
              </span>
            </Link>
          </div>
          <div className="flex flex-1 flex-wrap items-center justify-end gap-4 md:flex-initial">
            <Navigation />
            <LanguageToggle />
            <div className="flex justify-end">
              <WalletButton />
            </div>
          </div>
        </div>
      </header>
      <main className="relative z-0 mx-auto w-full max-w-6xl flex-1 px-6 py-12">
        {children}
      </main>
      <footer className="relative z-10 border-t border-white/10 py-14">
        <div className="pointer-events-none absolute inset-x-0 bottom-[-20%] h-80 bg-[radial-gradient(circle_at_bottom,_rgba(59,130,246,0.2),_transparent_70%)] blur-[120px]" />
        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 text-sm text-slate-300 md:flex-row md:justify-between">
          <div className="flex flex-col items-start gap-6">
            <div className="flex items-center gap-6 text-white">
              <SocialIcon ariaLabel={t("footer.social.github")} href="https://github.com">
                <GithubIcon className="h-6 w-6" />
              </SocialIcon>
              <SocialIcon ariaLabel={t("footer.social.x")} href="https://x.com">
                <XIcon className="h-6 w-6" />
              </SocialIcon>
              <SocialIcon ariaLabel={t("footer.social.discord")} href="https://discord.com">
                <DiscordIcon className="h-6 w-6" />
              </SocialIcon>
            </div>
            <div className="space-y-2 text-xs text-slate-500">
              <p>{t("site.footer.notice", { year })}</p>
              <p>{t("site.footer.configHint")}</p>
            </div>
          </div>

          <div className="grid flex-1 gap-x-16 gap-y-10 text-sm text-slate-200 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <FooterColumn
              heading={t("footer.columns.products")}
              links={[
                { label: t("footer.links.wallet"), href: "#" },
              ]}
            />
            <FooterColumn
              heading={t("footer.columns.protocol")}
              links={[
                { label: t("footer.links.votes"), href: "#" },
                { label: t("footer.links.governance"), href: "#" },
                { label: t("footer.links.developers"), href: "#" },
                { label: t("footer.links.brand"), href: "#" },
              ]}
            />
            <FooterColumn
              heading={t("footer.columns.company")}
              links={[
                { label: t("footer.links.about"), href: "#" },
                { label: t("footer.links.careers"), href: "#" },
                { label: t("footer.links.blog"), href: "#" },
              ]}
            />
            <FooterColumn
              heading={t("footer.columns.support")}
              links={[
                { label: t("footer.links.helpCenter"), href: "#" },
                { label: t("footer.links.contact"), href: "#" },
              ]}
            />
          </div>
        </div>
      </footer>
    </div>
  );
}

function MobileMenu({
  links,
  labels,
}: {
  links: { href: string; label: string }[];
  labels: { open: string; close: string };
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleClick = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (links.length === 0) {
    return null;
  }

  return (
    <div className="relative md:hidden" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((previous) => !previous)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition duration-300 hover:border-fuchsia-500/40 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-400"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={isOpen ? labels.close : labels.open}
      >
        <span className="relative block h-4 w-6">
          <span
            className={`absolute left-0 h-[2px] w-full rounded-full bg-gradient-to-r from-fuchsia-400 via-indigo-300 to-cyan-300 transition-transform duration-200 ${
              isOpen ? "top-1/2 translate-y-[-1px] rotate-45" : "top-0"
            }`}
          />
          <span
            className={`absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 rounded-full bg-gradient-to-r from-fuchsia-400 via-indigo-300 to-cyan-300 transition-opacity duration-150 ${
              isOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`absolute left-0 h-[2px] w-full rounded-full bg-gradient-to-r from-fuchsia-400 via-indigo-300 to-cyan-300 transition-transform duration-200 ${
              isOpen ? "bottom-1/2 translate-y-[1px] -rotate-45" : "bottom-0"
            }`}
          />
        </span>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-3 w-48 rounded-2xl border border-white/10 bg-slate-950/95 p-3 shadow-2xl backdrop-blur">
          <ul className="space-y-1" role="menu">
            {links.map((link) => {
              const isActive =
                pathname === link.href ||
                pathname?.startsWith(`${link.href}/`);
              const handleNavigate = () => {
                setIsOpen(false);
                router.push(link.href);
              };
              return (
                <li key={link.href}>
                  <button
                    type="button"
                    role="menuitem"
                    aria-current={isActive ? "page" : undefined}
                    onClick={handleNavigate}
                    className={`block w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-fuchsia-600/50 via-indigo-500/40 to-cyan-500/50 text-white shadow-[0_18px_40px_-28px_rgba(99,102,241,0.6)]"
                        : "text-slate-200 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

function SocialIcon({
  children,
  href,
  ariaLabel,
}: {
  children: ReactNode;
  href: string;
  ariaLabel: string;
}) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className="group relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-slate-950/50 text-white transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-500"
    >
      <span className="absolute inset-0 rounded-full bg-gradient-to-br from-fuchsia-500/40 via-indigo-500/30 to-cyan-500/40 opacity-0 transition duration-300 group-hover:opacity-80" />
      <span className="absolute inset-[-40%] rounded-full bg-white/30 opacity-0 blur-2xl transition duration-500 group-hover:opacity-40" />
      <span className="relative z-10">{children}</span>
    </Link>
  );
}

function FooterColumn({
  heading,
  links,
}: {
  heading: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div className="min-w-0 space-y-4">
      <p className="whitespace-nowrap text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-slate-400">
        {heading}
      </p>
      <ul className="flex flex-col gap-2 text-sm leading-6">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-slate-200 transition hover:text-white hover:underline"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function GithubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path
        fillRule="evenodd"
        d="M12 1.5c-5.385 0-9.75 4.365-9.75 9.75 0 4.305 2.794 7.955 6.67 9.242.488.09.665-.212.665-.47 0-.232-.01-.998-.015-1.81-2.713.59-3.285-1.165-3.285-1.165-.444-1.13-1.084-1.433-1.084-1.433-.887-.607.067-.595.067-.595.982.069 1.498 1.009 1.498 1.009.872 1.494 2.288 1.063 2.846.813.09-.632.341-1.063.62-1.307-2.166-.246-4.444-1.084-4.444-4.824 0-1.066.38-1.938 1.003-2.621-.101-.246-.435-1.237.096-2.58 0 0 .817-.262 2.677 1.001a9.316 9.316 0 0 1 4.872 0c1.858-1.263 2.674-1.001 2.674-1.001.533 1.343.2 2.334.098 2.58.625.683 1.002 1.555 1.002 2.62 0 3.748-2.283 4.575-4.46 4.816.35.302.662.897.662 1.807 0 1.305-.012 2.357-.012 2.678 0 .26.175.563.67.468 3.873-1.29 6.665-4.938 6.665-9.24C21.75 5.865 17.385 1.5 12 1.5Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden {...props}>
      <path d="M4.5 4.5 19.5 19.5" strokeLinecap="round" />
      <path d="M19.5 4.5 4.5 19.5" strokeLinecap="round" />
    </svg>
  );
}

function DiscordIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path
        d="M7.68 4.5c-1.003.23-2.077.573-3.23 1.03-.27.105-.46.342-.502.63C2.78 9.647 2.49 13.012 3 16.305a.9.9 0 0 0 .377.586c1.008.694 2.044 1.197 3.103 1.538.26.084.544-.01.706-.228l.68-.92c1.146.33 2.33.515 3.535.55.005 0 .01.002.015.002h.169c1.22-.035 2.42-.222 3.581-.556l.74.997c.16.215.444.31.703.226 1.06-.341 2.095-.844 3.103-1.538a.9.9 0 0 0 .377-.586c.55-3.495.257-6.858-.948-10.145-.08-.225-.253-.403-.478-.5-1.015-.43-2.064-.76-3.144-.99-.24-.05-.486.04-.633.228l-.527.68a17.77 17.77 0 0 0-4.248-.03l-.51-.653a.68.68 0 0 0-.633-.228Zm.753 8.085c-.747 0-1.353-.676-1.353-1.51 0-.834.606-1.51 1.353-1.51.746 0 1.352.676 1.352 1.51 0 .834-.606 1.51-1.352 1.51Zm7.134 0c-.746 0-1.352-.676-1.352-1.51 0-.834.606-1.51 1.352-1.51.747 0 1.353.676 1.353 1.51 0 .834-.606 1.51-1.353 1.51Z"
        fill="currentColor"
      />
    </svg>
  );
}
