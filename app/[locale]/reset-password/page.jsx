export { default } from "../../../reset-password/page";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return { title: locale === "ar" ? "تغيير كلمة المرور | الأقصر وأسوان" : "Reset password | Luxor & Aswan" };
}
