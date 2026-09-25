"use client";

import { ChevronDown, Compass, MapPin, Search, Sparkles } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useData } from "@/context/DataContext";
import { useCitiesCategories } from "@/context/CitiesCategoriesContext";

export default function Content() {
  const router = useRouter();
  const pathname = usePathname();
  const { t, i18n } = useTranslation("home");
  const { city, setCity, price, setPrice, tripType, setTripType } = useData();
  const { cities = [], categories = [] } = useCitiesCategories();
  const locale = pathname.split("/").filter(Boolean)[0] || "en";
  const language = i18n.language?.split("-")[0] || "en";
  const cityOptions = cities.length ? cities : [{ name: "Luxor" }, { name: "Aswan" }, { name: "Cairo" }];
  const categoryOptions = categories.length ? categories : [{ name: "One Day Trips" }, { name: "Luxury Tours" }];

  const labelFor = (item) => typeof item.name === "object" ? item.name?.[language] || item.name?.en : item.name;
  const handleSearch = () => {
    const query = { city: [city], category: [tripType], price, popular: false };
    router.push(`/${locale}/trips?data=${btoa(JSON.stringify(query))}`);
  };

  return (
    <div className="hero-search-panel luxury-panel w-full rounded-[1.4rem] p-2.5 sm:p-3">
      <div className="hero-search-heading">
        <span className="hero-search-kicker"><Sparkles size={13} /> Curated for you</span>
        <span className="hero-search-hint">Start with a feeling</span>
      </div>
      <div className="hero-search-fields">
        <label className="hero-search-field">
          <span className="hero-search-label"><MapPin size={14} /> Destination</span>
          <span className="hero-search-control">
            <select value={city || "Luxor"} onChange={(e) => setCity(e.target.value)} aria-label="Destination">
              {cityOptions.map((item, index) => <option key={item.id || index} value={labelFor(item)}>{labelFor(item)}</option>)}
            </select>
            <ChevronDown size={15} aria-hidden="true" />
          </span>
        </label>
        <label className="hero-search-field">
          <span className="hero-search-label"><Compass size={14} /> Experience</span>
          <span className="hero-search-control">
            <select value={tripType || "One Day Trips"} onChange={(e) => setTripType(e.target.value)} aria-label="Experience type">
              {categoryOptions.map((item, index) => <option key={item.id || index} value={labelFor(item)}>{labelFor(item)}</option>)}
            </select>
            <ChevronDown size={15} aria-hidden="true" />
          </span>
        </label>
        <label className="hero-search-field">
          <span className="hero-search-label"><Sparkles size={14} /> Pace</span>
          <span className="hero-search-control">
            <select value={price || "All"} onChange={(e) => setPrice(e.target.value)} aria-label="Price range">
              <option value="All">All budgets</option><option value="Economy">Essential</option><option value="Luxury">Signature</option>
            </select>
            <ChevronDown size={15} aria-hidden="true" />
          </span>
        </label>
        <button type="button" onClick={handleSearch} className="hero-search-submit luxury-button luxury-button-primary">
          <Search size={16} /> <span>{t("Search")}</span>
        </button>
      </div>
    </div>
  );
}
