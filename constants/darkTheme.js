const DarkTheme = {
  name: "dark",

  // خلفية داكنة أنيقة مع لمسة زجاجية
  background: "bg-[var(--background)] backdrop-blur-[18px]",

  // النصوص الأساسية
  text: "text-[var(--foreground)]",

  // النصوص الثانوية
  subText: "text-[var(--muted)]",

  // العناوين الرئيسية
  title: "text-[var(--gold)] font-extrabold tracking-wide",

  // العناوين الثانوية
  heading: "text-[var(--gold-bright)] font-semibold",

  // الكروت الزجاجية الداكنة
  card: "bg-[var(--surface)] backdrop-blur-[14px] rounded-[18px]",

  // شعار
  logoGradientFrom: "var(--surface-strong)",
  logoGradientTo: "var(--gold-bright)",
  logoBorder: "var(--gold)",

  // طبقة فوق الصور
  overlay: "bg-[var(--overlay)]",

  // الحدود
  border: "border border-[var(--line)] rounded-[18px]",

  // الظلال
  shadow: "shadow-[var(--shadow)]",
  inputBorder: "var(--line)",

  // الأزرار الأساسية
  buttonPrimary:
    "bg-[var(--gold)] text-[#17130d] font-semibold rounded-xl px-6 py-3 hover:bg-[var(--gold-bright)] transition-all shadow-md hover:shadow-lg",

  // الأزرار الثانوية
  buttonSecondary:
    "bg-transparent text-[var(--foreground)] font-medium rounded-xl px-6 py-3 hover:bg-[var(--surface-soft)] transition-all border border-[var(--line)]",

  // الأيقونات
  icon: "text-[var(--gold)]",
  iconInactive: "text-[var(--muted)]",
  iconHover: "text-[var(--gold-bright)] transition-colors",

  // ألوان إضافية للهوية
  night: "bg-[var(--background)]",
  desertGold: "text-[var(--gold-bright)]",
  sandIvory: "text-[var(--foreground)]",
  deepBrown: "text-[var(--foreground)]",
  crimsonAccent: "text-[var(--teal)]",
};

export default DarkTheme;
