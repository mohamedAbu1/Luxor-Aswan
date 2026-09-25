"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Check, ChevronDown, Clock3, Filter, Flame, Grid2X2, ListFilter, MapPin, Search, SlidersHorizontal, Sparkles, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import Header from "@/auth/components/header/Header";
import Footer from "@/components/layout/FooterSection";
import LoginModal from "@/auth/components/home/components/LoginModal";
import SignUpButton from "@/auth/components/home/components/SignUpButton";
import ChatWidget from "@/components/layout/ChatWidget";
import AdminDashboardButton from "@/components/layout/AdminDashboardButton";
import { useAuth } from "@/context/AuthContext";
import { useTrip } from "@/context/TripContext";
import { useCitiesCategories } from "@/context/CitiesCategoriesContext";
import { useLanguage } from "@/context/LanguageContext";
import staticTrips from "@/data/staticTrips";

const budgetOptions = [
  { value: "All", label: "Any budget" },
  { value: "Economy", label: "Under $200" },
  { value: "Standard", label: "$200 – $599" },
  { value: "Luxury", label: "$600+" },
];

const fallbackImages = ["/brand/hero-felucca.webp", "/brand/luxor-balloons.webp", "/brand/cairo-pyramids.webp", "/aswan/aswan-temple-river.webp", "/homepage/homepage-desert-scene.webp", "/aswan/aswan-river-sunset.webp"];

function nameOf(item, language) {
  if (!item) return "";
  if (typeof item === "string") return item;
  return item.name?.[language] || item.name?.en || item.translations?.[language] || item.translations?.en || item.name || "";
}

function readQueryFilters(value) {
  if (!value) return {};
  try { return JSON.parse(atob(value)); } catch { try { return JSON.parse(decodeURIComponent(value)); } catch { return {}; } }
}

export default function TripsPage() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = pathname.split("/").filter(Boolean)[0] || "en";
  const { lang } = useLanguage();
  const { t } = useTranslation("trips");
  const { user } = useAuth();
  const { trips, fetchTrips, loadingTrips } = useTrip();
  const { cities, categories, loading: optionsLoading } = useCitiesCategories();
  const [query, setQuery] = useState("");
  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [budget, setBudget] = useState("All");
  const [popularOnly, setPopularOnly] = useState(false);
  const [sort, setSort] = useState("recommended");
  const [view, setView] = useState("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 6;

  useEffect(() => { fetchTrips(); }, [fetchTrips]);

  useEffect(() => {
    const incoming = readQueryFilters(searchParams.get("data"));
    const city = incoming.city && incoming.city !== "all" ? (Array.isArray(incoming.city) ? incoming.city : [incoming.city]) : [];
    const category = incoming.category && incoming.category !== "all" ? (Array.isArray(incoming.category) ? incoming.category : [incoming.category]) : [];
    if (city.length) setSelectedCities(city);
    if (category.length) setSelectedCategories(category);
    if (incoming.price) setBudget(incoming.price);
    if (incoming.popular) setPopularOnly(true);
  }, [searchParams]);

  const options = useMemo(() => {
    const staticCities = staticTrips.flatMap((trip) => trip.trip_cities || []).map((item) => ({ id: item.city_id, name: nameOf(item.cities, lang) }));
    const staticCategories = staticTrips.flatMap((trip) => trip.trip_categories || []).map((item) => ({ id: item.category_id, name: nameOf(item.categories, lang) }));
    const unique = (items) => [...new Map(items.filter((item) => item.name).map((item) => [item.name, item])).values()];
    return {
      cities: unique(cities?.length ? cities.map((item) => ({ id: item.id, name: nameOf(item, lang) })) : staticCities),
      categories: unique(categories?.length ? categories.map((item) => ({ id: item.id, name: nameOf(item, lang) })) : staticCategories),
    };
  }, [cities, categories, lang]);

  const normalizedTrips = useMemo(() => (trips || []).map((trip, index) => {
    const title = trip.title?.[lang] || trip.title?.en || "Curated journey";
    const tripCities = (trip.trip_cities || []).map((item) => item.cities?.name?.[lang] || item.cities?.name?.en || item.city_name || "").filter(Boolean);
    const tripCategories = (trip.trip_categories || []).map((item) => item.categories?.name?.[lang] || item.categories?.name?.en || options.categories.find((category) => category.id === item.category_id)?.name || "").filter(Boolean);
    return { ...trip, title, tripCities, tripCategories, price: Number(trip.price) || 0, image: trip.cover_image || fallbackImages[index % fallbackImages.length], duration: trip.duration ? `${trip.duration} ${trip.duration_unit || "days"}` : "Private itinerary" };
  }), [trips, lang, options.categories]);

  const filteredTrips = useMemo(() => {
    const search = query.trim().toLowerCase();
    const ranges = { Economy: [0, 199], Standard: [200, 599], Luxury: [600, Infinity] };
    const result = normalizedTrips.filter((trip) => {
      const searchable = [trip.title, ...trip.tripCities, ...trip.tripCategories, trip.description?.[lang] || trip.description?.en || ""].join(" ").toLowerCase();
      const matchesSearch = !search || search.split(/\s+/).every((word) => searchable.includes(word));
      const matchesCity = !selectedCities.length || selectedCities.some((city) => trip.tripCities.some((item) => item.toLowerCase() === city.toLowerCase()));
      const matchesCategory = !selectedCategories.length || selectedCategories.some((category) => trip.tripCategories.some((item) => item.toLowerCase() === category.toLowerCase()));
      const range = ranges[budget];
      const matchesBudget = !range || (trip.price >= range[0] && trip.price <= range[1]);
      return matchesSearch && matchesCity && matchesCategory && matchesBudget && (!popularOnly || trip.isPopular);
    });
    return result.sort((a, b) => sort === "price-low" ? a.price - b.price : sort === "price-high" ? b.price - a.price : Number(b.isPopular) - Number(a.isPopular));
  }, [normalizedTrips, query, selectedCities, selectedCategories, budget, popularOnly, sort, lang]);

  const suggestions = useMemo(() => query.trim() ? normalizedTrips.filter((trip) => trip.title.toLowerCase().includes(query.toLowerCase()) || trip.tripCities.some((city) => city.toLowerCase().includes(query.toLowerCase()))).slice(0, 4) : [], [query, normalizedTrips]);
  const pageCount = Math.max(1, Math.ceil(filteredTrips.length / pageSize));
  const paginatedTrips = filteredTrips.slice((page - 1) * pageSize, page * pageSize);
  useEffect(() => { setPage(1); }, [query, selectedCities, selectedCategories, budget, popularOnly, sort]);
  useEffect(() => { if (page > pageCount) setPage(pageCount); }, [page, pageCount]);
  const activeFilterCount = selectedCities.length + selectedCategories.length + (budget !== "All" ? 1 : 0) + (popularOnly ? 1 : 0);
  const toggle = (list, setList, value) => setList(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  const clearFilters = () => { setQuery(""); setSelectedCities([]); setSelectedCategories([]); setBudget("All"); setPopularOnly(false); setSort("recommended"); };

  const filterPanel = <div className="trips-filter-panel"><div className="trips-filter-top"><div><span className="trips-filter-kicker">Refine the edit</span><h2>Find your<br /><em>right journey.</em></h2></div><button type="button" onClick={clearFilters} className="trips-clear-button">Clear all</button></div><div className="trips-filter-group"><span className="trips-filter-label"><MapPin size={14} /> Where to?</span><div className="trips-filter-options">{options.cities.map((city) => <button type="button" key={city.id || city.name} className={selectedCities.includes(city.name) ? "is-active" : ""} onClick={() => toggle(selectedCities, setSelectedCities, city.name)}><span>{city.name}</span>{selectedCities.includes(city.name) && <Check size={14} />}</button>)}</div></div><div className="trips-filter-group"><span className="trips-filter-label"><Sparkles size={14} /> Experience</span><div className="trips-filter-options">{options.categories.map((category) => <button type="button" key={category.id || category.name} className={selectedCategories.includes(category.name) ? "is-active" : ""} onClick={() => toggle(selectedCategories, setSelectedCategories, category.name)}><span>{category.name}</span>{selectedCategories.includes(category.name) && <Check size={14} />}</button>)}</div></div><div className="trips-filter-group"><span className="trips-filter-label">Budget</span><div className="trips-budget-options">{budgetOptions.map((item) => <button type="button" key={item.value} className={budget === item.value ? "is-active" : ""} onClick={() => setBudget(item.value)}>{item.label}</button>)}</div></div><label className={`trips-popular-toggle ${popularOnly ? "is-active" : ""}`}><span><Flame size={15} /> Most popular</span><input type="checkbox" checked={popularOnly} onChange={(event) => setPopularOnly(event.target.checked)} /></label></div>;

  return <>
    <main className="trips-page"><Header /><section className="trips-hero"><div className="trips-hero-inner"><span className="trips-hero-kicker"><Sparkles size={14} /> Southern Egypt, thoughtfully arranged</span><h1>Journeys that<br /><em>stay with you.</em></h1><p>Private days, ancient light, and the river at your own pace. Browse the collection or describe what you have in mind.</p><div className="trips-hero-stats"><span><strong>{normalizedTrips.length || "—"}</strong> curated journeys</span><span><strong>3</strong> ways to explore</span><span><strong>1:1</strong> local support</span></div></div><div className="trips-hero-image"><Image src="/brand/hero-felucca.webp" alt="A felucca sailing on the Nile" fill priority sizes="(max-width: 900px) 100vw, 45vw" /></div></section>
    <section className="trips-workspace"><div className="trips-mobile-toolbar"><button type="button" onClick={() => setMobileFiltersOpen(true)}><SlidersHorizontal size={16} /> Filters {activeFilterCount > 0 && <b>{activeFilterCount}</b>}</button><button type="button" onClick={() => setSort(sort === "price-low" ? "recommended" : "price-low")}><ListFilter size={16} /> {sort === "price-low" ? "Price: low" : "Sort"}</button></div><aside className="trips-desktop-filter">{filterPanel}</aside><div className="trips-results"><div className="trips-search-row"><div className="trips-smart-search"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by destination, mood, or experience…" aria-label="Search trips" />{query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search"><X size={16} /></button>} {suggestions.length > 0 && <div className="trips-suggestions">{suggestions.map((trip) => <button type="button" key={trip.id} onClick={() => { setQuery(trip.title); setSelectedCities([]); setSelectedCategories([]); }}><span>{trip.title}</span><small>{trip.tripCities.join(" · ") || "Private journey"}</small><ArrowUpRight size={14} /></button>)}</div>}</div><div className="trips-view-actions"><button type="button" className={view === "grid" ? "is-active" : ""} onClick={() => setView("grid")} aria-label="Grid view"><Grid2X2 size={17} /></button><button type="button" className={view === "list" ? "is-active" : ""} onClick={() => setView("list")} aria-label="List view"><ListFilter size={17} /></button></div></div><div className="trips-results-meta"><span><b>{filteredTrips.length}</b> journeys found {activeFilterCount > 0 && <button type="button" onClick={clearFilters}>Reset filters</button>}</span><label>Sort by <select value={sort} onChange={(event) => setSort(event.target.value)}><option value="recommended">Recommended</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select><ChevronDown size={14} /></label></div>{loadingTrips || optionsLoading ? <div className="trips-empty-state"><div className="trips-loading-dot" /><p>Curating your journeys…</p></div> : filteredTrips.length ? <><div className={`trips-result-grid ${view === "list" ? "is-list" : ""}`}>{paginatedTrips.map((trip, index) => <Link href={`/${locale}/trips/${trip.id}`} className="trip-luxury-card" key={trip.id || index}><div className="trip-luxury-image"><Image src={trip.image} alt={trip.title} fill sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw" /><span>{String((page - 1) * pageSize + index + 1).padStart(2, "0")}</span>{trip.isPopular && <b><Flame size={13} /> Popular</b>}<i><ArrowUpRight size={17} /></i></div><div className="trip-luxury-copy"><div><small>{trip.tripCities.join(" · ") || "Southern Egypt"}</small><h2>{trip.title}</h2></div><div className="trip-luxury-details"><span><Clock3 size={14} /> {trip.duration}</span><strong>{trip.price ? `$${trip.price}` : "On request"}</strong></div></div></Link>)}</div><div className="trips-pagination" aria-label="Trips pagination"><button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={page === 1}>Previous</button><span>Page {page} of {pageCount}</span><button type="button" onClick={() => setPage((value) => Math.min(pageCount, value + 1))} disabled={page === pageCount}>Next</button></div></> : <div className="trips-empty-state"><span><Search size={22} /></span><h2>No journey matches that feeling.</h2><p>Try another destination, category, or clear the filters to see the full collection.</p><button type="button" onClick={clearFilters}>Show all journeys</button></div>}</div></section>{mobileFiltersOpen && <div className="trips-mobile-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setMobileFiltersOpen(false); }}><div className="trips-mobile-drawer"><button type="button" className="trips-drawer-close" onClick={() => setMobileFiltersOpen(false)} aria-label="Close filters"><X size={18} /></button>{filterPanel}<button type="button" className="trips-apply-button" onClick={() => setMobileFiltersOpen(false)}>Show {filteredTrips.length} journeys</button></div></div>}<Footer /><SignUpButton /><LoginModal />{user && <ChatWidget />}{user && <AdminDashboardButton />}</main>
  </>;
}
