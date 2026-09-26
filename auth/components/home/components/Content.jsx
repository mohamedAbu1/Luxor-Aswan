"use client";

import { Compass, MapPin, Search, Sparkles } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useData } from "@/context/DataContext";
import { useCitiesCategories } from "@/context/CitiesCategoriesContext";
import LuxurySelect from "@/components/ui/LuxurySelect";

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
            <LuxurySelect value={city || "Luxor"} onValueChange={setCity} ariaLabel="Destination" options={cityOptions.map((item, index) => ({ value: labelFor(item), label: labelFor(item), key: item.id || index }))} />
          </span>
        </label>
        <label className="hero-search-field">
          <span className="hero-search-label"><Compass size={14} /> Experience</span>
          <span className="hero-search-control">
            <LuxurySelect value={tripType || "One Day Trips"} onValueChange={setTripType} ariaLabel="Experience type" options={categoryOptions.map((item, index) => ({ value: labelFor(item), label: labelFor(item), key: item.id || index }))} />
          </span>
        </label>
        <label className="hero-search-field">
          <span className="hero-search-label"><Sparkles size={14} /> Pace</span>
          <span className="hero-search-control">
            <LuxurySelect value={price || "All"} onValueChange={setPrice} ariaLabel="Price range" options={[{ value: "All", label: "All budgets" }, { value: "Economy", label: "Essential" }, { value: "Luxury", label: "Signature" }]} />
          </span>
        </label>
        <button type="button" onClick={handleSearch} className="hero-search-submit luxury-button luxury-button-primary">
          <Search size={16} /> <span>{t("Search")}</span>
        </button>
      </div>
    </div>
  );
}
