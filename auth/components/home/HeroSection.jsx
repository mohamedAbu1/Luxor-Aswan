"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Compass, Play, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import Content from "./components/Content";

const heroImage = "https://images.unsplash.com/photo-1738580787552-5803e7be8e58?auto=format&fit=crop&w=2400&h=1350&q=88";
const detailImage = "https://images.unsplash.com/photo-1685616075808-04bb9db4ea1c?auto=format&fit=crop&w=1200&h=800&q=85";
const heroSlides = [
  { id: "river", image: heroImage, fallback: "/brand/hero-felucca.webp", location: "The Nile · Luxor", cardImage: detailImage, cardFallback: "/brand/luxor-balloons.webp", cardEyebrow: "A slower morning", cardTitle: <>See the Valley<br />before it wakes.</>, cardCopy: "Rise above Luxor while the first light touches the river." },
  { id: "temples", image: "https://images.unsplash.com/photo-1502250493741-939d1c76eaad?auto=format&fit=crop&w=2400&q=88", fallback: "/brand/cairo-pyramids.webp", location: "Abu Simbel · Upper Egypt", cardImage: "https://images.unsplash.com/photo-1502250493741-939d1c76eaad?auto=format&fit=crop&w=1200&q=85", cardFallback: "/brand/cairo-pyramids.webp", cardEyebrow: "Ancient light", cardTitle: <>Enter the story<br />at first sight.</>, cardCopy: "Move through monumental places with an expert beside you." },
  { id: "dawn", image: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=2400&h=1350&q=88", fallback: "/brand/egypt-pyramid.webp", location: "Giza · Ancient Egypt", cardImage: detailImage, cardFallback: "/brand/luxor-balloons.webp", cardEyebrow: "A slower morning", cardTitle: <>See the Valley<br />before it wakes.</>, cardCopy: "Golden light, open skies, and a private start to the day." },
];

export default function HeroSection() {
  const pathname = usePathname();
  const { t } = useTranslation("home");
  const locale = pathname.split("/").filter(Boolean)[0] || "en";
  const [activeSlide, setActiveSlide] = useState(0);
  const [failedSlides, setFailedSlides] = useState({});
  const [failedCards, setFailedCards] = useState({});
  const slide = heroSlides[activeSlide];

  useEffect(() => {
    const timer = window.setInterval(() => setActiveSlide((current) => (current + 1) % heroSlides.length), 7000);
    return () => window.clearInterval(timer);
  }, []);

  const changeSlide = (direction) => setActiveSlide((current) => (current + direction + heroSlides.length) % heroSlides.length);

  return (
    <section className="hero-global relative isolate min-h-[100svh] overflow-hidden text-white">
      <motion.div key={slide.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .8 }} className="absolute inset-0">
        <Image src={failedSlides[slide.id] ? slide.fallback : slide.image} onError={() => setFailedSlides((current) => ({ ...current, [slide.id]: true }))} alt={`${slide.location} travel experience in Egypt`} fill priority={activeSlide === 0} unoptimized sizes="100vw" className="object-cover object-center" />
      </motion.div>
      <div className="hero-global-shade" />
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1440px] flex-col px-5 pb-32 pt-28 lg:px-10 lg:pb-32 lg:pt-36">
        <div className="hero-global-topline"><span>Luxor</span><i /><span>Aswan</span><i /><span>The Nile</span><span className="hidden sm:inline">·</span><span className="hidden sm:inline">Private Egypt, thoughtfully arranged</span></div>
        <div className="grid flex-1 items-center gap-12 lg:grid-cols-[1fr_.72fr]">
          <div className="max-w-4xl">
            <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="luxury-eyebrow mb-7 text-[var(--gold-bright)]">Curated journeys · Southern Egypt</motion.p>
            <motion.h1 initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .08 }} className="hero-global-title site-display">
              Egypt, at<br /><em>your own</em> pace.
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .16 }} className="hero-global-copy">{t("DiscoverWasetTravel")} — private experiences, timeless temples, and the quiet rhythm of the river.</motion.p>
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .24 }} className="mt-9 flex flex-wrap items-center gap-3">
              <Link href={`/${locale}/trips`} className="luxury-button luxury-button-primary"><Compass size={17} /> Explore journeys <ArrowUpRight size={16} /></Link>
              <a href="#story" className="luxury-button luxury-button-ghost"><Play size={15} /> Our point of view</a>
            </motion.div>
            <div className="hero-global-proof"><span><strong>4.9</strong> guest rating</span><span><strong>12+</strong> years of local craft</span><span><strong>100%</strong> personal support</span></div>
          </div>

          <motion.div key={`card-${slide.id}`} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .55 }} className="hero-global-feature">
            <div className="hero-global-feature-image"><Image src={failedCards[slide.id] ? slide.cardFallback : slide.cardImage} onError={() => setFailedCards((current) => ({ ...current, [slide.id]: true }))} alt={slide.cardEyebrow} fill unoptimized sizes="(max-width: 1024px) 90vw, 420px" /></div>
            <div className="hero-global-feature-body"><div className="flex items-center justify-between gap-3"><span className="luxury-eyebrow text-[var(--gold-bright)]">{slide.cardEyebrow}</span><Sparkles size={16} className="text-[var(--gold-bright)]" /></div><h2>{slide.cardTitle}</h2><p>{slide.cardCopy}</p><a href="https://unsplash.com" target="_blank" rel="noreferrer" className="hero-global-credit">Photography via Unsplash ↗</a></div>
          </motion.div>
        </div>
        <div className="hero-slider-ui" aria-label="Hero image slider controls">
          <div><span className="hero-slider-count">0{activeSlide + 1}</span><span className="hero-slider-total"> / 0{heroSlides.length}</span><span className="hero-slider-location">{slide.location}</span></div>
          <div className="hero-slider-actions"><button type="button" onClick={() => changeSlide(-1)} aria-label="Previous slide"><ArrowLeft size={16} /></button><button type="button" onClick={() => changeSlide(1)} aria-label="Next slide"><ArrowRight size={16} /></button></div>
          <div className="hero-slider-dots">{heroSlides.map((item, index) => <button type="button" key={item.id} onClick={() => setActiveSlide(index)} className={index === activeSlide ? "is-active" : ""} aria-label={`Go to slide ${index + 1}`}><span /></button>)}</div>
        </div>
        <div className="hero-global-filter"><Content /></div>
      </div>
    </section>
  );
}
