"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Waves, Sun, Landmark } from "lucide-react";
import { useTranslation } from "react-i18next";

const moments = [
  { title: "River days", copy: "Sail beyond the itinerary on a private felucca at golden hour.", image: "/brand/hero-felucca.webp", icon: Waves },
  { title: "Ancient light", copy: "Walk through temples and stories with people who know every layer.", image: "/brand/cairo-pyramids.webp", icon: Landmark },
  { title: "First light", copy: "See Luxor from above, before the valley starts to move.", image: "/brand/luxor-balloons.webp", icon: Sun },
];

export default function LuxuryDiscoverSection() {
  const { t } = useTranslation("home");

  return (
    <section id="story" className="luxury-section px-5 py-24 lg:px-8 lg:py-36">
      <div className="mx-auto max-w-[1380px]">
        <div className="grid items-end gap-10 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="luxury-eyebrow">A slower kind of discovery</p>
            <h2 className="site-display mt-4 max-w-xl text-5xl leading-[.98] sm:text-6xl">Egypt is not a checklist. It is a feeling.</h2>
          </div>
          <div className="flex max-w-xl flex-col items-start gap-5 lg:justify-self-end">
            <p className="text-base leading-8 text-[var(--muted)]">We design intimate journeys around the moments that stay with you: the first call to prayer over the river, warm stone beneath your hand, and a table shared with people who feel like old friends.</p>
            <Link href="#journeys" className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[.16em] text-[var(--gold)]">{t("LearnMoreAboutUs")} <ArrowUpRight size={17} className="transition group-hover:translate-x-1 group-hover:-translate-y-1" /></Link>
          </div>
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-3">
          {moments.map(({ title, copy, image, icon: Icon }, index) => (
            <article key={title} className={`group image-frame min-h-[430px] ${index === 1 ? "md:translate-y-10" : ""}`}>
              <Image src={image} alt={title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
              <div className="absolute inset-x-0 bottom-0 z-10 p-6 text-white">
                <span className="mb-10 grid h-10 w-10 place-items-center rounded-full border border-white/35 bg-black/10 backdrop-blur"><Icon size={18} /></span>
                <p className="luxury-eyebrow text-[var(--gold-bright)]">0{index + 1} / 03</p>
                <h3 className="site-display mt-2 text-3xl">{title}</h3>
                <p className="mt-2 max-w-xs text-sm leading-6 text-white/75">{copy}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
