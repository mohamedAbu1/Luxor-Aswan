"use client";
import React from "react";
import { FaTachometerAlt } from "react-icons/fa"; 
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

export default function AdminDashboardButton() {
  const { user } = useAuth();
  const router = useRouter();

  const isAdmin = user?.user_metadata?.role?.toLowerCase() === "admin";

  const goToDashboard = () => {
    router.push("/admin");
  };

  if (!isAdmin) return null;

  return (
    <motion.button
      style={{ cursor: "pointer", zIndex:"999" }}
      onClick={goToDashboard}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 px-6 py-3 rounded-lg shadow-lg flex lg:hidden items-center gap-3 
                 bg-gradient-to-r from-pink-400 to-pink-600 
                 text-white font-bold tracking-wide hover:shadow-xl transition-all duration-300"
    >
      <FaTachometerAlt size={22} />
      <span>Dashboard</span>
    </motion.button>
  );
}
