"use client";

import { useRef } from "react";
import { ImagePlus, Send } from "lucide-react";

export default function ChatInput({ text, setText, handleSend, handleSendImage, user }) {
  const inputRef = useRef(null);
  const handleChange = (event) => { setText(event.target.value); fetch("/api/typing", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: user?.id, isTyping: Boolean(event.target.value) }) }).catch(() => {}); };
  return <form className="chat-composer" onSubmit={(event) => { event.preventDefault(); handleSend(); }}><button type="button" className="chat-attach-button" onClick={() => inputRef.current?.click()} aria-label="Attach an image"><ImagePlus size={18} /><input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => { handleSendImage(event.target.files?.[0]); event.target.value = ""; }} hidden /></button><input value={text} onChange={handleChange} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); handleSend(); } }} placeholder="Write a message…" aria-label="Message" /><button type="submit" className="chat-send-button" disabled={!text.trim()} aria-label="Send message"><Send size={17} /></button></form>;
}
