"use client";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { Home, Compass, Heart, User } from "lucide-react";

export default function MobileNavBar({ activeTab, setActiveTab }) {
  const router = useRouter();
  const pathname = usePathname(); 
  const { theme } = useTheme();

  const navItems = [
    { id: "home", label: "Home", icon: <Home size={22} />, path: "/" },
    { id: "trips", label: "Trips", icon: <Compass size={22} />, path: "/trips" },
    { id: "about", label: "About", icon: <Heart size={22} />, path: "/about" },
    { id: "contact", label: "Contact", icon: <User size={22} />, path: "/contact" },
  ];

  // ✅ إزالة prefix الخاص باللغة (en, ar, fr...)
  const segments = pathname.split("/").filter(Boolean);
  const locale = ["en", "ar", "fr", "de", "it", "es", "zh"].includes(segments[0]) ? segments[0] : "en";
  const cleanPath = pathname.replace(new RegExp(`^/${locale}`), "") || "/";

  // ✅ حدّث الـ activeTab عند تغيّر المسار
  useEffect(() => {
    let current;
    if (cleanPath === "/") {
      // لو المسار هو / فقط → خلي الـ Home active
      current = navItems.find((item) => item.path === "/");
    } else {
      // باقي الصفحات → استخدم startsWith
      current = navItems.find((item) => cleanPath.startsWith(item.path) && item.path !== "/");
    }
    if (current) setActiveTab(current.id);
  }, [cleanPath]);

  return (
    <motion.nav
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mobile-site-nav fixed bottom-4 left-1/2 z-[70] w-[calc(100%-2rem)] -translate-x-1/2 rounded-2xl border border-[var(--line)] bg-[var(--surface)]/90 backdrop-blur-xl shadow-[var(--shadow)] lg:hidden"
    >
      <div className="mobile-site-nav-inner flex items-center justify-around py-2.5">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-current={activeTab === item.id ? "page" : undefined}
            onClick={() => router.push(`/${locale}${item.path}`)}
            className={`mobile-site-nav-item flex flex-col items-center text-[11px] gap-1 font-semibold transition-all cursor-pointer ${
              activeTab === item.id ? "text-[var(--gold)]" : "text-[var(--muted)]"
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </motion.nav>
  );
}
