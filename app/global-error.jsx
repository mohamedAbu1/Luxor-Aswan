"use client";

import { useEffect } from "react";

export default function GlobalError({ reset }) {
  useEffect(() => { document.documentElement.dataset.theme = "dark"; }, []);
  return <html lang="en"><body><main className="loading-page"><div className="loading-page-mark">𓂀</div><span className="luxury-eyebrow">Luxor &amp; Aswan</span><h1>The journey paused<span>.</span></h1><p>We are refreshing the experience. Please try once more.</p><button type="button" onClick={() => reset?.()} className="luxury-button luxury-button-primary">Try again</button></main></body></html>;
}
