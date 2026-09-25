"use client";
import { FaPlaneArrival, FaPlaneDeparture } from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";
import { useState } from "react";

export default function TripSchedule({
  arrivalDate,
  setArrivalDate,
  departureDate,
  setDepartureDate,
}) {
  const { themeName } = useTheme();
  const [alreadyInEgypt, setAlreadyInEgypt] = useState(false);

  const today = new Date();
  const minArrival = new Date(today);
  minArrival.setDate(today.getDate() + 2);

  const minDeparture = arrivalDate ? new Date(arrivalDate) : minArrival;
  minDeparture.setDate(minDeparture.getDate() + 2);

  return (
    <div className="mb-6 border-b border-gray-300/30 pb-4">
      <h3
        className={`text-base sm:text-lg font-semibold mb-3 ${
          themeName === "dark" ? "text-[#c9a34a]" : "text-[#11111194]"
        }`}
      >
        Trip Schedule
      </h3>

      {/* ✅ Checkbox */}
      <div className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          checked={alreadyInEgypt}
          onChange={(e) => setAlreadyInEgypt(e.target.checked)}
          className="w-4 h-4 accent-[#c9a34a]"
        />
        <label className="font-medium text-sm sm:text-base">
          I am already in Egypt
        </label>
      </div>

      {/* ✅ Responsive layout */}
      {!alreadyInEgypt && (
        <div className="flex flex-col sm:flex-row gap-5">
          {/* موعد الوصول */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-3 w-full sm:w-1/2">
            <FaPlaneArrival
              className={`${
                themeName === "dark" ? "text-yellow-300" : "text-[#c9a34a]"
              }`}
            />
            <label className="block font-medium text-sm sm:text-base">
              Arrival Date
            </label>
            <input
              type="date"
              value={arrivalDate}
              onChange={(e) => setArrivalDate(e.target.value)}
              min={minArrival.toISOString().split("T")[0]}
              className="ml-0 sm:ml-2 p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* موعد المغادرة */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-1/2">
            <FaPlaneDeparture
              className={`${
                themeName === "dark" ? "text-yellow-300" : "text-[#c9a34a]"
              }`}
            />
            <label className="block font-medium text-sm sm:text-base">
              Departure Date
            </label>
            <input
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              min={minDeparture.toISOString().split("T")[0]}
              className="ml-0 sm:ml-2 p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}
    </div>
  );
}
