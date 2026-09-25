"use client";
import React, { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import Sidebar from "./Sidebar";
import DashboardHome from "./DashboardHome";
import AddTrip from "./AddTrip";
import TripsList from "./TripsList";
import BookingsList from "./BookingsList";
import Reports from "./Reports";
import EditTrip from "./EditTrip"; // ✅ استدعاء مكون التعديل
import EgyptianBackground from "@/components/layout/EgyptianBackground";
import UsersSection from "./UsersSection";

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const { theme, themeName } = useTheme();
  return (
    <main className={`relative flex min-h-screen ${theme.background} ${theme.text} overflow-hidden`}>
      <EgyptianBackground />

      <Sidebar setActiveSection={setActiveSection} activeSection={activeSection} themeName={themeName} />

      <section
        className={`flex-1 p-10 relative z-10 ${
          themeName === "dark" ? "bg-black" : "bg-white"
        } rounded-tl-3xl`}
      >
        {activeSection === "dashboard" && <DashboardHome themeName={themeName} />}
        {activeSection === "addTrip" && <AddTrip themeName={themeName} />}
        {activeSection === "trips" && <TripsList themeName={themeName} />}
        {activeSection === "editTrip" && <EditTrip themeName={themeName} />}
        {activeSection === "users" && <UsersSection themeName={themeName} />}
        {activeSection === "bookings" && <BookingsList themeName={themeName} />}
        {activeSection === "reports" && <Reports themeName={themeName} />}
      </section>
    </main>
  );
}
