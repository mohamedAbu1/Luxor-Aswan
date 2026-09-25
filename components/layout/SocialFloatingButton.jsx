"use client";
import React, { useState } from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ShareIcon from "@mui/icons-material/Share";
import { motion } from "framer-motion";
import {
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";
import { SiGmail } from "react-icons/si";

const boxVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const SocialFloatingButton = () => {
  const muiTheme = useTheme();
  const [open, setOpen] = useState(false);

  const MideaIcon = [
    {
      titleIcon: "Instagram",
      path: "https://www.instagram.com/luxor__asuan_excursiones",
      Icon: <FaInstagram />,
      gradient: "linear-gradient(45deg, #feda75, #d62976, #962fbf, #4f5bd5)",
    },
    {
      titleIcon: "WhatsApp",
      path: "https://wa.me/message/WNWUM7QNPIIKN1",
      Icon: <FaWhatsapp />,
      color: "#25D366",
    },
    {
      titleIcon: "Gmail",
      path: "mailto:info@luxoryaswanexcursiones.com",
      Icon: <SiGmail />,
      color: "#D14836",
    },
  ];

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: { xs: 88, sm: 20 },
        left: 20,
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 1,
      }}
    >
      {/* ✅ زر رئيسي */}
      <Tooltip title="Social Media">
        <IconButton
          aria-label="Open social media links"
          onClick={() => setOpen(!open)}
          sx={{
            backgroundColor: muiTheme.palette.primary.main,
            color: muiTheme.palette.getContrastText(muiTheme.palette.primary.main),
            "&:hover": {
              backgroundColor: muiTheme.palette.primary.light,
            },
          }}
        >
          <ShareIcon />
        </IconButton>
      </Tooltip>

      {/* ✅ أيقونات السوشيال ميديا تظهر عند الضغط */}
      {open && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {MideaIcon.map((i, index) => (
            <motion.a
              href={i.path}
              target="_blank"
              rel="noopener noreferrer"
              title={i.titleIcon}
              key={index}
              variants={boxVariants}
              initial="hidden"
              animate="visible"
              transition={{
                delay: index * 0.2,
                duration: 0.5,
              }}
              style={{
                background: i.gradient || i.color,
                color: "white",
              }}
              className="SocialMediaIcon p-3 rounded-full shadow-md hover:scale-110 transition"
            >
              {i.Icon}
            </motion.a>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default SocialFloatingButton;
