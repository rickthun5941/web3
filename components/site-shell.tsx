"use client";

import type { ReactNode, SVGProps } from "react";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { WalletButton } from "@/components/wallet-button";
import { LanguageToggle } from "@/components/language-toggle";
import { useTranslation } from "@/lib/i18n";

export function SiteShell({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <header className="border-b border-white/10 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4 sm:flex-nowrap">
          <Link
            href="/dashboard"
            className="text-lg font-semibold tracking-tight text-white"
          >
            {t("site.title")}
          </Link>
          <div className="flex flex-1 flex-wrap items-center justify-end gap-4 md:flex-initial">
            <Navigation />
            <LanguageToggle />
            <div className="flex justify-end">
              <WalletButton />
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        {children}
      </main>
      <footer className="border-t border-white/10 py-12">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 text-sm text-slate-300 md:flex-row md:justify-between">
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

          <div className="grid flex-1 gap-10 text-sm text-slate-200 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:border-fuchsia-400 hover:text-fuchsia-300"
    >
      {children}
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
    <div className="space-y-4">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
        {heading}
      </p>
      <ul className="space-y-2 text-sm">
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
