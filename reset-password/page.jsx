"use client";

import { useState } from "react";
import { LockKeyhole, ArrowRight } from "lucide-react";
import { toast } from "react-toastify";
import Header from "@/auth/components/header/Header";
import Footer from "@/components/layout/FooterSection";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const submit = async (event) => {
    event.preventDefault();
    if (!isSupabaseConfigured) return toast.info("Password recovery is unavailable until the connection is configured.");
    if (password.length < 8) return toast.error("Use at least 8 characters.");
    if (password !== confirm) return toast.error("Passwords do not match.");
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSaving(false);
    if (error) toast.error(error.message); else toast.success("Your password has been updated.");
  };
  return <main className="reset-password-page"><Header /><section className="reset-password-card"><span className="luxury-eyebrow">Your account</span><h1>Choose a new<br /><em>password.</em></h1><p>Use a secure password you do not reuse elsewhere.</p><form onSubmit={submit}><label><span>New password</span><div><LockKeyhole size={17} /><input type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></div></label><label><span>Confirm password</span><div><LockKeyhole size={17} /><input type="password" autoComplete="new-password" value={confirm} onChange={(event) => setConfirm(event.target.value)} required /></div></label><button type="submit" disabled={saving}>{saving ? "Saving…" : "Update password"}<ArrowRight size={17} /></button></form></section><Footer /></main>;
}
