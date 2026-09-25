"use client";
import React from "react";
import { FaSearch } from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FaThLarge, FaBars } from "react-icons/fa";

export default function TripsSearch({
  search,
  setSearch,
  cities,
  categories,
  city,
  category,
  updateValue,
  setCardStyle,
  cardStyle,
  loading,
}) {
  const { themeName } = useTheme();
  const { t, i18n } = useTranslation("trips");
  const lang = i18n.language || "en";
  const handleCityClick = (cityId) => {
    updateValue("city", cityId);
  };

  const handleCategoryClick = (catId) => {
    updateValue("category", catId);
  };

  const chipStyle = (active) =>
    `px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 cursor-pointer ${
      active
        ? "bg-[var(--gold)] text-[#101718] shadow-md"
        : "bg-[var(--surface-soft)] text-[var(--foreground)] hover:bg-[var(--line)]"
    }`;

  if (loading) {
    return (
      <p className="lg:hidden text-center text-gray-500 mb-6">
        {t("LoadingCategories")}
      </p>
    );
  }

  return (
    <>
      {/* ✅ شريط البحث (يظهر على الشاشات الكبيرة) */}
      <div
        className={`hidden lg:flex w-full items-center gap-3 p-4 rounded-xl shadow transition ${
          themeName === "dark"
            ? "bg-[#0f0f0f] border border-gold/30 text-white"
            : "bg-[var(--surface)] border border-[var(--line)] text-[var(--foreground)] backdrop-blur-sm"
        }`}
      >
        <FaSearch
          className="text-xl text-[var(--gold)]"
        />
        <input
          type="text"
          placeholder={t("Searchtrips")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`flex-1 p-2 rounded-lg border outline-none transition ${
            themeName === "dark"
              ? "bg-[var(--surface-strong)] text-[var(--input-text)] border-[var(--line)] focus:border-[var(--gold)]"
              : "bg-[var(--surface-strong)] text-[var(--input-text)] border-[var(--line)] focus:border-[var(--gold)]"
          }`}
        />
        <div className="flex gap-2">
          <button
            onClick={() => setCardStyle("vertical")}
            className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-bold transition ${
              cardStyle === "vertical"
                ? themeName === "dark"
                  ? "bg-[#c9a34a] text-black hover:bg-yellow-500"
                  : "bg-[var(--gold)] text-[#101718] hover:bg-[var(--gold-bright)]"
                : themeName === "dark"
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  : "bg-[var(--surface-soft)] text-[var(--foreground)] hover:bg-[var(--line)]"
            }`}
          >
            <FaThLarge /> {t("Vertical")}
          </button>

          <button
            onClick={() => setCardStyle("horizontal")}
            className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-bold transition ${
              cardStyle === "horizontal"
                ? themeName === "dark"
                  ? "bg-[#c9a34a] text-black hover:bg-yellow-500"
                  : "bg-[var(--gold)] text-[#101718] hover:bg-[var(--gold-bright)]"
                : themeName === "dark"
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  : "bg-[var(--surface-soft)] text-[var(--foreground)] hover:bg-[var(--line)]"
            }`}
          >
            <FaBars /> {t("Horizontal")}
          </button>
        </div>
      </div>

      {/* ✅ فلترة المدن والفئات (يظهر على الموبايل) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full flex lg:hidden flex-col gap-4 mb-6 mt-5"
      >
        {/* المدن */}
        <div>
          <h3 className="text-lg font-bold mb-2">{t("FilterByCity")}</h3>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={chipStyle(city === "" || city === "all")}
              onClick={() => handleCityClick("all")}
              aria-pressed={city === "" || city === "all"}
            >
              {t("All")}
            </button>
            {cities.map((c) => {
              const displayName =
                typeof c.name === "object"
                  ? c.name[lang] || c.name["en"]
                  : c.name;
              return (
                <button
                  type="button"
                  key={c.id}
                  className={chipStyle(
                    Array.isArray(city)
                      ? city.includes(displayName)
                      : city === displayName,
                  )}
                  onClick={() => handleCityClick(displayName)}
                  aria-pressed={Array.isArray(city) ? city.includes(displayName) : city === displayName}
                >
                  {displayName}
                </button>
              );
            })}
          </div>
        </div>

        {/* الفئات */}
        <div>
          <h3 className="text-lg font-bold mb-2">{t("FilterByCategory")}</h3>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={chipStyle(category === "" || category === "all")}
              onClick={() => handleCategoryClick("all")}
              aria-pressed={category === "" || category === "all"}
            >
              {t("All")}
            </button>
            {categories.map((cat) => {
              const displayName =
                typeof cat.name === "object"
                  ? cat.name[lang] || cat.name["en"]
                  : cat.name;
              return (
                <button
                  type="button"
                  key={cat.id}
                  className={chipStyle(
                    Array.isArray(category)
                      ? category.includes(displayName)
                      : category === displayName,
                  )}
                  onClick={() => handleCategoryClick(displayName)}
                  aria-pressed={Array.isArray(category) ? category.includes(displayName) : category === displayName}
                >
                  {displayName}
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </>
  );
}
