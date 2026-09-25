"use client";
import ThemeToggle from "../../ThemeToggle";
import CurrencySelector from "@/components/layout/CurrencySelector";

export default function RightBar({ scrolled }) {
  return (
    <div className="site-header-tools">
      <ThemeToggle scrolled={scrolled} />
      <CurrencySelector />
    </div>
  );
}
