"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Logo from "./components/Logo";
import NavBar from "./components/NavBar";
import RightBar from "./components/RightBar";
import MobileNavBar from "./components/MobileNavBar";
import { LogIn, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const { isLoggedIn, logout, handleOpen } = useAuth();
  const { t } = useTranslation("header");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`site-header fixed left-0 top-0 z-50 w-full border-b border-transparent pt-3 lg:pt-0 ${scrolled ? "is-scrolled" : "is-top"}`}
    >
      <div className="site-header-shell mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-3 lg:px-7">
        <Logo />
        <div className="site-header-center">
          <NavBar scrolled={scrolled} />
        </div>

        <div className="site-header-actions">
          <RightBar scrolled={scrolled} />
          <motion.div whileHover={{ scale: 1.03 }} className="hidden sm:flex">
            <button
              aria-label={isLoggedIn ? "Log out" : "Create account or log in"}
              onClick={isLoggedIn ? logout : handleOpen}
              className="luxury-button luxury-button-primary site-header-cta px-4 py-2 text-xs uppercase tracking-[.12em]"
            >
              {isLoggedIn ? <LogOut size={15} /> : <LogIn size={15} />}
              <span>{isLoggedIn ? t("Logout") : t("SignUp")}</span>
            </button>
          </motion.div>
        </div>
      </div>
      </motion.header>

      <MobileNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </>
  );
}
