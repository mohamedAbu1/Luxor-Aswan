"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function CTASection() {
  const { t } = useTranslation("about");
  const pathname = usePathname();
  const locale = pathname.split("/").filter(Boolean)[0] || "en";

  return (
    <section className="about-page-cta">
      <div><span className="luxury-eyebrow">03 / Your next chapter</span><h2>{t("h6")}</h2><p>{t("p5")}</p></div>
      <motion.a whileHover={{ y: -3 }} href={`/${locale}/contact`} className="luxury-button luxury-button-primary">{t("a")} <ArrowUpRight size={17} /></motion.a>
    </section>
  );
}
