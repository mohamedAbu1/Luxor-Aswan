export { default } from "../../../contact/page";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const copy = {
    en: ["Contact | Luxor & Aswan", "Speak with our local team to plan a thoughtful journey through Egypt."],
    es: ["Contacto | Luxor & Aswan", "Habla con nuestro equipo local para planificar tu viaje por Egipto."],
    ar: ["تواصل معنا | الأقصر وأسوان", "تواصل مع فريقنا المحلي لتخطيط رحلتك في مصر."],
  }[locale] || ["Contact | Luxor & Aswan", "Speak with our local team to plan a thoughtful journey through Egypt."];
  return { title: copy[0], description: copy[1] };
}
