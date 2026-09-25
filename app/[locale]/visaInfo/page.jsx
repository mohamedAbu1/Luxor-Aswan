export { default } from "../../../visaInfo/page";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const title = locale === "ar" ? "معلومات التأشيرة | الأقصر وأسوان" : locale === "es" ? "Información de visado | Luxor & Aswan" : "Visa information | Luxor & Aswan";
  return { title, description: "Practical visa information for planning your Egypt journey." };
}
