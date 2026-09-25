// src/app/[locale]/about/page.tsx أو layout.tsx

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const siteUrl = "https://www.luxoryaswanexcursiones.com";

  const metadataByLocale = {
    en: {
      title: "About Luxor & Aswan | Discover Egypt’s Soul",
      description:
        "Learn about Luxor & Aswan’s mission to bring Egypt’s wonders to life through thoughtful, local journeys.",
    },
    es: {
      title: "Sobre Luxor & Aswan | Descubre el alma de Egipto",
      description:
        "Conoce la misión de Luxor & Aswan para mostrar las maravillas de Egipto.",
    },
    de: {
      title: "Über Luxor & Aswan | Entdecke die Seele Ägyptens",
      description:
        "Erfahre mehr über die Mission von Luxor & Aswan und unsere lokalen Werte.",
    },
    fr: {
      title: "À propos de Luxor & Aswan | Découvrez l'âme de l'Égypte",
      description:
        "Découvrez la mission de Luxor & Aswan pour révéler les merveilles de l'Égypte.",
    },
    it: {
      title: "Chi siamo | Scopri l'anima dell'Egitto con Luxor & Aswan",
      description:
        "Scopri la missione di Luxor & Aswan: portare alla luce le meraviglie dell'Egitto.",
    },
  };

  const fallback = {
    title: "About Luxor & Aswan",
    description: "Discover Egypt with Luxor & Aswan.",
  };

  const selected = metadataByLocale[locale] || fallback;

  return {
    title: selected.title,
    description: selected.description,
    openGraph: {
      title: selected.title,
      description: selected.description,
      url: `${siteUrl}/${locale}/about`,
      images: [
        {
          url: `${siteUrl}/brand/hero-felucca.webp`,
          width: 1200,
          height: 630,
          alt: "Felucca sailing on the Nile",
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
      canonical: `${siteUrl}/${locale}/about`,
      languages: {
        en: `${siteUrl}/en/about`,
        es: `${siteUrl}/es/about`,
        de: `${siteUrl}/de/about`,
        fr: `${siteUrl}/fr/about`,
        it: `${siteUrl}/it/about`,
      },
    },
  };
}
