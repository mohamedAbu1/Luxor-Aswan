"use client";
import { FaWheelchair, FaHandsHelping, FaHeart } from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";
import { motion } from "framer-motion";
import { useState } from "react";
import { Dialog, DialogContent, Button } from "@mui/material";

// الترجمة مضمنة داخل الملف
const translations = {
  en: {
    title: "Inclusive Tourism",
    description:
      "Our trips are designed to support accessibility and equal treatment.",
    accessible: "Accessibility",
    support: "Support",
    care: "Care",
    noticeTitle: "Acceptance and Disclaimer Notice – Inclusive Tourism",
    noticeIntro:
      "The company is committed to providing inclusive tourism services, promoting accessibility, respect, equal treatment, and reasonable assistance for all individuals, including passengers with disabilities or reduced mobility.",
    noticeLimitations:
      "However, the passenger acknowledges and accepts that certain activities, excursions, means of transport, hotels, or external infrastructures may present limitations beyond the company’s direct control.",
    noticeResponsibility:
      "The passenger assumes responsibility for informing in advance any specific need for assistance, medical equipment, personal support, or special requirements.",
    noticeParticipation:
      "Likewise, the passenger agrees to participate in activities under their own responsibility, committing to follow safety instructions and the rules established by the company, carriers, hotels, and tour operators.",
    noticeDisclaimer: "The company shall not be liable for:",
    noticePoint1:
      "Accessibility limitations inherent to third-party providers;",
    noticePoint2: "Delays, cancellations, or modifications beyond its control;",
    noticePoint3:
      "Incidents arising from incomplete or omitted information by the passenger;",
    noticePoint4: "Personal medical situations not previously reported.",
    noticeAcceptance:
      "The contracting and/or use of services implies full acceptance of these conditions.",
    close: "Close",
  },
  es: {
    title: "Turismo Inclusivo",
    description:
      "Nuestros viajes están diseñados para apoyar la accesibilidad y el trato igualitario.",
    accessible: "Accesibilidad",
    support: "Apoyo",
    care: "Cuidado",
    noticeTitle:
      "Aviso de aceptación y deslinde de responsabilidad – Turismo Inclusivo",
    noticeIntro:
      "La empresa se compromete a brindar un servicio de turismo inclusivo, promoviendo la accesibilidad, el respeto, la igualdad de trato y la asistencia razonable para todas las personas.",
    noticeLimitations:
      "No obstante, el pasajero declara conocer y aceptar que determinadas actividades, excursiones, medios de transporte, hoteles o infraestructuras externas pueden presentar limitaciones ajenas al control directo de la empresa.",
    noticeResponsibility:
      "El pasajero asume la responsabilidad de informar con anticipación cualquier necesidad específica de asistencia, equipamiento médico, acompañamiento personal o requerimiento especial.",
    noticeParticipation:
      "Asimismo, el pasajero acepta participar en las actividades bajo su propia responsabilidad, comprometiéndose a seguir las indicaciones de seguridad y las normas establecidas.",
    noticeDisclaimer: "La empresa no será responsable por:",
    noticePoint1:
      "Limitaciones de accesibilidad propias de terceros prestadores;",
    noticePoint2:
      "Demoras, cancelaciones o modificaciones ajenas a su voluntad;",
    noticePoint3:
      "Incidentes derivados de información incompleta u omitida por el pasajero;",
    noticePoint4: "Situaciones médicas personales no informadas previamente.",
    noticeAcceptance:
      "La contratación y/o utilización de los servicios implica la aceptación total de las presentes condiciones.",
    close: "Cerrar",
  },
  fr: {
    title: "Tourisme Inclusif",
    description:
      "Nos voyages sont conçus pour favoriser l’accessibilité et l’égalité de traitement.",
    accessible: "Accessibilité",
    support: "Soutien",
    care: "Soin",
    noticeTitle:
      "Avis d’acceptation et de décharge de responsabilité – Tourisme Inclusif",
    noticeIntro:
      "L’entreprise s’engage à fournir un service de tourisme inclusif...",
    noticeLimitations:
      "Cependant, le passager reconnaît et accepte que certaines activités...",
    noticeResponsibility:
      "Le passager assume la responsabilité d’informer à l’avance...",
    noticeParticipation:
      "De même, le passager accepte de participer aux activités sous sa propre responsabilité...",
    noticeDisclaimer: "L’entreprise ne sera pas responsable de :",
    noticePoint1: "Limitations d’accessibilité propres aux prestataires tiers;",
    noticePoint2:
      "Retards, annulations ou modifications indépendantes de sa volonté;",
    noticePoint3:
      "Incidents résultant d’informations incomplètes ou omises par le passager;",
    noticePoint4:
      "Situations médicales personnelles non signalées préalablement.",
    noticeAcceptance:
      "La réservation et/ou l’utilisation des services implique l’acceptation totale des présentes conditions.",
    close: "Fermer",
  },
  de: {
    title: "Inklusiver Tourismus",
    description:
      "Unsere Reisen sind darauf ausgelegt, Barrierefreiheit und Gleichbehandlung zu fördern.",
    accessible: "Barrierefreiheit",
    support: "Unterstützung",
    care: "Pflege",
    noticeTitle:
      "Hinweis zur Annahme und Haftungsfreistellung – Inklusiver Tourismus",
    noticeIntro:
      "Das Unternehmen verpflichtet sich, einen inklusiven Tourismusdienst anzubieten...",
    noticeLimitations:
      "Der Reisende erkennt jedoch an und akzeptiert, dass bestimmte Aktivitäten...",
    noticeResponsibility:
      "Der Reisende übernimmt die Verantwortung, das Unternehmen im Voraus zu informieren...",
    noticeParticipation:
      "Ebenso erklärt sich der Reisende bereit, an den Aktivitäten auf eigene Verantwortung teilzunehmen...",
    noticeDisclaimer: "Das Unternehmen haftet nicht für:",
    noticePoint1: "Zugangseinschränkungen von Drittanbietern;",
    noticePoint2:
      "Verzögerungen, Stornierungen oder Änderungen außerhalb seines Einflusses;",
    noticePoint3:
      "Vorfälle aufgrund unvollständiger oder ausgelassener Informationen;",
    noticePoint4:
      "Persönliche medizinische Situationen, die nicht im Voraus gemeldet wurden.",
    noticeAcceptance:
      "Die Buchung und/oder Nutzung der Dienstleistungen bedeutet die vollständige Annahme dieser Bedingungen.",
    close: "Schließen",
  },
  it: {
    title: "Turismo Inclusivo",
    description:
      "I nostri viaggi sono progettati per sostenere l’accessibilità e la parità di trattamento.",
    accessible: "Accessibilità",
    support: "Supporto",
    care: "Cura",
    noticeTitle:
      "Avviso di accettazione e liberatoria di responsabilità – Turismo Inclusivo",
    noticeIntro:
      "L’azienda si impegna a fornire un servizio di turismo inclusivo...",
    noticeLimitations:
      "Tuttavia, il passeggero dichiara di essere consapevole e di accettare che determinate attività...",
    noticeResponsibility:
      "Il passeggero si assume la responsabilità di comunicare in anticipo qualsiasi necessità...",
    noticeParticipation:
      "Allo stesso modo, il passeggero accetta di partecipare alle attività sotto la propria responsabilità...",
    noticeDisclaimer: "L’azienda non sarà responsabile per:",
    noticePoint1: "Limitazioni di accessibilità dei fornitori terzi;",
    noticePoint2:
      "Ritardi, cancellazioni o modifiche indipendenti dalla sua volontà;",
    noticePoint3:
      "Incidenti derivanti da informazioni incomplete o omesse dal passeggero;",
    noticePoint4: "Situazioni mediche personali non comunicate in anticipo.",
    noticeAcceptance:
      "La prenotazione e/o l’utilizzo dei servizi implica l’accettazione totale delle presenti condizioni.",
    close: "Chiudi",
  },
  zh: {
    title: "包容性旅游",
    description: "我们的旅行旨在支持无障碍和平等对待。",
    accessible: "无障碍",
    support: "支持",
    care: "关怀",
    noticeTitle: "接受与免责声明通知 – 包容性旅游",
    noticeIntro:
      "公司承诺提供包容性旅游服务，促进无障碍、尊重、平等对待和合理协助。",
    noticeLimitations:
      "然而，乘客声明知晓并接受，某些活动、交通工具、酒店或外部设施可能存在公司无法直接控制的限制。",
    noticeResponsibility:
      "乘客有责任提前告知任何具体的协助需求、医疗设备或特殊要求。",
    noticeParticipation:
      "同时，乘客同意在自身责任下参与活动，并承诺遵守安全指示和相关规定。",
    noticeDisclaimer: "公司不对以下情况负责：",
    noticePoint1: "第三方提供者的无障碍限制;",
    noticePoint2: "超出公司控制的延误、取消或修改;",
    noticePoint3: "由于乘客提供信息不完整或遗漏而导致的事故;",
    noticePoint4: "未提前告知的个人医疗情况。",
    noticeAcceptance: "预订和/或使用服务即表示完全接受本条款。",
    close: "关闭",
  },
};

export default function AccessibilityInfo({ lang = "en" }) {
  const { themeName } = useTheme();
  const isDark = themeName === "dark";
  const [open, setOpen] = useState(false);

  const t = translations[lang] || translations.en;

  return (
    <div
      className={`flex w-[100%] lg:w-[40%] flex-col gap-6 p-8 rounded-2xl shadow-lg transition 
        ${
          isDark
            ? "bg-gradient-to-r from-gray-900 to-gray-800 text-gray-100"
            : "bg-white/90 text-gray-800"
        }`}
    >
      <div className="space-y-2">
        <h3 className="text-xl font-bold tracking-wide">{t.title}</h3>
        <p className="text-sm leading-relaxed opacity-90">{t.description}</p>
      </div>

      <div className="grid grid-rows-3 gap-4">
        {/* الكارت الأول */}
        <div
          onClick={() => setOpen(true)}
          className={`flex flex-col items-center gap-2 p-4 rounded-xl hover:scale-105 transition transform shadow-md cursor-pointer ${
            isDark ? " bg-white/10 dark:bg-black/20" : ""
          }`}
        >
          <motion.div
            animate={{ x: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <FaWheelchair className="text-blue-500 text-4xl" />
          </motion.div>
          <span className="text-xs font-semibold">{t.accessible}</span>
        </div>

        {/* الكارت الثاني */}
        <div
          className={`flex flex-col items-center gap-2 p-4 rounded-xl hover:scale-105 transition transform shadow-md ${
            isDark ? " bg-white/10 dark:bg-black/20" : ""
          }`}
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <FaHandsHelping className="text-green-500 text-4xl" />
          </motion.div>
          <span className="text-xs font-semibold">{t.support}</span>
        </div>

        {/* الكارت الثالث */}
        <div
          className={`flex flex-col items-center gap-2 p-4 rounded-xl hover:scale-105 transition transform shadow-md ${
            isDark ? " bg-white/10 dark:bg-black/20" : ""
          }`}
        >
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            <FaHeart className="text-red-500 text-4xl" />
          </motion.div>
          <span className="text-xs font-semibold">{t.care}</span>
        </div>
      </div>

      {/* الـ Modal */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            background:
              themeName === "dark"
                ? "rgba(20,20,20,0.85)"
                : "linear-gradient(135deg, #ffffff, #fdf6e3)",
            backdropFilter: "blur(12px)",
            borderRadius: "24px",
            border: "1px solid rgba(201,163,74,0.3)",
            boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
            overflow: "hidden",
            color: themeName === "dark" ? "#fdf6e3" : "#333",
          }}
        >
          <DialogContent
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              padding: "32px",
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            <h2
              style={{
                fontFamily: "Cinzel, serif",
                fontSize: "28px",
                fontWeight: "700",
                textAlign: "center",
                marginBottom: "16px",
                background: "linear-gradient(to right, #c9a34a, #b9972f)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {t.noticeTitle}
            </h2>

            <p>{t.noticeIntro}</p>
            <p>{t.noticeLimitations}</p>
            <p>{t.noticeResponsibility}</p>
            <p>{t.noticeParticipation}</p>
            <p>{t.noticeDisclaimer}</p>
            <ul style={{ paddingLeft: "20px" }}>
              <li>{t.noticePoint1}</li>
              <li>{t.noticePoint2}</li>
              <li>{t.noticePoint3}</li>
              <li>{t.noticePoint4}</li>
            </ul>
            <p>{t.noticeAcceptance}</p>

            <Button
              variant="contained"
              onClick={() => setOpen(false)}
              style={{
                marginTop: "20px",
                background: "linear-gradient(to right, #FF9800, #FF9800)",
                color: "#fff",
                fontWeight: "700",
                padding: "12px",
                borderRadius: "14px",
              }}
            >
              {t.close}
            </Button>
          </DialogContent>
        </motion.div>
      </Dialog>
    </div>
  );
}
