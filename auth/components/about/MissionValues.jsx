"use client";

import { motion } from "framer-motion";
import { Compass, Gem, HeartHandshake } from "lucide-react";
import { useTranslation } from "react-i18next";

const cards = [
  { icon: HeartHandshake, title: "h3", body: "p2" },
  { icon: Gem, title: "h2", body: "li" },
  { icon: Compass, title: "h4", body: "p3" },
];

export default function MissionValues() {
  const { t } = useTranslation("about");

  return (
    <section id="our-mission" className="about-page-section about-mission-section">
      <div className="about-section-heading"><span>01</span><p>What guides us</p></div>
      <div className="about-mission-grid">
        {cards.map(({ icon: Icon, title, body }, index) => (
          <motion.article key={title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ delay: index * .08 }} className="about-info-card">
            <div className="about-info-icon"><Icon size={18} /></div>
            <p className="about-card-index">0{index + 1}</p>
            <h2>{t(title)}</h2>
            <div className="about-card-line" />
            <p>{t(body)}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
