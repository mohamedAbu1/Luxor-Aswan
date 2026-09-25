"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Check,
  ClipboardCheck,
  CreditCard,
  FileCheck2,
  Info,
  Mail,
  ShieldCheck,
  WalletCards,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import Header from "@/auth/components/header/Header";
import SocialFloatingButton from "@/components/layout/SocialFloatingButton";
import ChatWidget from "@/components/layout/ChatWidget";
import { useAuth } from "@/context/AuthContext";

const adviceImages = [
  "/cairo/cairo-cultural-scene.webp",
  "/homepage/homepage-desert-scene.webp",
  "/aswan/aswan-river-experience.webp",
  "/aswan/aswan-temple-river.webp",
  "/cairo/cairo-nile-skyline.webp",
];

export default function VisaInfoPage() {
  const { t } = useTranslation("visa");
  const { user } = useAuth();

  const requirements = ["li", "li2", "li3", "li4", "li5"];
  const steps = ["li6", "li7", "li8", "li9", "li10"];
  const notes = ["li11", "li12", "li13", "li14"];
  const advice = ["1", "2", "3", "4", "8"];

  return (
    <main className="visa-page">
      <Header />

      <section className="visa-hero">
        <Image
          src="/cairo/cairo-cultural-scene.webp"
          alt="A vivid cultural scene from Cairo, Egypt"
          fill
          priority
          sizes="100vw"
          className="visa-hero-image"
        />
        <div className="visa-hero-overlay" />
        <div className="visa-hero-content">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="visa-eyebrow"
          >
            {t("VISA")} · travel essentials
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
            Plan your Egyptian visa<br /><em>with confidence.</em>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
            {t("VISA_P")}. Everything you need, clearly arranged before your journey begins.
          </motion.p>
          <a className="visa-hero-link" href="#visa-details">
            Explore requirements <ArrowUpRight size={16} />
          </a>
        </div>
        <div className="visa-hero-stamp"><ShieldCheck size={18} /><span>Official guidance<br /><b>before you fly</b></span></div>
      </section>

      <section id="visa-details" className="visa-page-body">
        <div className="visa-intro-grid">
          <div>
            <span className="visa-section-kicker">01 · Before departure</span>
            <h2>{t("title1")}</h2>
            <p>{t("p2")}</p>
          </div>
          <aside className="visa-quick-card">
            <span className="visa-card-label">A clear start</span>
            <strong>Egypt eVisa</strong>
            <div className="visa-quick-row"><WalletCards size={17} /><span>From <b>$25</b></span></div>
            <div className="visa-quick-row"><ClipboardCheck size={17} /><span>Standard stay <b>30 days</b></span></div>
          </aside>
        </div>

        <div className="visa-panel-grid">
          <section className="visa-panel visa-table-panel">
            <div className="visa-panel-heading"><span className="visa-icon-badge"><FileCheck2 size={18} /></span><div><span className="visa-section-kicker">02 · Choose your route</span><h2>{t("title2")}</h2></div></div>
            <div className="visa-table-wrap">
              <table className="visa-table">
                <thead><tr><th>{t("th")}</th><th>{t("th2")}</th><th>{t("th3")}</th></tr></thead>
                <tbody><tr><td><b>{t("th4")}</b></td><td>{t("th5")}</td><td>{t("th6")}</td></tr></tbody>
              </table>
            </div>
          </section>

          <section className="visa-panel visa-fee-panel">
            <div className="visa-panel-heading"><span className="visa-icon-badge"><CreditCard size={18} /></span><div><span className="visa-section-kicker">03 · Plan your budget</span><h2>{t("title4")}</h2></div></div>
            <div className="visa-fee-list"><div><span>{t("th15")}</span><strong>{t("th16")}</strong></div><div><span>{t("th17")}</span><strong>{t("th18")}</strong></div></div>
          </section>
        </div>

        <div className="visa-content-grid">
          <section className="visa-panel">
            <span className="visa-section-kicker">04 · Prepare your file</span><h2>{t("title3")}</h2>
            <ul className="visa-check-list">{requirements.map((key) => <li key={key}><span><Check size={14} /></span>{t(key)}</li>)}</ul>
          </section>
          <section className="visa-panel">
            <span className="visa-section-kicker">05 · Five simple steps</span><h2>{t("title5")}</h2>
            <ol className="visa-step-list">{steps.map((key, index) => <li key={key}><span>{String(index + 1).padStart(2, "0")}</span>{t(key)}</li>)}</ol>
          </section>
        </div>

        <section className="visa-portal-panel">
          <div><span className="visa-section-kicker">06 · Official sources</span><h2>Apply through the right door.</h2><p>Use the official Egyptian eVisa portal for your application and consult the government project information when needed.</p></div>
          <div className="visa-portal-actions"><a href="https://www.visa2egypt.gov.eg/eVisa/en/" target="_blank" rel="noreferrer">{t("link1")} <ArrowUpRight size={15} /></a><a href="https://www.presidency.eg/en/projects/evisa/" target="_blank" rel="noreferrer">{t("link2")} <ArrowUpRight size={15} /></a></div>
        </section>

        <div className="visa-content-grid visa-bottom-grid">
          <section className="visa-panel visa-note-panel"><div className="visa-panel-heading"><span className="visa-icon-badge"><Info size={18} /></span><div><span className="visa-section-kicker">07 · Keep in mind</span><h2>{t("title6")}</h2></div></div><ul className="visa-bullet-list">{notes.map((key) => <li key={key}>{t(key)}</li>)}</ul></section>
          <section className="visa-panel visa-contact-panel"><span className="visa-section-kicker">08 · Need help?</span><h2>{t("title7")}</h2><p>{t("p3")}</p><a href="mailto:visa@egypt.gov.eg"><Mail size={17} /> visa@egypt.gov.eg</a><strong>Hotline · 19654</strong></section>
        </div>

        <section className="visa-advice-section"><div className="visa-advice-heading"><div><span className="visa-section-kicker">09 · On the ground</span><h2>{t("generalAdviceTitle")}</h2></div><p>Small details make your time in Egypt feel easier, warmer, and more respectful.</p></div><div className="visa-advice-grid">{advice.map((key, index) => <article className="visa-advice-card" key={key}><div className="visa-advice-image"><Image src={adviceImages[index]} alt={t(`advice.${key}.title`)} fill sizes="(max-width: 700px) 90vw, 20vw" /></div><div><h3>{t(`advice.${key}.title`)}</h3><p>{t(`advice.${key}.description`)}</p></div></article>)}</div></section>
      </section>

      <SocialFloatingButton />
      {user && <ChatWidget user={user} />}
    </main>
  );
}
