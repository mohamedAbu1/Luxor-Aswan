// file: context/CitiesCategoriesContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { isSupabaseConfigured } from "@/lib/supabaseClient";
import { staticCities, staticCategories } from "@/data/staticCatalog";

const CitiesCategoriesContext = createContext();

export function CitiesCategoriesProvider({ children }) {
  const [cities, setCities] = useState(staticCities);
  const [categories, setCategories] = useState(staticCategories);
  const [loading, setLoading] = useState(true);

  const { i18n } = useTranslation(); // اللغة الحالية للموقع
  const getLangKey = (lang) => lang.split("-")[0];
const normalizedLang = getLangKey(i18n.language);

  useEffect(() => {
    const fetchData = async () => {
      if (!isSupabaseConfigured) {
        setCities(staticCities);
        setCategories(staticCategories);
        setLoading(false);
        return;
      }

      try {
        const [citiesRes, categoriesRes] = await Promise.all([
          fetch("/api/cities"),
          fetch("/api/categories"),
        ]);

        const citiesData = await citiesRes.json();
        const categoriesData = await categoriesRes.json();

        if (citiesData.success && citiesData.cities?.length) setCities(citiesData.cities);
        else setCities(staticCities);
        if (categoriesData.success && categoriesData.categories?.length) setCategories(categoriesData.categories);
        else setCategories(staticCategories);
      } catch (err) {
        console.error("Error fetching cities/categories:", err);
        setCities(staticCities);
        setCategories(staticCategories);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  // فلترة أسماء المدن حسب لغة الموقع الحالي
  const localizedCities = cities.map(city => ({
    ...city,
    name: city.translations?.[normalizedLang] || city.translations?.["en"] || city.name,
  }));

  // فلترة الكاتجري حسب لغة الموقع الحالي
  const localizedCategories = categories.map(cat => ({
    ...cat,
    name: cat.name?.[normalizedLang] || cat.name?.["en"] || cat.name,
  }));

  return (
    <CitiesCategoriesContext.Provider
      value={{ cities: localizedCities, categories: localizedCategories, loading }}
    >
      {children}
    </CitiesCategoriesContext.Provider>
  );
}

export const useCitiesCategories = () => useContext(CitiesCategoriesContext);
