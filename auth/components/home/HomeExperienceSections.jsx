"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ArrowUpRight, CarFront, Check, Clock3, Compass, Heart, MapPin, MessageCircle, ShieldCheck, Star, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useCitiesCategories } from "@/context/CitiesCategoriesContext";
import { useTrip } from "@/context/TripContext";
import { useReviews } from "@/context/ReviewsContext";

const categoryFallbacks = [
  ["Private journeys", "/brand/hero-felucca.webp"], ["Nile cruises", "/aswan/aswan-river-experience.webp"], ["Ancient temples", "/aswan/aswan-temple-river.webp"],
  ["Desert escapes", "/homepage/homepage-desert-scene.webp"], ["Food & culture", "/cairo/cairo-cultural-scene.webp"], ["Family adventures", "/brand/luxor-balloons.webp"],
  ["Luxury tours", "/brand/cairo-pyramids.webp"], ["Airport transfers", "/cairo/cairo-city-view.webp"], ["Tailored days", "/aswan/aswan-river-sunset.webp"],
];

const cityFallbacks = [
  ["Luxor", "/brand/hero-felucca.webp"], ["Aswan", "/aswan/aswan-nile-landscape.webp"], ["Cairo", "/cairo/cairo-nile-skyline.webp"],
  ["Abu Simbel", "/aswan/aswan-temple-river.webp"], ["Edfu", "/aswan/aswan-river-experience.webp"], ["Kom Ombo", "/aswan/aswan-river-sunset.webp"],
  ["Esna", "/brand/luxor-balloons.webp"], ["Dendera", "/cairo/cairo-landmark.webp"], ["Hurghada", "/homepage/homepage-river-scene.webp"],
];

const journeyFallbacks = [
  ["The Golden River", "Luxor · Aswan", "3 days", "/brand/hero-felucca.webp"], ["Valley of First Light", "Luxor", "1 day", "/brand/luxor-balloons.webp"],
  ["The Old Kingdom", "Cairo", "1 day", "/brand/cairo-pyramids.webp"], ["Southern Temples", "Aswan · Edfu", "2 days", "/aswan/aswan-temple-river.webp"],
  ["Desert Afterglow", "Cairo", "1 day", "/homepage/homepage-desert-scene.webp"], ["Nile, Your Way", "Luxor · Aswan", "5 days", "/aswan/aswan-river-sunset.webp"],
];

const reviewFallbacks = [
  ["A slower, richer way to see Egypt.", "Private Nile journey"], ["Every detail felt thoughtful and easy.", "Luxor temples"], ["The river at sunset was unforgettable.", "Aswan escape"],
  ["Local knowledge made all the difference.", "Cairo & Luxor"], ["Beautiful pacing, warm people, no rush.", "Southern Egypt"], ["Exactly the kind of travel we wanted.", "Tailored itinerary"],
];

function getName(item, language) {
  if (!item) return "";
  if (typeof item === "string") return item;
  return item.name?.[language] || item.name?.en || item.translations?.[language] || item.translations?.en || item.name || "Egypt";
}

function filterRoute(locale, type, value) {
  const query = encodeURIComponent(JSON.stringify({ city: type === "city" ? [value] : "all", category: type === "category" ? [value] : "all", price: "All", popular: false }));
  return `/${locale}/trips?data=${query}`;
}

export default function HomeExperienceSections() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = pathname.split("/").filter(Boolean)[0] || "en";
  const { t, i18n } = useTranslation("home");
  const { cities, categories } = useCitiesCategories();
  const { trips } = useTrip();
  const { allReviews } = useReviews();
  const language = i18n.language?.split("-")[0] || "en";
  const [isCarModalOpen, setCarModalOpen] = useState(false);
  const [carForm, setCarForm] = useState({ name: "", phone: "", date: "", passengers: "", pickup: "", destination: "", vehicle: "Sedan", notes: "" });
  const [carSent, setCarSent] = useState(false);

  const categoryCards = (categories?.length ? categories.slice(0, 9).map((item, index) => [getName(item, language), item.images?.[0] || categoryFallbacks[index][1]]) : categoryFallbacks).slice(0, 9);
  const cityCards = (cities?.length ? cities.slice(0, 9).map((item, index) => [getName(item, language), item.images?.[0] || cityFallbacks[index][1]]) : cityFallbacks).slice(0, 9);
  const journeyCards = (trips?.length ? trips.slice(0, 6).map((trip, index) => [trip.title?.[language] || trip.title?.en || "Curated journey", trip.trip_cities?.[0]?.cities?.name?.[language] || trip.trip_cities?.[0]?.cities?.name?.en || trip.cities?.[0]?.name || "Southern Egypt", trip.duration ? `${trip.duration} ${trip.duration_unit || "days"}` : "Private itinerary", trip.cover_image || journeyFallbacks[index][3], trip.id]) : journeyFallbacks).slice(0, 6);
  const reviewCards = (allReviews?.length ? allReviews.slice(0, 6).map((review) => [review.comment, review.name || "Guest", review.rating || 5]) : reviewFallbacks.map(([quote, label]) => [quote, label, 5])).slice(0, 6);

  const updateCarField = (event) => setCarForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const submitCarBooking = (event) => {
    event.preventDefault();
    const details = `\nالاسم: ${carForm.name}\nالهاتف: ${carForm.phone}\nالتاريخ: ${carForm.date}\nعدد الأشخاص: ${carForm.passengers}\nمكان الاستلام: ${carForm.pickup}\nالوجهة: ${carForm.destination}\nنوع السيارة: ${carForm.vehicle}\nملاحظات: ${carForm.notes || "لا توجد"}`;
    const arabic = `مرحباً، أريد حجز سيارة خاصة في مصر.${details}\nأرغب في معرفة السعر والتأكيد.`;
    const spanish = `Hola, quiero reservar un traslado privado en Egipto.\nNombre: ${carForm.name}\nTeléfono: ${carForm.phone}\nFecha: ${carForm.date}\nPasajeros: ${carForm.passengers}\nRecogida: ${carForm.pickup}\nDestino: ${carForm.destination}\nVehículo: ${carForm.vehicle}\nNotas: ${carForm.notes || "Ninguna"}\nQuisiera conocer el precio y confirmar la reserva.`;
    window.open(`https://wa.me/201010104875?text=${encodeURIComponent(arabic)}`, "_blank", "noopener,noreferrer");
    window.open(`https://wa.me/5491159580962?text=${encodeURIComponent(spanish)}`, "_blank", "noopener,noreferrer");
    setCarSent(true);
  };

  return (
    <div className="home-experience">
      <section className="home-section home-category-section" id="categories">
        <div className="home-section-heading"><div><span className="home-kicker"><Compass size={14} /> Curate your Egypt</span><h2>Find the feeling<br /><em>you came for.</em></h2></div><p>From quiet river mornings to deep history and open desert, choose a starting point and we will shape the journey around you.</p></div>
        <div className="home-category-grid">{categoryCards.map(([name, image], index) => <Link href={filterRoute(locale, "category", name)} className={`home-category-card ${index === 0 ? "is-featured" : ""}`} key={`${name}-${index}`}><Image src={image} alt={name} fill sizes="(max-width: 700px) 50vw, 20vw" /><span className="home-card-shade" /><span className="home-card-index">0{index + 1}</span><span className="home-card-name">{name}<ArrowUpRight size={15} /></span></Link>)}</div>
      </section>

      <section className="home-section home-city-section" id="cities">
        <div className="home-section-heading is-centered"><div><span className="home-kicker"><MapPin size={14} /> A country in chapters</span><h2>Meet Egypt<br /><em>city by city.</em></h2></div><p>Each destination has its own rhythm. Discover the places that bring your itinerary into focus.</p></div>
        <div className="home-city-grid">{cityCards.map(([name, image], index) => <Link href={filterRoute(locale, "city", name)} className="home-city-card" key={`${name}-${index}`}><Image src={image} alt={name} fill sizes="(max-width: 700px) 50vw, 20vw" /><span className="home-card-shade" /><span><small>0{index + 1}</small><strong>{name}</strong></span><ArrowRight size={17} /></Link>)}</div>
      </section>

      <section className="home-section home-journey-section" id="journeys"><div className="home-section-heading"><div><span className="home-kicker"><Heart size={14} /> The considered edit</span><h2>Journeys worth<br /><em>taking slowly.</em></h2></div><Link href={`/${locale}/trips`} className="home-outline-link">View all journeys <ArrowUpRight size={16} /></Link></div><div className="home-journey-grid">{journeyCards.map(([title, meta, duration, image, id], index) => <button type="button" key={`${title}-${index}`} className="home-journey-card" onClick={() => router.push(id ? `/${locale}/trips/${id}` : `/${locale}/trips`)}><div className="home-journey-image"><Image src={image} alt={title} fill sizes="(max-width: 900px) 50vw, 33vw" /><span>0{index + 1}</span><i><ArrowUpRight size={17} /></i></div><div className="home-journey-copy"><span>{meta}</span><h3>{title}</h3><small><Clock3 size={13} /> {duration}</small></div></button>)}</div></section>

      <section className="home-about-section" id="about"><div className="home-about-shell"><div className="home-about-image"><Image src="/aswan/aswan-river-experience.webp" alt="A private journey on the Nile in Aswan" fill sizes="(max-width: 900px) 100vw, 50vw" /><span className="home-about-image-label">01 · Local perspective</span></div><div className="home-about-copy"><span className="home-kicker">About Luxor & Aswan</span><h2>Not just a visit.<br /><em>A way of seeing.</em></h2><p>We are a local travel studio for people who want Egypt to feel unhurried, personal, and beautifully considered. Our guides, drivers, and partners turn the essential sights into meaningful days.</p><div className="home-about-points"><span><Check size={15} /> Local knowledge</span><span><Check size={15} /> Private pacing</span><span><Check size={15} /> Human support</span></div><Link href={`/${locale}/about`} className="home-gold-link">Discover our story <ArrowUpRight size={16} /></Link></div></div></section>

      <section className="home-car-section" id="car-booking"><div className="home-car-image"><Image src="/brand/luxury-transfer-cairo.png" alt="A luxury private transfer arriving at Cairo airport" fill sizes="100vw" /></div><div className="home-car-shade" /><div className="home-car-content"><span className="home-kicker">Move through Egypt with ease</span><h2>Arrive well.<br /><em>Travel better.</em></h2><p>Private airport transfers and comfortable cars, arranged around your arrival time and your way of travelling.</p><div className="home-car-benefits"><span><CarFront size={16} /> Private vehicle</span><span><ShieldCheck size={16} /> Trusted local driver</span></div><button type="button" onClick={() => { setCarModalOpen(true); setCarSent(false); }} className="home-light-link home-car-trigger">Arrange a transfer <ArrowUpRight size={16} /></button></div></section>

      <section className="home-section home-review-section" id="reviews"><div className="home-section-heading is-centered"><div><span className="home-kicker"><Star size={14} /> Notes from the river</span><h2>Six reasons<br /><em>to come back.</em></h2></div><p>Real journeys leave a trace. Here are a few words from the people who travelled with us.</p></div><div className="home-review-grid">{reviewCards.map(([quote, author, rating], index) => <article className="home-review-card" key={`${author}-${index}`}><div className="home-review-stars">{Array.from({ length: Number(rating) || 5 }).map((_, i) => <Star key={i} size={13} fill="currentColor" />)}</div><p>“{quote}”</p><footer><span>{author}</span><small>Guest note · 0{index + 1}</small></footer></article>)}</div></section>

      <section className="home-final-cta"><div className="home-final-cta-orb" /><div><span className="home-kicker">Your next chapter</span><h2>Leave room for<br /><em>the unexpected.</em></h2></div><div><p>Tell us how you like to travel. We will shape the rest around you.</p><Link href={`/${locale}/contact`} className="home-gold-link">Start a conversation <MessageCircle size={16} /></Link></div></section>

      {isCarModalOpen && <div className="car-booking-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setCarModalOpen(false); }}><section className="car-booking-modal" role="dialog" aria-modal="true" aria-labelledby="car-booking-title"><button type="button" className="car-booking-close" onClick={() => setCarModalOpen(false)} aria-label="Close car booking form"><X size={20} /></button>{carSent ? <div className="car-booking-success"><span><Check size={24} /></span><h2>تم تجهيز الحجز</h2><p>تم فتح واتساب بالعربية والإسبانية. أرسل الرسالتين لتصل بياناتك إلى فريقينا.</p><button type="button" onClick={() => { setCarSent(false); setCarModalOpen(false); }} className="car-booking-submit">إغلاق</button></div> : <><div className="car-booking-heading"><span className="home-kicker"><CarFront size={14} /> Private transfer</span><h2 id="car-booking-title">احجز سيارتك<br /><em>بكل سهولة.</em></h2><p>املأ البيانات، وسنرسل طلبك تلقائيًا إلى واتساب بالعربية والإسبانية.</p></div><form onSubmit={submitCarBooking} className="car-booking-form"><label><span>الاسم الكامل</span><input name="name" value={carForm.name} onChange={updateCarField} placeholder="اكتب اسمك" required /></label><label><span>رقم الهاتف</span><input name="phone" type="tel" value={carForm.phone} onChange={updateCarField} placeholder="+20 ..." required /></label><label><span>تاريخ الحجز</span><input name="date" type="date" value={carForm.date} onChange={updateCarField} required /></label><label><span>عدد الأشخاص</span><input name="passengers" type="number" min="1" value={carForm.passengers} onChange={updateCarField} placeholder="2" required /></label><label><span>مكان الاستلام</span><input name="pickup" value={carForm.pickup} onChange={updateCarField} placeholder="المطار أو الفندق" required /></label><label><span>الوجهة</span><input name="destination" value={carForm.destination} onChange={updateCarField} placeholder="الأقصر / أسوان" required /></label><label><span>نوع السيارة</span><select name="vehicle" value={carForm.vehicle} onChange={updateCarField}><option>Sedan</option><option>SUV</option><option>Minivan</option><option>Luxury car</option></select></label><label><span>ملاحظات إضافية</span><textarea name="notes" value={carForm.notes} onChange={updateCarField} placeholder="وقت الوصول أو أي طلب خاص" rows={2} /></label><button type="submit" className="car-booking-submit">إرسال إلى واتساب <MessageCircle size={17} /></button><small className="car-booking-note">سيتم فتح محادثتين: العربية لفريق الأقصر، والإسبانية لفريق الأرجنتين.</small></form></>}</section></div>}
    </div>
  );
}
