"use client";
import React from "react";
import { usePurchase } from "@/context/PurchaseContext";

export default function CurrencySelector() {
  const { currency, setCurrency } = usePurchase();

  return <label className="site-currency"><span className="sr-only">Currency</span><select className="site-currency-select" value={currency} onChange={(e) => setCurrency(e.target.value)} aria-label="Currency"><option value="USD">USD $</option><option value="EUR">EUR €</option></select></label>;
}
