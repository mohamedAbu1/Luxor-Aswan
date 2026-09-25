"use client";

import Image from "next/image";
import { ArrowUpRight, Clock3 } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useTrip } from "@/context/TripContext";

const featured = [
  { title: "The Golden River", meta: "Luxor · Aswan", duration: "3 days", image: "/brand/hero-felucca.webp" },
  { title: "Valley of First Light", meta: "Luxor", duration: "1 day", image: "/brand/luxor-balloons.webp" },
  { title: "The Old Kingdom", meta: "Cairo", duration: "1 day", image: "/brand/cairo-pyramids.webp" },
];

export default function TopTripsSection() {
  const router = useRouter();
  const { t, i18n } = useTranslation("home");
  const { trips, fetchTrips } = useTrip();
  const locale = i18n.language?.split("-")[0] || "en";

  useEffect(() => { fetchTrips(); }, [fetchTrips]);

  const cards = trips?.length ? trips.slice(0, 3).map((trip, index) => ({
    id: trip.id,
    title: trip.title?.[locale] || trip.title?.en || "Curated journey",
    meta: trip.cities?.[0]?.name || "Southern Egypt",
    duration: trip.duration ? `${trip.duration} ${trip.duration_unit || "days"}` : "Private itinerary",
    image: trip.cover_image || featured[index % featured.length].image,
  })) : featured;

  return (
    <section id="journeys" className="luxury-section border-t border-[var(--line)] px-5 py-24 lg:px-8 lg:py-36">
      <div className="mx-auto max-w-[1380px]">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div><p className="luxury-eyebrow">The edit</p><h2 className="site-display mt-3 text-5xl sm:text-6xl">Journeys worth taking.</h2></div>
          <button type="button" onClick={() => router.push(`/${locale}/trips`)} className="group inline-flex items-center gap-2 self-start text-sm font-bold uppercase tracking-[.14em] text-[var(--gold)] md:self-auto">View all journeys <ArrowUpRight size={17} className="transition group-hover:translate-x-1 group-hover:-translate-y-1" /></button>
        </div>
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {cards.map((trip, index) => (
            <button type="button" key={trip.id || trip.title} onClick={() => trip.id ? router.push(`/${locale}/trips/${trip.id}`) : router.push(`/${locale}/trips`)} className="group text-left">
              <div className="image-frame relative aspect-[.9] w-full">
                <Image src={trip.image} alt={trip.title} fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover" />
                <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between p-5 text-white"><span className="grid h-10 w-10 place-items-center rounded-full border border-white/35 bg-black/15 backdrop-blur transition group-hover:bg-[var(--gold)] group-hover:text-[#101718]"><ArrowUpRight size={17} /></span><span className="rounded-full border border-white/25 bg-black/20 px-3 py-1 text-xs backdrop-blur">0{index + 1}</span></div>
              </div>
              <div className="flex items-start justify-between gap-3 py-5"><div><p className="text-xs font-bold uppercase tracking-[.12em] text-[var(--gold)]">{trip.meta}</p><h3 className="site-display mt-2 text-3xl">{trip.title}</h3></div><span className="mt-1 inline-flex items-center gap-1 whitespace-nowrap text-xs text-[var(--muted)]"><Clock3 size={13} /> {trip.duration}</span></div>
            </button>
          ))}
        </div>
        {!trips?.length && <p className="mt-8 text-sm text-[var(--muted)]">{t("Discover")}</p>}
      </div>
    </section>
  );
}
