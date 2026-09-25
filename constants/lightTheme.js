const LightTheme = {
  name: "light",

  // خلفية بيضاء نقية مع لمسة زجاجية
  background: "bg-[var(--background)] backdrop-blur-[16px]",

  // النصوص الأساسية
  text: "text-[var(--foreground)]",

  // النصوص الثانوية
  subText: "text-[var(--muted)]",

  // العناوين الرئيسية
  title: "text-[var(--gold)] font-extrabold tracking-wide",

  // العناوين الثانوية
  heading: "text-[var(--gold)] font-semibold",

  // الكروت الزجاجية
  card: "bg-[var(--surface)] backdrop-blur-[12px] rounded-[16px]",

  // طبقة فوق الصور
  overlay: "bg-[var(--overlay)]",

  // الأزرار الأساسية
  buttonPrimary:
    "bg-[var(--gold)] text-[#17130d] font-semibold rounded-xl px-6 py-3 hover:bg-[var(--gold-bright)] transition-all shadow-sm hover:shadow-md tracking-wide uppercase",
  buttonSecondary:
    "bg-transparent text-[var(--foreground)] font-medium rounded-xl px-6 py-3 hover:bg-[var(--surface-soft)] transition-all border border-[var(--line)]",

  // الحدود
  border: "border border-[var(--line)] rounded-[16px]",

  // الظلال
  shadow: "shadow-[var(--shadow)]",

  // شعار
  logoGradientFrom: "var(--surface-strong)",
  logoGradientTo: "var(--gold)",
  logoBorder: "var(--gold)",

  // الحقول
  inputText: "var(--input-text)",
  inputBorder: "var(--line)",
  inputFocus: "var(--gold)",
  inputHoverBg: "var(--surface-soft)",
  inputLabel: "var(--muted)",

  // الأيقونات
  icon: "text-[var(--gold)]",
  iconInactive: "text-[var(--muted)]",
  iconHover: "text-[var(--gold-bright)] transition-colors",

  // ألوان إضافية للهوية
  ivory: "bg-[var(--surface-strong)]",
  gold: "text-[var(--gold)]",
  gray: "text-[var(--muted)]",
};

export default LightTheme;
