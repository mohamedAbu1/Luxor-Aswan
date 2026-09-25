export async function generateMetadata({ params }) {
  const { locale } = await params;
  const siteUrl = "https://www.luxoryaswanexcursiones.com";

  const metadataByLocale = {
    en: {
      title: "Discover Egypt | Luxor & Aswan",
      description:
        "Experience the magic of Egypt with Luxor & Aswan. Watch our immersive intro video, explore ancient wonders, and connect with us through stunning visuals and interactive content.",
    },
    es: {
      title: "Descubre Egipto | Luxor & Aswan",
      description:
        "Experimenta la magia de Egipto con Luxor & Aswan. Mira nuestro video introductorio, explora maravillas antiguas y conéctate con contenido visual impresionante.",
    },
    fr: {
      title: "Découvrez l'Égypte | Luxor & Aswan",
      description:
        "Vivez la magie de l'Égypte avec Luxor & Aswan. Regardez notre vidéo immersive, explorez les merveilles anciennes et profitez d’un contenu visuel captivant.",
    },
    de: {
      title: "Entdecke Ägypten | Luxor & Aswan",
      description:
        "Erlebe die Magie Ägyptens mit Luxor & Aswan. Sieh dir unser Intro-Video an, entdecke antike Wunder und genieße beeindruckende visuelle Inhalte.",
    },
    it: {
      title: "Scopri l'Egitto | Luxor & Aswan",
      description:
        "Vivi la magia dell'Egitto con Luxor & Aswan. Guarda il nostro video introduttivo, esplora meraviglie antiche e lasciati coinvolgere da contenuti visivi straordinari.",
    },
  };

  const fallback = {
    title: "Discover Egypt | Luxor & Aswan",
    description:
      "Experience the magic of Egypt with Luxor & Aswan. Watch our immersive intro video, explore ancient wonders, and connect with us through stunning visuals and interactive content.",
  };

  const selected = metadataByLocale[locale] || fallback;

  return {
    title: selected.title,
    description: selected.description,
    openGraph: {
      title: selected.title,
      description: selected.description,
      url: `${siteUrl}/${locale}`,
      images: [
        {
          url: `${siteUrl}/brand/hero-felucca.webp`,
          width: 1200,
          height: 630,
          alt: "Luxor & Aswan - Discover Egypt",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: selected.title,
      description: selected.description,
      images: [`${siteUrl}/brand/hero-felucca.webp`],
    },
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: {
        en: `${siteUrl}/en`,
        es: `${siteUrl}/es`,
        fr: `${siteUrl}/fr`,
        de: `${siteUrl}/de`,
        it: `${siteUrl}/it`,
      },
    },
  };
}
