"use client";
import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useCitiesCategories } from "@/context/CitiesCategoriesContext";
import DividerWithIcon from "@/components/layout/DividerWithIcon";
import { useRouter, usePathname } from "next/navigation";
import { useMotionValue } from "framer-motion";
const encodeData = (obj) => btoa(JSON.stringify(obj));
const optimize = (url) => {
  if (!url) return "/fallback.jpg";
  if (!url.startsWith("http")) return url;
  return `${url}?width=600&quality=70&format=webp`;
};

function CategoryCard({ cat, theme, themeName, language, isMobile, index, x }) {
  const [imgIndex, setImgIndex] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split("/").filter(Boolean)[0] || "en";
  const cardRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setVisible(true);
      },
      { threshold: 0.2 },
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || isMobile) return;
    const interval = setInterval(() => {
      setImgIndex((prev) => (prev + 1) % (cat.images?.length || 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [visible, cat.images, isMobile]);

  const displayName =
    typeof cat.name === "object"
      ? cat.name?.[language] || cat.name?.en || cat.name
      : cat.name;

  const handleClick = () => {
    // قائمة أسماء الكاتجري الخاصة بالـ Luxury
    const luxuryNames = [
      "Luxusreisen", // de
      "Luxury Tours", // en
      "Tours de lujo", // es
      "Voyages de luxe", // fr
      "Tour di lusso", // it
      "豪华旅游", // zh
    ];

    const queryObj = {
      city: "all",
      category: [displayName],
      // ✅ لو الكاتجري موجود في قائمة الـ Luxury → السعر = "Luxury"
      // غير ذلك → السعر = "All"
      price: luxuryNames.includes(displayName) ? "Luxury" : "All",
      popular: false,
    };

    // حفظ الكارد اللي ضغطت عليه
    sessionStorage.setItem("citiesScrollX", x.get());
    sessionStorage.setItem("selectedCityIndex", index);

    router.push(`/${locale}/trips?data=${encodeData(queryObj)}`);
  };

  return (
    <div
      ref={cardRef}
      onClick={handleClick}
      className={`relative rounded-2xl overflow-hidden group cursor-pointer min-w-[320px] lg:min-w-[250px] p-4 h-full
        transition-all duration-500 hover:scale-[1.06] hover:shadow-2xl
      ${theme.card} ${theme.border} ${theme.shadow}
      `}
    >
      <AnimatePresence mode="sync">
        {visible && (
          <motion.div
            key={isMobile ? 0 : imgIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <Image
              src={optimize(cat.images?.[isMobile ? 0 : imgIndex])}
              alt={displayName}
              fill
              loading="lazy"
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover rounded-lg"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={`absolute inset-0 bg-gradient-to-t ${
          themeName === "dark" ? "from-black/60" : "from-[#fdf6e3]/0"
        } via-transparent to-transparent flex items-end justify-center pb-4`}
      >
        <p
          className={`text-lg font-bold tracking-wide drop-shadow-lg ${
            themeName === "dark" ? "text-white" : "text-white"
          }`}
        >
          {displayName}
        </p>
      </div>
    </div>
  );
}

const CategoriesSection = () => {
  const { theme, themeName } = useTheme();
  const { t, i18n } = useTranslation("home");
  const { categories, loading } = useCitiesCategories();

  const normalizedLang = i18n.language.split("-")[0];
  const original = categories || [];
  const looped = [...original, ...original, ...original];

  const cardWidth = 290;
  const x = useMotionValue(0); // قيمة متحركة

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // حركة تلقائية بطيئة
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
  }, [x]);
  useEffect(() => {
    let animationFrame;
    const speed = isMobile ? 0.4 : 0.5; // سرعة أبطأ للموبايل

    const animate = () => {
      x.set(x.get() - speed);

      // لو وصلنا للنهاية نرجع للبداية
      if (Math.abs(x.get()) >= original.length * cardWidth) {
        x.set(0);
      }

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isMobile, original.length, x]);

  if (loading) {
    return <p className="text-center text-gray-500">Loading categories...</p>;
  }

  return (
    <section
      className={`flex flex-col py-24 px-6 w-full mx-auto relative transition-colors duration-500
        ${themeName === "dark" ? "bg-[#0f0f0f] text-white" : "bg-[#fdf6e3] text-[#3a2c0a]"}
      `}
    >
      <div className="max-w-7xl mx-auto mb-10 text-start">
        <h2
          className={`text-5xl font-extrabold tracking-wide drop-shadow-md text-left
            ${
              themeName === "dark"
                ? "text-gold"
                : "bg-gradient-to-r from-[#c9a34a] to-[#eab308] bg-clip-text text-transparent"
            }
          `}
        >
          {t("ExploreCategories")}
        </h2>
        <p className="mt-4 text-lg opacity-80 text-start">{t("Discover")}</p>
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
            // إيقاف الحركة أثناء السحب
            x.stop();
          }}
        >
          {looped.map((cat, i) => (
            <div
              key={i}
              className={`p-3 ${
                isMobile
                  ? "w-[100%] flex justify-center"
                  : "min-w-[50%] sm:min-w-[50%] md:min-w-[33.33%] lg:min-w-[20%]"
              }`}
            >
              <CategoryCard
                cat={cat}
                index={i}
                themeName={themeName}
                language={normalizedLang}
                theme={theme}
                x={x}
                isMobile={isMobile}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CategoriesSection;
