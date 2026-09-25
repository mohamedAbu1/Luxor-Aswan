"use client";

import Footer from "@/components/layout/FooterSection";
import Header from "@/auth/components/header/Header";
import HeroSection from "@/auth/components/home/HeroSection";
import HomeExperienceSections from "@/auth/components/home/HomeExperienceSections";
import LoginModal from "@/auth/components/home/components/LoginModal";
import SignUpButton from "@/auth/components/home/components/SignUpButton";
import ChatWidget from "@/components/layout/ChatWidget";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <main className="site-shell min-h-screen w-full">
      <Header />
      <HeroSection />
      <HomeExperienceSections />
      <Footer />
      <SignUpButton />
      <LoginModal />
      {user && <ChatWidget />}
    </main>
  );
}
