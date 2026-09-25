export { default } from "../../../trips/page";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const copy = {
    en: ["Trips | Luxor & Aswan", "Browse private journeys across Luxor, Aswan and the Nile."],
    es: ["Viajes | Luxor & Aswan", "Explora viajes privados por Luxor, Asuán y el Nilo."],
    ar: ["الرحلات | الأقصر وأسوان", "اكتشف رحلات خاصة في الأقصر وأسوان وعلى نهر النيل."],
  }[locale] || ["Trips | Luxor & Aswan", "Browse private journeys across Luxor, Aswan and the Nile."];
  return { title: copy[0], description: copy[1] };
}
