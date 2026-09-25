"use client";

import Link from "next/link";
import { ArrowUpRight, Instagram, Mail, MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import Logo from "@/auth/components/header/components/Logo";

export default function FooterSection() {
  const pathname = usePathname();
  const { t } = useTranslation("footer");
  const first = pathname.split("/").filter(Boolean)[0];
  const locale = ["en", "ar", "fr", "de", "it", "es", "zh"].includes(first) ? first : "en";
  const path = (value) => `/${locale}${value}`;

  return (
    <footer className="border-t border-[var(--line)] bg-[var(--surface-strong)] px-5 py-16 lg:px-8 lg:py-20">
      <div className="mx-auto grid max-w-[1380px] gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div><Logo /><p className="mt-5 max-w-sm text-sm leading-7 text-[var(--muted)]">{t("p")}. Thoughtful journeys across the river, the desert, and the stories in between.</p><a href="mailto:info@luxoryaswanexcursiones.com" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--gold)]">info@luxoryaswanexcursiones.com <ArrowUpRight size={15} /></a></div>
        <div><p className="luxury-eyebrow mb-5">Explore</p><div className="flex flex-col gap-3 text-sm text-[var(--muted)]"><Link href={path("/")} className="hover:text-[var(--gold)]">{t("Home")}</Link><Link href={path("/trips")} className="hover:text-[var(--gold)]">{t("Tours")}</Link><Link href={path("/about")} className="hover:text-[var(--gold)]">{t("AboutUs")}</Link></div></div>
        <div><p className="luxury-eyebrow mb-5">Visit</p><div className="flex flex-col gap-3 text-sm text-[var(--muted)]"><span>Luxor · Aswan · Cairo</span><Link href={path("/contact")} className="hover:text-[var(--gold)]">{t("Contact")}</Link><Link href={path("/visaInfo")} className="inline-flex items-center gap-1 hover:text-[var(--gold)]">Visa information <ArrowUpRight size={13} /></Link><span>Open daily, 08:00–20:00</span></div></div>
        <div><p className="luxury-eyebrow mb-5">Stay close</p><div className="flex gap-3"><a aria-label="Instagram" href="https://www.instagram.com/luxor__asuan_excursiones" target="_blank" rel="noreferrer" className="grid h-10 w-10 place-items-center rounded-full border border-[var(--line)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-[#101718]"><Instagram size={16} /></a><a aria-label="WhatsApp" href="https://wa.me/message/WNWUM7QNPIIKN1" target="_blank" rel="noreferrer" className="grid h-10 w-10 place-items-center rounded-full border border-[var(--line)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-[#101718]"><MessageCircle size={16} /></a><a aria-label="Email" href="mailto:info@luxoryaswanexcursiones.com" className="grid h-10 w-10 place-items-center rounded-full border border-[var(--line)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-[#101718]"><Mail size={16} /></a></div></div>
      </div>
      <div className="mx-auto mt-16 flex max-w-[1380px] justify-between border-t border-[var(--line)] pt-5 text-xs text-[var(--muted)]"><span>© 2025 Luxor & Aswan</span><span>Made for the river.</span></div>
    </footer>
  );
}
