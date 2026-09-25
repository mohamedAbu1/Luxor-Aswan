"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Logo() {
  const pathname = usePathname();
  const segment = pathname.split("/").filter(Boolean)[0];
  const locale = ["en", "ar", "fr", "de", "it", "es", "zh"].includes(segment) ? segment : "en";

  return (
    <Link href={`/${locale}`} className="site-logo group" aria-label="Luxor and Aswan home">
      <span className="site-logo-mark" aria-hidden="true">
        <Image src="/brand/luxor-aswan-logo.png" alt="Luxor & Aswan" width={78} height={78} priority />
      </span>
      <span className="site-logo-copy">
        <span className="site-logo-kicker">Curated Egypt</span>
        <span className="site-logo-name">Luxor <b>&amp;</b> Aswan</span>
        <span className="site-logo-tagline">Private journeys · Since 2018</span>
      </span>
    </Link>
  );
}
