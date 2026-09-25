export { default } from "../../../../[id]/page";

export async function generateMetadata({ params }) {
  const { locale, id } = await params;
  const title = locale === "ar" ? "تفاصيل الرحلة | الأقصر وأسوان" : locale === "es" ? "Detalles del viaje | Luxor & Aswan" : "Trip details | Luxor & Aswan";
  return { title: `${title} · ${id}`, description: "Explore itinerary, inclusions and booking details for a private Egypt journey." };
}
