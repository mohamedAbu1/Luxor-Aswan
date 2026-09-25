"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Compass, RefreshCw } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function StatusPage({ kind = "not-found", reset }) {
  const pathname = usePathname();
  const { t } = useTranslation();
  const segment = pathname.split("/").filter(Boolean)[0];
  const locale = ["en", "ar", "fr", "de", "it", "es", "zh"].includes(segment) ? segment : "en";
  const isError = kind === "error";
  const copy = isError
    ? { code: "500", eyebrow: "A temporary detour", title: "The river took a turn.", text: "Something interrupted this journey. We are ready to set the course again.", button: "Try again" }
    : { code: "404", eyebrow: "The map ends here", title: "A quiet detour.", text: "This page has drifted beyond the itinerary. Let us take you somewhere beautiful instead.", button: "Explore journeys" };

  return (
    <main className="status-page">
      <div className="status-page-noise" />
      <header className="status-page-header"><Link href={`/${locale}`} className="status-brand" aria-label="Luxor and Aswan home"><span className="status-brand-mark">𓂀</span><span><small>Curated Egypt</small><strong>Luxor <b>&amp;</b> Aswan</strong></span></Link><span className="status-page-label">Private journeys · Since 2018</span></header>
      <div className="status-page-content">
        <section className="status-page-copy"><span className="luxury-eyebrow">{copy.eyebrow}</span><div className="status-page-code">{copy.code}</div><h1>{copy.title}</h1><p>{isError ? copy.text : (t("NotFoundPage.p", { defaultValue: copy.text }) || copy.text)}</p><div className="status-page-actions">{isError && <button type="button" onClick={() => reset?.()} className="luxury-button luxury-button-primary"><RefreshCw size={16} /> {copy.button}</button>}{!isError && <Link href={`/${locale}/trips`} className="luxury-button luxury-button-primary"><Compass size={16} /> {copy.button} <ArrowRight size={16} /></Link>}<Link href={`/${locale}`} className="luxury-button luxury-button-ghost-dark"><ArrowLeft size={16} /> Back home</Link></div></section>
        <div className="status-page-art"><div className="status-page-ring status-page-ring-one" /><div className="status-page-ring status-page-ring-two" /><div className="status-page-image"><Image src="/brand/hero-felucca.webp" alt="Felucca sailing on the Nile" fill priority sizes="(max-width: 900px) 90vw, 480px" /></div><div className="status-page-caption"><span>01</span><p>A little further<br /><b>down the Nile.</b></p></div></div>
      </div>
      <footer className="status-page-footer"><span>© 2025 Luxor &amp; Aswan</span><span>Made for the river.</span></footer>
    </main>
  );
}
