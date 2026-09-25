"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function HeritageSection() {
  const { t } = useTranslation("about");

  return (
    <section className="about-page-section about-heritage-section">
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} className="about-heritage-image">
        <Image src="/brand/cairo-pyramids.webp" alt="Egyptian heritage and the Giza pyramids" fill sizes="(max-width: 900px) 92vw, 48vw" />
        <span>02 / Heritage</span>
      </motion.div>
      <div className="about-heritage-copy">
        <span className="luxury-eyebrow">The details matter</span>
        <h2>{t("h5")}</h2>
        <p>{t("p4")}</p>
        <a href="#our-mission" aria-label="Read more about our heritage"><ArrowUpRight size={18} /></a>
      </div>
    </section>
  );
}
