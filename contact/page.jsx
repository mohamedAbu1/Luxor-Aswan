"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowUpRight, Check, Clock3, Globe2, Mail, MapPin, MessageCircle, Send, ShieldCheck, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import Header from "@/auth/components/header/Header";
import Footer from "@/components/layout/FooterSection";
import LoginModal from "@/auth/components/home/components/LoginModal";
import SignUpButton from "@/auth/components/home/components/SignUpButton";
import ChatWidget from "@/components/layout/ChatWidget";
import AdminDashboardButton from "@/components/layout/AdminDashboardButton";

const contactChannels = [
  { icon: MessageCircle, label: "WhatsApp · Argentina", value: "+54 11 59 58 09 62", href: "https://wa.me/5491159580962?text=Hola%2C%20quiero%20consultar%20disponibilidad%20para%20una%20excursion%20en%20Egipto." },
  { icon: MessageCircle, label: "WhatsApp · Luxor", value: "+20 10 10 10 48 75", href: "https://wa.me/201010104875?text=Hola%2C%20quiero%20consultar%20disponibilidad%20para%20una%20excursion%20en%20Egipto." },
  { icon: Mail, label: "Email", value: "info@luxoryaswanexcursiones.com", href: "mailto:info@luxoryaswanexcursiones.com" },
];

export default function ContactPage() {
  const { user } = useAuth();
  const { t } = useTranslation("contact");
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", message: "" });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [sending, setSending] = useState(false);

  const updateField = (event) => setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSending(true);
    setStatus({ type: "", message: "" });
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, name: user?.user_metadata?.name || user?.name || formData.name, email: user?.email || formData.email }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Unable to send your message.");
      setStatus({ type: "success", message: "Thank you — your message is on its way. We will reply shortly." });
      setFormData({ name: "", phone: "", email: "", message: "" });
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Something went wrong. Please try WhatsApp instead." });
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <main className="contact-page">
        <Header />
        <section className="contact-hero">
          <div className="contact-hero-image"><Image src="/brand/hero-felucca.webp" alt="A felucca sailing on the Nile in Luxor" fill priority sizes="100vw" /></div>
          <div className="contact-hero-shade" />
          <div className="contact-hero-inner">
            <div className="contact-hero-copy">
              <span className="contact-eyebrow"><Sparkles size={14} /> {t("h1")}</span>
              <h1>Let’s make Egypt<br /><em>feel personal.</em></h1>
              <p>{t("p1")}</p>
              <div className="contact-hero-meta"><span><Clock3 size={15} /> Reply within one business day</span><span><Globe2 size={15} /> Luxor · Aswan · Cairo</span></div>
            </div>
            <div className="contact-hero-note"><span>01 / 03</span><strong>Start with a feeling.</strong><p>Tell us what you want to remember. We will shape the rest.</p></div>
          </div>
        </section>

        <section className="contact-main-shell">
          <div className="contact-intro-row"><div><span className="contact-section-kicker">Private journeys · Since 2018</span><h2>A direct line to<br /><em>the people who know.</em></h2></div><p>From a first question to the last sunset on the Nile, our local team is here to make every detail calm, clear, and considered.</p></div>
          <div className="contact-layout">
            <aside className="contact-side">
              <div className="contact-channel-card"><span className="contact-card-kicker">Reach us directly</span><h3>Choose your<br />easiest way in.</h3><div className="contact-channel-list">{contactChannels.map(({ icon: Icon, label, value, href }) => <a key={value} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined} className="contact-channel"><span className="contact-channel-icon"><Icon size={17} /></span><span><small>{label}</small><strong>{value}</strong></span><ArrowUpRight size={15} /></a>)}</div></div>
              <div className="contact-trust-card"><ShieldCheck size={21} /><div><strong>Thoughtful by default.</strong><p>No pressure, no generic packages — just practical advice from Egypt.</p></div></div>
              <div className="contact-location-card"><div className="contact-location-image"><Image src="/aswan/aswan-river-sunset.webp" alt="Sunset over the Nile in Aswan" fill sizes="(max-width: 900px) 100vw, 380px" /></div><div><MapPin size={15} /><span>{t("sp")}</span></div></div>
            </aside>

            <form className="contact-form-card" onSubmit={handleSubmit}>
              <div className="contact-form-heading"><span className="contact-card-kicker">Your next chapter</span><h2>{t("h2")}</h2><p>Share a few details and our team will come back with a thoughtful next step.</p></div>
              <div className="contact-form-grid">
                <label><span>{t("lb")}</span><input type="text" name="name" value={user?.user_metadata?.name || user?.name || formData.name} onChange={updateField} placeholder={t("inp")} required readOnly={Boolean(user?.user_metadata?.name || user?.name)} /></label>
                <label><span>{t("lb2")}</span><input type="tel" name="phone" value={formData.phone} onChange={updateField} placeholder={t("inp2")} required /></label>
                <label className="contact-field-wide"><span>{t("lb3")}</span><input type="email" name="email" value={user?.email || formData.email} onChange={updateField} placeholder={t("inp3")} required readOnly={Boolean(user?.email)} /></label>
                <label className="contact-field-wide"><span>{t("lb4")}</span><textarea name="message" value={formData.message} onChange={updateField} placeholder={t("inp4")} rows={6} required /></label>
              </div>
              {status.message && <p className={`contact-form-status is-${status.type}`} role="status">{status.type === "success" && <Check size={16} />}{status.message}</p>}
              <div className="contact-form-footer"><span><ShieldCheck size={15} /> Your details stay private.</span><button type="submit" disabled={sending}>{sending ? "Sending…" : <>{t("btn")} <Send size={16} /></>}</button></div>
            </form>
          </div>
        </section>
        <Footer />
        <SignUpButton /><LoginModal />{user && <ChatWidget />}{user && <AdminDashboardButton />}
      </main>
    </>
  );
}
