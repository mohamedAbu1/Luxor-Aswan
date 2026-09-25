"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const stats = [
  { value: "10+", label: "label" },
  { value: "25k+", label: "label2" },
  { value: "120+", label: "label3" },
  { value: "60+", label: "label4" },
];

export default function StatsSection() {
  const { t } = useTranslation("about");

  return (
    <section className="about-page-section about-stats-section">
      <div className="about-stats-intro"><span className="luxury-eyebrow">A quiet track record</span><p>Thoughtful journeys, measured in moments that stay with you.</p></div>
      <div className="about-stats-grid">
        {stats.map((stat, index) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .06 }} className="about-stat">
            <strong>{stat.value}</strong><span>{t(stat.label)}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
