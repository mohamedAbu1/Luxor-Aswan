"use client";
import React from "react";
import { usePurchase } from "@/context/PurchaseContext";
import LuxurySelect from "@/components/ui/LuxurySelect";

export default function CurrencySelector() {
  const { currency, setCurrency } = usePurchase();

  return <label className="site-currency"><span className="sr-only">Currency</span><LuxurySelect className="site-currency-select" value={currency} onValueChange={setCurrency} ariaLabel="Currency" options={[{ value: "USD", label: "USD $" }, { value: "EUR", label: "EUR €" }]} /></label>;
}
