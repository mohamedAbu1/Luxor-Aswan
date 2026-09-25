"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { BarChart3, CalendarDays, ChevronRight, LayoutDashboard, LogOut, Menu, MessageCircle, RefreshCw, Search, Send, Settings2, ShieldCheck, Tags, UsersRound, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

const navItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "messages", label: "Messages", icon: MessageCircle },
  { id: "trips", label: "Trips", icon: Tags },
  { id: "bookings", label: "Bookings", icon: CalendarDays },
  { id: "users", label: "Users", icon: UsersRound },
];

function displayName(user) { return user?.user_metadata?.name || user?.user_metadata?.full_name || user?.email || "Guest"; }
async function getJson(url) { const response = await fetch(url, { credentials: "include", cache: "no-store" }); const data = await response.json().catch(() => ({})); if (!response.ok) throw new Error(data.error || "Request failed"); return data; }

export default function ProfessionalDashboard() {
  const { user, logout } = useAuth();
  const { themeName } = useTheme();
  const [section, setSection] = useState("overview");
  const [mobileNav, setMobileNav] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState({ messages: [], trips: [], bookings: [], users: [] });
  const [selectedUserId, setSelectedUserId] = useState("");
  const [messageSearch, setMessageSearch] = useState("");
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const isAdmin = user?.user_metadata?.role?.toLowerCase() === "admin";

  const loadDashboard = useCallback(async (quiet = false) => {
    if (!isAdmin) return;
    if (quiet) setRefreshing(true); else setLoading(true);
    setError("");
    const requests = await Promise.allSettled([getJson("/api/messages?limit=100"), getJson("/api/trips"), getJson("/api/purchases"), getJson("/api/users")]);
    const [messages, trips, bookings, users] = requests.map((result) => result.status === "fulfilled" ? result.value : null);
    if (requests.some((result) => result.status === "rejected")) setError("Some live data is unavailable. Check your connection or Supabase configuration.");
    setData({ messages: messages?.messages || [], trips: trips?.trips || [], bookings: Array.isArray(bookings) ? bookings : bookings?.purchases || [], users: Array.isArray(users) ? users : users?.users || [] });
    setLoading(false); setRefreshing(false);
  }, [isAdmin]);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);
  useEffect(() => { if (!isAdmin) return undefined; const timer = setInterval(() => loadDashboard(true), 20000); return () => clearInterval(timer); }, [isAdmin, loadDashboard]);

  const conversations = useMemo(() => {
    const map = new Map();
    data.messages.forEach((message) => {
      const current = map.get(message.user_id) || { userId: message.user_id, name: message.sender_type === "user" ? message.user_name : "Customer", image: message.user_image, messages: [], unread: 0 };
      current.messages.push(message);
      if (message.status !== "seen" && message.sender_type === "user") current.unread += 1;
      if (message.sender_type === "user" && message.user_name) current.name = message.user_name;
      map.set(message.user_id, current);
    });
    return [...map.values()].sort((a, b) => new Date(b.messages.at(-1)?.created_at || 0) - new Date(a.messages.at(-1)?.created_at || 0));
  }, [data.messages]);
  const filteredConversations = conversations.filter((item) => `${item.name} ${item.userId}`.toLowerCase().includes(messageSearch.toLowerCase()));
  const activeConversation = conversations.find((item) => item.userId === selectedUserId) || filteredConversations[0];
  const stats = [{ label: "Total trips", value: data.trips.length, icon: Tags }, { label: "Bookings", value: data.bookings.length, icon: CalendarDays }, { label: "Customers", value: data.users.length, icon: UsersRound }, { label: "Open conversations", value: conversations.length, icon: MessageCircle }];

  const sendReply = async (event) => {
    event.preventDefault(); if (!reply.trim() || !activeConversation?.userId) return; setSending(true);
    try { await fetch("/api/messages", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ user_id: activeConversation.userId, content: reply.trim(), sender_type: "admin", admin_id: user.id, status: "sent" }) }); setReply(""); await loadDashboard(true); } catch { setError("Unable to send this reply."); } finally { setSending(false); }
  };

  if (!isAdmin) return <main className="dashboard-access-denied"><ShieldCheck size={42} /><h1>Admin access required</h1><p>This workspace is available only to authorized team members.</p><button type="button" onClick={() => window.location.assign("/en")}>Return to website</button></main>;

  return <main className={`professional-dashboard ${themeName === "light" ? "is-light" : ""}`}>
    {mobileNav && <button type="button" className="dashboard-mobile-backdrop" aria-label="Close navigation" onClick={() => setMobileNav(false)} />}
    <aside className={`dashboard-sidebar ${mobileNav ? "is-open" : ""}`}><div className="dashboard-brand"><span className="dashboard-brand-mark">𓂀</span><div><strong>Luxor & Aswan</strong><small>Operations studio</small></div><button type="button" className="dashboard-close-mobile" onClick={() => setMobileNav(false)} aria-label="Close menu"><X size={18} /></button></div><div className="dashboard-workspace"><span>Workspace</span><strong><i /> Live operations</strong></div><nav className="dashboard-nav" aria-label="Dashboard navigation">{navItems.map(({ id, label, icon: Icon }) => <button type="button" key={id} className={section === id ? "is-active" : ""} onClick={() => { setSection(id); setMobileNav(false); }}><Icon size={18} /><span>{label}</span>{id === "messages" && conversations.some((item) => item.unread > 0) && <b>{conversations.reduce((total, item) => total + item.unread, 0)}</b>}</button>)}</nav><div className="dashboard-sidebar-bottom"><button type="button"><Settings2 size={17} /> Settings</button><button type="button" onClick={logout}><LogOut size={17} /> Sign out</button><div className="dashboard-user"><span>{displayName(user).slice(0, 1).toUpperCase()}</span><div><strong>{displayName(user)}</strong><small>Administrator</small></div></div></div></aside>
    <section className="dashboard-main"><header className="dashboard-topbar"><button type="button" className="dashboard-menu-button" onClick={() => setMobileNav(true)} aria-label="Open navigation"><Menu size={21} /></button><div><span className="dashboard-kicker">Private journeys · Southern Egypt</span><h1>{section === "overview" ? "Good morning, team." : navItems.find((item) => item.id === section)?.label}</h1></div><div className="dashboard-top-actions"><button type="button" onClick={() => loadDashboard(true)} aria-label="Refresh data"><RefreshCw size={17} className={refreshing ? "is-spinning" : ""} /></button><div className="dashboard-top-avatar">{displayName(user).slice(0, 1).toUpperCase()}</div></div></header>{error && <div className="dashboard-alert" role="status">{error}</div>}
      {section === "overview" && <><div className="dashboard-welcome"><div><span className="dashboard-kicker">Operations overview</span><h2>Everything important,<br /><em>in one calm view.</em></h2><p>Monitor conversations, bookings and your growing collection from one responsive workspace.</p></div><div className="dashboard-welcome-art"><BarChart3 size={80} strokeWidth={1} /></div></div><div className="dashboard-stat-grid">{stats.map(({ label, value, icon: Icon }) => <article className="dashboard-stat-card" key={label}><span className="dashboard-stat-icon"><Icon size={18} /></span><small>{label}</small><strong>{loading ? "—" : value}</strong><span>Live data</span></article>)}</div><div className="dashboard-overview-grid"><section className="dashboard-panel"><div className="dashboard-panel-heading"><div><span className="dashboard-kicker">Latest signal</span><h2>Recent conversations</h2></div><button type="button" onClick={() => setSection("messages")}>View inbox <ChevronRight size={15} /></button></div>{conversations.slice(0, 4).map((conversation) => <button type="button" className="dashboard-activity-row" key={conversation.userId} onClick={() => { setSelectedUserId(conversation.userId); setSection("messages"); }}><span className="dashboard-conversation-avatar">{conversation.name.slice(0, 1).toUpperCase()}</span><span><strong>{conversation.name}</strong><small>{conversation.messages.at(-1)?.content || "New conversation"}</small></span><time>{conversation.messages.at(-1)?.created_at ? new Date(conversation.messages.at(-1).created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}</time></button>)}{!conversations.length && <div className="dashboard-empty">No conversations yet.</div>}</section><section className="dashboard-panel dashboard-quick"><div className="dashboard-panel-heading"><div><span className="dashboard-kicker">Quick actions</span><h2>Keep moving</h2></div></div><button type="button" onClick={() => setSection("messages")}><MessageCircle size={18} /><span><strong>Open inbox</strong><small>Reply to traveler messages</small></span><ChevronRight size={16} /></button><button type="button" onClick={() => setSection("trips")}><Tags size={18} /><span><strong>Manage journeys</strong><small>Review your trip collection</small></span><ChevronRight size={16} /></button><button type="button" onClick={() => setSection("bookings")}><CalendarDays size={18} /><span><strong>Review bookings</strong><small>Keep requests moving</small></span><ChevronRight size={16} /></button></section></div></>}
      {section === "messages" && <MessagesWorkspace conversations={filteredConversations} activeConversation={activeConversation} search={messageSearch} setSearch={setMessageSearch} setSelectedUserId={setSelectedUserId} reply={reply} setReply={setReply} sendReply={sendReply} sending={sending} />}
      {section === "trips" && <DataTable title="Trip collection" subtitle="Your published journeys" rows={data.trips} columns={["title", "price", "duration"]} empty="No trips available." />}
      {section === "bookings" && <DataTable title="Bookings" subtitle="Recent customer requests" rows={data.bookings} columns={["trip_title", "status", "created_at"]} empty="No bookings available." />}
      {section === "users" && <DataTable title="Customers" subtitle="Registered travelers" rows={data.users} columns={["name", "email", "created_at"]} empty="No customers available." />}
    </section>
  </main>;
}

function MessagesWorkspace({ conversations, activeConversation, search, setSearch, setSelectedUserId, reply, setReply, sendReply, sending }) { return <div className="dashboard-messages-workspace"><section className="dashboard-inbox-list"><div className="dashboard-section-heading"><div><span className="dashboard-kicker">Customer care</span><h2>Inbox</h2></div><span>{conversations.length} threads</span></div><label className="dashboard-search"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search conversations" /></label><div className="dashboard-conversation-list">{conversations.map((conversation) => <button type="button" key={conversation.userId} className={`dashboard-conversation-item ${activeConversation?.userId === conversation.userId ? "is-active" : ""}`} onClick={() => setSelectedUserId(conversation.userId)}><span className="dashboard-conversation-avatar">{conversation.name.slice(0, 1).toUpperCase()}</span><span><strong>{conversation.name}</strong><small>{conversation.messages.at(-1)?.content || "New conversation"}</small></span><time>{conversation.unread > 0 ? <b>{conversation.unread}</b> : ""}</time></button>)}{!conversations.length && <div className="dashboard-empty">No matching conversations.</div>}</div></section><section className="dashboard-chat-panel">{activeConversation ? <><div className="dashboard-chat-heading"><div className="dashboard-conversation-avatar">{activeConversation.name.slice(0, 1).toUpperCase()}</div><div><strong>{activeConversation.name}</strong><small>Traveler · {activeConversation.userId}</small></div><span className="dashboard-online"><i /> Active thread</span></div><div className="dashboard-chat-messages">{activeConversation.messages.map((message) => <div className={`dashboard-chat-bubble ${message.sender_type === "admin" ? "is-admin" : ""}`} key={message.id}><p>{message.content}</p><time>{message.created_at ? new Date(message.created_at).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) : "Just now"}</time></div>)}</div><form className="dashboard-reply-form" onSubmit={sendReply}><input value={reply} onChange={(event) => setReply(event.target.value)} placeholder="Write a thoughtful reply…" aria-label="Reply message" /><button type="submit" disabled={sending || !reply.trim()}><Send size={17} />{sending ? "Sending" : "Send"}</button></form></> : <div className="dashboard-empty dashboard-chat-empty"><MessageCircle size={34} /><h3>Select a conversation</h3><p>Choose a thread to reply to your travelers.</p></div>}</section></div>; }

function DataTable({ title, subtitle, rows, columns, empty }) { return <section className="dashboard-data-section"><div className="dashboard-section-heading"><div><span className="dashboard-kicker">Operations</span><h2>{title}</h2><p>{subtitle}</p></div><span className="dashboard-table-count">{rows.length} records</span></div>{rows.length ? <div className="dashboard-table-wrap"><table><thead><tr>{columns.map((column) => <th key={column}>{column.replace("_", " ")}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={row.id || index}>{columns.map((column) => <td key={column}>{column === "created_at" && row[column] ? new Date(row[column]).toLocaleDateString() : typeof row[column] === "object" ? row[column]?.en || row[column]?.name || "—" : row[column] || "—"}</td>)}</tr>)}</tbody></table></div> : <div className="dashboard-empty">{empty}</div>}</section>; }
