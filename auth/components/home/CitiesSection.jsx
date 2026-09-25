"use client";
import Image from "next/image";
import React, { useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { motion, useMotionValue } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useCitiesCategories } from "@/context/CitiesCategoriesContext";
import DividerWithIcon from "@/components/layout/DividerWithIcon";
import { useRouter, usePathname } from "next/navigation";

const optimize = (url) => {
  if (!url) return "/fallback.jpg";
  if (!url.startsWith("http")) return url;
  return `${url}?width=700&quality=70&format=webp`;
};

const encodeData = (obj) => btoa(JSON.stringify(obj));

function CityCard({ city, index, themeName, theme, language, t, x, cardWidth }) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split("/").filter(Boolean)[0] || "en";
  const cityName = city.name?.[language] || city.name?.en || city.name || "";

  const handleExplore = () => {
    const queryObj = {
      city: [cityName],
      category: "all",
      price: "All",
      popular: false,
    };

    sessionStorage.setItem("citiesScrollX", x.get());
    sessionStorage.setItem("selectedCityIndex", index);

    router.push(`/${locale}/trips?data=${encodeData(queryObj)}`);
  };

  return (
    <div className="min-w-[320px] p-4 h-full">
      <div
        onClick={handleExplore}
        className={`
          relative h-100 rounded-2xl overflow-hidden group cursor-pointer
          ${theme.card} ${theme.border} ${theme.shadow}
          transition-all duration-500
          hover:scale-[1.05] hover:shadow-2xl hover:-rotate-1
        `}
      >
        <Image
          src={optimize(city.images?.[0])}
          alt={cityName}
          fill
          loading="lazy"
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover rounded-lg"
        />

        <div
          className={`
            absolute inset-0 
            ${theme.overlay}
            flex flex-col items-center justify-end pb-6
          `}
        >
          <p className="text-lg font-bold text-white drop-shadow-lg mb-2">
            {cityName}
          </p>

          <button
            className={`
              opacity-0 group-hover:opacity-100 px-4 py-2 rounded-lg text-sm font-medium transition text-white cursor-pointer
              ${
                themeName === "dark"
                  ? "bg-[#c9a34a] hover:bg-yellow-500"
                  : "bg-[#c9a34a] hover:bg-[#b5892e]"
              }
            `}
          >
            {t("Explore")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CitiesSection() {
  const { theme, themeName } = useTheme();
  const { t, i18n } = useTranslation("home");
  const { cities, loading } = useCitiesCategories();
  const normalizedLang = i18n.language.split("-")[0];

  const original = cities || [];
  const looped = [...original, ...original, ...original]; // تكرار الكروت

  const x = useMotionValue(0);
  const speed = 0.6;
  const cardWidth = 340;

  useEffect(() => {
    const savedX = sessionStorage.getItem("citiesScrollX");
    const selectedIndex = sessionStorage.getItem("selectedCityIndex");

    if (selectedIndex) {
      const centerOffset = window.innerWidth / 2 - cardWidth / 2;
      const targetX = -(parseInt(selectedIndex) * cardWidth - centerOffset);
      x.set(targetX);
    } else if (savedX) {
      x.set(parseFloat(savedX));
    }
  }, [x, cardWidth]);

  // حركة مستمرة (marquee style)
  useEffect(() => {
    let animationFrame;
    const animate = () => {
      x.set(x.get() - speed);

      // إعادة الضبط عند الوصول للنهاية
      if (Math.abs(x.get()) >= (original.length * cardWidth)) {
        x.set(0);
      }

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [original.length, x, cardWidth]);

  if (loading) {
    return <p className="text-center text-gray-500">Loading cities...</p>;
  }

  return (
    <section
      className={`
        flex py-12 px-6 flex-col w-full mx-auto relative
        ${
          themeName === "dark"
            ? "bg-[#0f0f0f] text-white"
            : "bg-[#fdf6e3] text-[#3a2c0a]"
        }
      `}
    >
      <div className="max-w-2xl mx-auto mb-16 w-full">
        <h2
          className={`
            text-5xl font-extrabold tracking-wide drop-shadow-md text-center
            ${
              themeName === "dark"
                ? "text-gold"
                : "bg-gradient-to-r from-[#c9a34a] to-[#eab308] bg-clip-text text-transparent"
            }
          `}
        >
          {t("ExploreCities")}
        </h2>
        <DividerWithIcon />
      </div>

      <div className="relative overflow-hidden w-full max-w-7xl mx-auto h-[480px]">
        <motion.div
          className="flex h-full"
          style={{ x }}
          drag="x"
          dragConstraints={{
            left: -(looped.length * cardWidth - window.innerWidth),
            right: 0,
          }}
          dragElastic={0.05}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          onDragStart={() => {
            x.stop();
          }}
        >
          {looped.map((city, i) => (
            <CityCard
              key={i}
              index={i}
              city={city}
              t={t}
              themeName={themeName}
              theme={theme}
              language={normalizedLang}
              x={x}
              cardWidth={cardWidth}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
