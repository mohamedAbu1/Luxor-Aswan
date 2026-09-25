"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { ArrowDownRight, Sparkles } from "lucide-react";

export default function AboutHero() {
  const { t } = useTranslation("about");

  return (
    <section className="about-page-hero">
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="about-page-hero-copy"
        >
          <p
            className="luxury-eyebrow"
          >
            {t("AboutWasetTravel")}
          </p>
          <div className="about-page-rule" />
          <h1
            className="site-display"
          >
            {t("h1")}
          </h1>
          <div className="about-page-rule" />
          <p
            className="about-page-intro"
          >
            {t("p")}
          </p>
          <a href="#our-mission" className="about-page-scroll-link">Discover our story <ArrowDownRight size={17} /></a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="about-page-portrait-wrap"
        >
          <Image
            src="/brand/hero-felucca.webp"
            alt="A felucca sailing on the Nile in Egypt"
            fill
            className="object-cover"
          />
          <div className="about-page-portrait-caption"><Sparkles size={15} /> <span>Local knowledge. Personal care.</span></div>
        </motion.div>
    </section>
  );
}
