"use client";
import React from "react";
import { useTheme } from "@/context/ThemeContext";
import Header from "@/auth/components/header/Header";
import Footer from "@/components/layout/FooterSection";
import EgyptianBackground from "@/components/layout/EgyptianBackground";
import LoginModal from "@/auth/components/home/components/LoginModal";
import SignUpButton from "@/auth/components/home/components/SignUpButton";

// استدعاء الأقسام الجديدة
import AboutHero from "@/auth/components/about/AboutHero";
import MissionValues from "@/auth/components/about/MissionValues";
import StatsSection from "@/auth/components/about/StatsSection";
import HeritageSection from "@/auth/components/about/HeritageSection";
import CTASection from "@/auth/components/about/CTASection";
import ChatWidget from "@/components/layout/ChatWidget";
import { useAuth } from "@/context/AuthContext";
import AdminDashboardButton from "@/components/layout/AdminDashboardButton";
import CurrencySelector from "@/components/layout/CurrencySelector";
export default function AboutPage() {
  const { theme } = useTheme();
  const { user } = useAuth(); // ✅ جلب المستخدم الحالي
  return (
    <>
      <main
        className={`
        w-full flex flex-col items-center justify-center
        min-h-screen font-sans transition-colors duration-300
        overflow-hidden
      `}
        
      >
        <Header />
        <EgyptianBackground />

        {/* الأقسام */}
        <AboutHero />
        <MissionValues />
        <StatsSection />
        <HeritageSection />
        <CTASection />

        <Footer />
        <SignUpButton />
        <LoginModal />
        {user && <ChatWidget />}
        {user && <AdminDashboardButton />}
      </main>
    </>
  );
}
