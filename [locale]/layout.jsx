import "../src/style/globals.css";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return ["en", "es", "de", "fr", "it", "zh"].map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;

  // لو اللغة مش مدعومة → notFound
  const supportedLocales = ["en", "es", "de", "fr", "it", "zh"];
  if (!supportedLocales.includes(locale)) {
    notFound();
  }

  return <main lang={locale}>{children}</main>;
}
