"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, CalendarDays, Check, Clock3, Compass, MapPin, ShieldCheck, Sparkles, Tag, Users } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTrip } from "@/context/TripContext";
import { useLanguage } from "@/context/LanguageContext";
import { isSupabaseConfigured } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import { usePurchase } from "@/context/PurchaseContext";
import Header from "@/auth/components/header/Header";
import Footer from "@/components/layout/FooterSection";
import LoginModal from "@/auth/components/home/components/LoginModal";
import SignUpButton from "@/auth/components/home/components/SignUpButton";
import ChatWidget from "@/components/layout/ChatWidget";
import PurchaseModal from "@/PurchaseModal";
import TripReviews from "@/TripReviews";

const fallbackImage = "/brand/hero-felucca.webp";

function textOf(value, lang) {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value[lang] || value.en || Object.values(value)[0] || "";
}

export default function TripPage({ params }) {
  const { id } = params;
  const pathname = usePathname();
  const locale = pathname.split("/").filter(Boolean)[0] || "en";
  const { lang } = useLanguage();
  const { user, handleOpen } = useAuth();
  const { currency } = usePurchase();
  const { trips, fetchTrips, getTripById, loadingTrips } = useTrip();
  const [activeImage, setActiveImage] = useState(0);
  const [bookingOpen, setBookingOpen] = useState(false);

  const trip = getTripById(id);

  useEffect(() => {
    if (!trip && isSupabaseConfigured) fetchTrips();
  }, [trip, fetchTrips]);
  const gallery = useMemo(() => trip?.gallery_images?.length ? trip.gallery_images : [{ url: trip?.cover_image || fallbackImage, name: { en: "The journey" } }], [trip]);
  const title = textOf(trip?.title, lang) || "Your Egyptian journey";
  const description = textOf(trip?.description, lang);
  const cities = (trip?.trip_cities || []).map((item) => item.cities?.name?.[lang] || item.cities?.name?.en || item.city_name).filter(Boolean);
  const categories = (trip?.trip_categories || []).map((item) => item.categories?.name?.[lang] || item.categories?.name?.en || item.category_name).filter(Boolean);
  const includes = (trip?.includes || []).map((item) => textOf(item, lang)).filter(Boolean);
  const days = trip?.trip_days || [];
  const displayPrice = currency === "EUR" && trip?.currency === "USD" ? (Number(trip.price) * .85).toFixed(2) : trip?.price;

  if (loadingTrips || !trip) return <main className="trip-detail-page"><Header /><div className="trip-detail-loading"><span /><p>{loadingTrips ? "Preparing your journey…" : "This journey could not be found."}</p>{!loadingTrips && <Link href={`/${locale}/trips`}>Back to all journeys <ArrowRight size={15} /></Link>}</div></main>;

  return <>
    <main className="trip-detail-page"><Header />
      <section className="trip-detail-hero"><div className="trip-detail-hero-inner"><Link href={`/${locale}/trips`} className="trip-back-link"><ArrowLeft size={15} /> All journeys</Link><div className="trip-detail-hero-grid"><div className="trip-gallery"><div className="trip-gallery-main"><Image src={gallery[activeImage]?.url || fallbackImage} alt={textOf(gallery[activeImage]?.name, lang) || title} fill priority sizes="(max-width: 900px) 100vw, 60vw" /><span>{String(activeImage + 1).padStart(2, "0")} / {String(gallery.length).padStart(2, "0")}</span></div><div className="trip-gallery-thumbs">{gallery.map((image, index) => <button type="button" key={image.id || image.url || index} className={activeImage === index ? "is-active" : ""} onClick={() => setActiveImage(index)} aria-label={`Show image ${index + 1}`}><Image src={image.url || fallbackImage} alt="" fill sizes="120px" /></button>)}</div></div><div className="trip-hero-copy"><span className="trip-detail-kicker"><Sparkles size={14} /> Private journey · Southern Egypt</span><h1>{title}</h1><p>{description}</p><div className="trip-hero-tags">{cities.slice(0, 3).map((city) => <span key={city}><MapPin size={13} /> {city}</span>)}</div></div></div></div></section>

      <section className="trip-detail-content"><div className="trip-detail-main"><div className="trip-overview-bar"><div><small>Duration</small><strong><Clock3 size={16} /> {trip.duration} {textOf(trip.duration_unit, lang)}</strong></div><div><small>Travellers</small><strong><Users size={16} /> Private group</strong></div><div><small>Style</small><strong><Compass size={16} /> Curated</strong></div></div><section className="trip-story-block"><span className="trip-section-kicker">The story of this journey</span><h2>Made for the moments<br /><em>you will keep.</em></h2><p>{description}</p></section><div className="trip-detail-meta-grid"><section className="trip-detail-panel"><div className="trip-panel-heading"><span><MapPin size={16} /></span><div><small>On the map</small><h3>Places you will see</h3></div></div><div className="trip-pill-list">{cities.map((city) => <span key={city}>{city}</span>)}{!cities.length && <span>Luxor · Aswan · Cairo</span>}</div></section><section className="trip-detail-panel"><div className="trip-panel-heading"><span><Tag size={16} /></span><div><small>Curated around</small><h3>Travel style</h3></div></div><div className="trip-pill-list">{categories.map((category) => <span key={category}>{category}</span>)}{!categories.length && <span>Private experience</span>}</div></section></div><section className="trip-detail-panel trip-includes-panel"><div className="trip-panel-heading"><span><Check size={16} /></span><div><small>Included in your day</small><h3>Everything considered.</h3></div></div><div className="trip-includes-grid">{includes.length ? includes.map((item) => <span key={item}><Check size={14} /> {item}</span>) : <><span><Check size={14} /> Local coordination</span><span><Check size={14} /> Private guidance</span><span><Check size={14} /> Thoughtful pacing</span></>}</div></section><section className="trip-itinerary-block"><div className="trip-story-heading"><span className="trip-section-kicker">Your days, at a glance</span><h2>A rhythm, not<br /><em>a checklist.</em></h2></div>{days.length ? <div className="trip-timeline">{days.map((day, index) => <article key={day.id || index} className="trip-timeline-day"><div className="trip-day-marker"><span>{String(day.day_number || index + 1).padStart(2, "0")}</span><i /></div><div className="trip-day-content"><small>Day {day.day_number || index + 1}</small><h3>Day {day.day_number || index + 1}</h3><ul>{(day.day_activities || []).map((activity, activityIndex) => <li key={activity.id || activityIndex}><span>{activity.time || ""}</span>{textOf(activity.activity_translations, lang)}</li>)}</ul></div></article>)}</div> : <div className="trip-empty-itinerary">The detailed itinerary will be arranged with your travel team after booking.</div>}</section><section className="trip-detail-reviews"><TripReviews trip={trip} lang={lang} /></section></div><aside className="trip-booking-rail"><div className="trip-booking-card"><span className="trip-section-kicker">Your private escape</span><h2>Ready when<br /><em>you are.</em></h2><div className="trip-price"><small>From / adult</small><strong>{displayPrice || "On request"} {currency}</strong></div><p>Tell us your preferred dates and we will take care of the details.</p><button type="button" className="trip-booking-button" onClick={() => user ? setBookingOpen(true) : handleOpen()}>{user ? "Reserve this journey" : "Sign in to reserve"} <ArrowUpRight size={17} /></button><div className="trip-booking-trust"><ShieldCheck size={16} /><span>Secure booking · Local support</span></div></div><div className="trip-rail-note"><CalendarDays size={18} /><div><strong>Flexible planning</strong><p>Private schedules can be adjusted to your pace.</p></div></div></aside></section>
      <Footer /><SignUpButton /><LoginModal />{bookingOpen && <PurchaseModal trip={trip} onClose={() => setBookingOpen(false)} />}{user && <ChatWidget />}
    </main>
  </>;
}
