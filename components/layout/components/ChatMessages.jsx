"use client";

import { useEffect, useRef } from "react";
import { Check, CheckCheck, Clock3, Download, ExternalLink, MessageCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

function isImage(content) { return typeof content === "string" && /^https?:\/\/.+\.(jpeg|jpg|gif|png|webp)(\?.*)?$/i.test(content); }

export default function ChatMessages({ messages = [], adminTyping }) {
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages.length, adminTyping]);
  return <div className="chat-messages" aria-live="polite">{messages.length ? messages.map((message) => { const fromAdmin = message.sender_type === "admin"; return <div className={`chat-message-row ${fromAdmin ? "is-admin" : "is-user"}`} key={message.id}><div className="chat-message-bubble">{isImage(message.content) ? <div className="chat-image-message"><img src={message.content} alt="Shared attachment" /><div><a href={message.content} target="_blank" rel="noreferrer"><ExternalLink size={13} /> View</a><a href={message.content} download><Download size={13} /> Save</a></div></div> : <p>{message.content}</p>}<footer><span>{message.created_at ? formatDistanceToNow(new Date(message.created_at), { addSuffix: true }) : "Just now"}</span>{!fromAdmin && (message.status === "seen" ? <CheckCheck size={13} /> : <Check size={13} />)}</footer></div></div>; }) : <div className="chat-empty-state"><span><MessageCircle size={22} /></span><strong>Start a conversation</strong><p>Our local team is here to help you plan the right day.</p></div>}{adminTyping && <div className="chat-typing"><i /><i /><i /> Concierge is typing</div>}<div ref={endRef} /></div>;
}
