"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Headphones, MessageCircle, Sparkles, X } from "lucide-react";
import { useMessages } from "@/context/MessageContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import ChatMessages from "./components/ChatMessages";
import ChatInput from "./components/ChatInput";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [adminTyping, setAdminTyping] = useState(false);
  const [bookingMode, setBookingMode] = useState(false);
  const [booking, setBooking] = useState({ from: "", to: "" });
  const { messages, sendMessage, fetchMessages, markMessageSeen } = useMessages();
  const { user } = useAuth();
  const isAdmin = user?.user_metadata?.role?.toLowerCase() === "admin";
  const unread = useMemo(() => messages.filter((message) => message.sender_type === "admin" && message.status !== "seen").length, [messages]);

  useEffect(() => { if (user?.id) fetchMessages(user.id); }, [user?.id]);
  useEffect(() => {
    if (!open || !user?.id) return undefined;
    messages.filter((message) => message.sender_type === "admin" && message.status !== "seen").forEach((message) => markMessageSeen(message.id));
  }, [open, user?.id, messages, markMessageSeen]);
  useEffect(() => {
    if (!user?.id) return undefined;
    const interval = setInterval(async () => { const response = await fetch(`/api/typing?userId=${user.id}`); const data = await response.json().catch(() => ({})); setAdminTyping(Boolean(data.adminTyping)); }, 3000);
    return () => clearInterval(interval);
  }, [user?.id]);
  useEffect(() => {
    const handler = () => { setOpen(true); setBookingMode(true); };
    window.addEventListener("openCarBookingChat", handler);
    return () => window.removeEventListener("openCarBookingChat", handler);
  }, []);

  const handleSend = async () => {
    if (!text.trim() || !user?.id) return;
    await sendMessage({ user_id: user.id, content: text.trim(), sender_type: "user", status: "sent" });
    setText("");
  };
  const sendBooking = async () => {
    if (!booking.from.trim() || !booking.to.trim()) return;
    await sendMessage({ user_id: user.id, content: `Car booking request: from ${booking.from} to ${booking.to}`, sender_type: "user", status: "sent" });
    setBooking({ from: "", to: "" }); setBookingMode(false);
  };
  const handleImage = async (file) => {
    if (!file || !user?.id) return;
    const fileName = `${user.id}-${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const { error } = await supabase.storage.from("chat-images").upload(fileName, file);
    if (error) return;
    const { data } = supabase.storage.from("chat-images").getPublicUrl(fileName);
    await sendMessage({ user_id: user.id, content: data.publicUrl, sender_type: "user", status: "sent" });
  };

  if (!user || isAdmin) return null;
  return <>
    <motion.button type="button" className={`chat-launcher ${open ? "is-open" : ""}`} onClick={() => setOpen((value) => !value)} whileTap={{ scale: .94 }} aria-label={open ? "Close support chat" : "Open support chat"} aria-expanded={open}><span className="chat-launcher-icon">{open ? <X size={21} /> : <MessageCircle size={21} />}</span><span className="chat-launcher-label">{open ? "Close" : "Chat with us"}</span>{unread > 0 && <b>{unread}</b>}</motion.button>
    <AnimatePresence>{open && <motion.section className="chat-shell" initial={{ opacity: 0, y: 20, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: .97 }} transition={{ duration: .2 }} role="dialog" aria-label="Luxor and Aswan support chat"><header className="chat-shell-header"><div className="chat-agent-avatar"><Sparkles size={17} /></div><div><strong>Journey concierge</strong><span><i /> Usually replies in a few minutes</span></div><button type="button" onClick={() => setOpen(false)} aria-label="Close chat"><X size={18} /></button></header><div className="chat-shell-intro"><span className="chat-intro-kicker"><Headphones size={13} /> Private support</span><h2>How can we make<br /><em>Egypt feel yours?</em></h2><p>Ask us anything about trips, transfers, or planning your time on the Nile.</p><div className="chat-quick-actions"><button type="button" onClick={() => setText("I would like help choosing a trip.")}>Choose a trip</button><button type="button" onClick={() => setBookingMode(true)}>Book a car</button></div></div><ChatMessages messages={messages} adminTyping={adminTyping} /><div className="chat-composer-area">{bookingMode ? <div className="chat-booking-form"><div><strong>Arrange your transfer</strong><button type="button" onClick={() => setBookingMode(false)} aria-label="Close transfer form"><X size={15} /></button></div><input value={booking.from} onChange={(event) => setBooking({ ...booking, from: event.target.value })} placeholder="Pickup location" /><input value={booking.to} onChange={(event) => setBooking({ ...booking, to: event.target.value })} placeholder="Destination" /><button type="button" onClick={sendBooking} disabled={!booking.from.trim() || !booking.to.trim()}>Send transfer request</button></div> : <ChatInput text={text} setText={setText} handleSend={handleSend} handleSendImage={handleImage} user={user} />}</div></motion.section>}</AnimatePresence>
  </>;
}
