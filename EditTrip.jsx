"use client";
import React from "react";
import EditTripBasicInfo from "./EditTripBasicInfo";
import EditTripCoverImageUpload from "./EditTripCoverImageUpload";
import EditTripGalleryUpload from "./EditTripGalleryUpload";
import EditTripClassification from "./EditTripClassification";
import EditTripIncludes from "./EditTripIncludes";
import EditTripDailyItinerary from "./EditTripDailyItinerary";
import EditTripSaveButton from "./EditTripSaveButton";
import TripSelector from "./TripSelector";

export default function EditTripFull({ themeName }) {
  return (
    <div
      className={`p-6 ${
        themeName === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      } rounded-lg`}
    >
      <h2 className="text-2xl font-bold mb-6">✏️ Edit Trip</h2>
      <TripSelector />
      {/* المعلومات الأساسية */}
      <EditTripBasicInfo />

      {/* صورة الغلاف */}
      <EditTripCoverImageUpload />

      {/* معرض الصور */}
      <EditTripGalleryUpload />

      {/* التصنيفات والمدن */}
      <EditTripClassification />

      {/* المتضمنات */}
      <EditTripIncludes />

      {/* الجدول اليومي */}
      <EditTripDailyItinerary />

      {/* زر الحفظ */}
      <EditTripSaveButton />
    </div>
  );
}
