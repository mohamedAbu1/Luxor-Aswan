"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent } from "@mui/material";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck, X } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useData } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { useSecurity } from "@/context/SecurityContext";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabaseClient";
import { isSupabaseConfigured } from "@/lib/supabaseClient";

export default function LoginModal() {
  const { loginOpen, handleLoginClose, handleOpen } = useData();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const { t } = useTranslation("home");
  const { login, loading, handleClose } = useAuth();
  const { validateField } = useSecurity();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const emailError = validateField("Email", email);
    const passwordError = validateField("Password", password);
    if (emailError || passwordError) {
      toast.error(emailError || passwordError);
      return;
    }
    try {
      await login(email, password);
      toast.success("Logged in successfully!");
      handleLoginClose();
      handleClose();
    } catch {
      toast.error("The email or password is incorrect.");
    }
  };

  const loginWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { queryParams: { access_type: "offline", prompt: "select_account consent" } } });
      if (error) toast.error(error.message);
    } catch {
      toast.error("An unexpected error occurred while connecting to Google.");
    }
  };

  const handleForgotPassword = async () => {
    const emailError = validateField("Email", email);
    if (emailError) { toast.error(emailError); return; }
    if (!isSupabaseConfigured) { toast.info("Password recovery is unavailable until the Supabase connection is configured."); return; }
    const locale = window.location.pathname.split("/").filter(Boolean)[0] || "en";
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/${locale}/reset-password` });
    if (error) toast.error(error.message);
    else toast.success("If this email exists, a password reset link is on its way.");
  };

  return (
    <Dialog open={loginOpen} onClose={handleLoginClose} fullWidth maxWidth="md" PaperProps={{ className: "auth-dialog-paper" }}>
      <motion.div initial={{ opacity: 0, y: 20, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: .35 }} className="auth-modal-shell">
        <button type="button" className="auth-modal-close" onClick={handleLoginClose} aria-label="Close"><X size={19} /></button>
        <aside className="auth-modal-aside"><div className="auth-modal-watermark">𓂀</div><div className="auth-modal-aside-copy"><span className="luxury-eyebrow">Curated Egypt</span><h2>Come back<br /><em>to the river.</em></h2><p>Your next unforgettable chapter across Luxor, Aswan and the Nile is waiting.</p></div><div className="auth-modal-trust"><ShieldCheck size={16} /><span>Private journeys · Human support</span></div></aside>
        <section className="auth-modal-content"><div className="auth-modal-heading"><span className="auth-modal-kicker">Welcome back</span><h1>{t("Login")}</h1><p>{forgotOpen ? "We will send a secure reset link to your inbox." : "Sign in to continue planning your Egypt."}</p></div><DialogContent className="auth-modal-form-wrap"><form className="auth-modal-form" onSubmit={forgotOpen ? (event) => { event.preventDefault(); handleForgotPassword(); } : handleSubmit}><label className="auth-field"><span>{t("Email")}</span><div className="auth-input-wrap"><Mail size={17} /><input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required /></div></label>{!forgotOpen && <label className="auth-field"><span>{t("Password")}</span><div className="auth-input-wrap"><LockKeyhole size={17} /><input type={showPassword ? "text" : "password"} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" required /><button type="button" className="auth-input-action" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label>}{!forgotOpen && <button type="button" className="auth-forgot-button" onClick={() => setForgotOpen(true)}>Forgot password?</button>}<button className="auth-primary-button" type="submit" disabled={loading}>{forgotOpen ? "Send reset link" : loading ? t("Loggingin") : <><span>{t("Login")}</span><ArrowRight size={17} /></>}</button>{forgotOpen && <button type="button" className="auth-switch-button" onClick={() => setForgotOpen(false)}>Back to sign in</button>}</form>{!forgotOpen && <><div className="auth-divider"><span>{t("orcontinuewith")}</span></div><button type="button" className="auth-google-button" onClick={loginWithGoogle}><FcGoogle size={20} /><span>Continue with Google</span></button><button type="button" className="auth-switch-button" onClick={() => { handleLoginClose(); handleOpen(); }}>{t("Don’thaveanaccount?SignUp")}</button></>}</DialogContent></section>
      </motion.div>
    </Dialog>
  );
}
