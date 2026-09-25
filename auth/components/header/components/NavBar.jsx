"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

const languages = ["en", "ar", "fr", "de", "it", "es", "zh"];

export default function NavBar() {
  const pathname = usePathname();
  const { t } = useTranslation("header");
  const segments = pathname.split("/").filter(Boolean);
  const locale = languages.includes(segments[0]) ? segments[0] : "en";
  const currentPath = `/${segments.slice(1).join("/")}` || "/";
  const links = [
    ["home", "/"],
    ["trips", "/trips"],
    ["about", "/about"],
    ["contact", "/contact"],
  ];

  return (
    <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary navigation">
      {links.map(([key, path]) => {
        const active = path === "/" ? currentPath === "/" : currentPath.startsWith(path);
        return (
          <Link key={key} href={`/${locale}${path}`} className={`site-nav-link relative py-3 text-[13px] font-semibold tracking-[.08em] ${active ? "is-active" : ""}`}>
            {t(key)}
            {active && <span className="absolute -bottom-0.5 left-0 h-px w-full bg-[var(--gold-bright)]" />}
          </Link>
        );
      })}
    </nav>
  );
}
