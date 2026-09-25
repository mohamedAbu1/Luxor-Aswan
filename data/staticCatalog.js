const text = (en, es = en, fr = en, de = en, it = en, zh = en) => ({ en, es, fr, de, it, zh });

export const staticCities = [
  { id: "luxor", name: text("Luxor", "Luxor", "Louxor", "Luxor", "Luxor", "卢克索"), images: ["/brand/hero-felucca.webp"], description: text("Temples, tombs, and golden river mornings.") },
  { id: "aswan", name: text("Aswan", "Asuán", "Assouan", "Assuan", "Assuan", "阿斯旺"), images: ["/aswan/aswan-nile-landscape.webp"], description: text("A slower river rhythm and Nubian warmth.") },
  { id: "cairo", name: text("Cairo", "El Cairo", "Le Caire", "Kairo", "Il Cairo", "开罗"), images: ["/cairo/cairo-nile-skyline.webp"], description: text("Ancient wonder with a pulse of its own.") },
  { id: "abu-simbel", name: text("Abu Simbel", "Abu Simbel", "Abou Simbel", "Abu Simbel", "Abu Simbel", "阿布辛贝"), images: ["/aswan/aswan-temple-river.webp"], description: text("Monumental temples at the edge of the desert.") },
  { id: "edfu", name: text("Edfu", "Edfu", "Edfou", "Edfu", "Edfu", "埃德富"), images: ["/aswan/aswan-river-experience.webp"], description: text("A beautifully preserved temple and local life.") },
  { id: "kom-ombo", name: text("Kom Ombo", "Kom Ombo", "Kom Ombo", "Kom Ombo", "Kom Ombo", "康翁波"), images: ["/aswan/aswan-river-sunset.webp"], description: text("Two gods, one riverbank, unforgettable light.") },
  { id: "esna", name: text("Esna", "Esna", "Esna", "Esna", "Esna", "埃斯纳"), images: ["/brand/luxor-balloons.webp"], description: text("Quiet markets and the river between destinations.") },
  { id: "dendera", name: text("Dendera", "Dendera", "Dendérah", "Dendera", "Dendera", "丹达拉"), images: ["/cairo/cairo-landmark.webp"], description: text("A temple of stars, color, and ancient ritual.") },
  { id: "hurghada", name: text("Hurghada", "Hurgada", "Hurghada", "Hurghada", "Hurghada", "赫尔格达"), images: ["/homepage/homepage-river-scene.webp"], description: text("Open water, warm coastlines, and easy days.") },
];

export const staticCategories = [
  { id: "private-journeys", name: text("Private Journeys", "Viajes privados", "Voyages privés", "Private Reisen", "Viaggi privati", "私人旅行"), images: ["/brand/hero-felucca.webp"], description: text("A route shaped around your pace.") },
  { id: "nile-cruise", name: text("Nile Cruise", "Crucero por el Nilo", "Croisière sur le Nil", "Nilkreuzfahrt", "Crociera sul Nilo", "尼罗河游船"), images: ["/aswan/aswan-river-experience.webp"], description: text("Let the river set the rhythm.") },
  { id: "ancient-temples", name: text("Ancient Temples", "Templos antiguos", "Temples anciens", "Antike Tempel", "Templi antichi", "古老神庙"), images: ["/aswan/aswan-temple-river.webp"], description: text("Stone, stories, and the people who know them.") },
  { id: "desert-escapes", name: text("Desert Escapes", "Escapadas al desierto", "Escapades dans le désert", "Wüstenausflüge", "Fughe nel deserto", "沙漠之旅"), images: ["/homepage/homepage-desert-scene.webp"], description: text("Open horizons beyond the usual route.") },
  { id: "food-culture", name: text("Food & Culture", "Gastronomía y cultura", "Gastronomie et culture", "Essen & Kultur", "Cibo e cultura", "美食与文化"), images: ["/cairo/cairo-cultural-scene.webp"], description: text("Meet Egypt through flavor and conversation.") },
  { id: "family-adventures", name: text("Family Adventures", "Aventuras familiares", "Aventures en famille", "Familienabenteuer", "Avventure in famiglia", "家庭探险"), images: ["/brand/luxor-balloons.webp"], description: text("Easy, memorable days for every generation.") },
  { id: "luxury-tours", name: text("Luxury Tours", "Tours de lujo", "Circuits de luxe", "Luxusreisen", "Tour di lusso", "豪华旅游"), images: ["/brand/cairo-pyramids.webp"], description: text("More space, more care, beautifully arranged.") },
  { id: "airport-transfers", name: text("Airport Transfers", "Traslados al aeropuerto", "Transferts aéroport", "Flughafentransfers", "Trasferimenti aeroportuali", "机场接送"), images: ["/brand/luxury-transfer-cairo.png"], description: text("Arrive calmly with a trusted local driver.") },
  { id: "tailored-days", name: text("Tailored Days", "Días a medida", "Journées sur mesure", "Individuelle Tage", "Giornate su misura", "定制旅程"), images: ["/aswan/aswan-river-sunset.webp"], description: text("A flexible day built around your interests.") },
];

export default { cities: staticCities, categories: staticCategories };
