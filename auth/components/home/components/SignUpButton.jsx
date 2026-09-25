"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent } from "@mui/material";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck, UserRound, X } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { toast } from "react-toastify";
import { useSecurity } from "@/context/SecurityContext";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabaseClient";

export default function SignUpModal() {
  const { handleLoginOpen } = useData();
  const { validateField } = useSecurity();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation("home");
  const { register, loading, open, handleClose } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nameError = validateField("Full Name", fullName);
    const emailError = validateField("Email", email);
    const passwordError = validateField("Password", password);
    if (nameError || emailError || passwordError || !gender) {
      toast.error(nameError || emailError || passwordError || "Gender is required");
      return;
    }
    try {
      await register(email, password, fullName, gender);
      toast.success("A confirmation message has been sent to your account.");
      handleClose();
    } catch (err) {
      toast.error(err.message || "Unable to create your account.");
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

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md" PaperProps={{ className: "auth-dialog-paper" }}>
      <motion.div initial={{ opacity: 0, y: 20, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: .35 }} className="auth-modal-shell">
        <button type="button" className="auth-modal-close" onClick={handleClose} aria-label="Close"><X size={19} /></button>
        <aside className="auth-modal-aside auth-modal-aside-signup"><div className="auth-modal-watermark">𓂀</div><div className="auth-modal-aside-copy"><span className="luxury-eyebrow">Your Egypt begins here</span><h2>Make room<br /><em>for wonder.</em></h2><p>Save your favourite journeys and let us shape the right pace for your story.</p></div><div className="auth-modal-trust"><ShieldCheck size={16} /><span>Curated with care · No pressure</span></div></aside>
        <section className="auth-modal-content"><div className="auth-modal-heading"><span className="auth-modal-kicker">Start your journey</span><h1>{t("SignUp")}</h1><p>Create a private travel profile in under a minute.</p></div><DialogContent className="auth-modal-form-wrap"><form className="auth-modal-form" onSubmit={handleSubmit}><label className="auth-field"><span>{t("FullName")}</span><div className="auth-input-wrap"><UserRound size={17} /><input type="text" autoComplete="name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" required /></div></label><label className="auth-field"><span>{t("Email")}</span><div className="auth-input-wrap"><Mail size={17} /><input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required /></div></label><label className="auth-field"><span>{t("Password")}</span><div className="auth-input-wrap"><LockKeyhole size={17} /><input type={showPassword ? "text" : "password"} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a secure password" required /><button type="button" className="auth-input-action" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label><div className="auth-field"><span>{t("Gender")}</span><div className="auth-choice-group"><button type="button" className={gender === "male" ? "is-selected" : ""} onClick={() => setGender("male")}>Male</button><button type="button" className={gender === "female" ? "is-selected" : ""} onClick={() => setGender("female")}>Female</button></div></div><button className="auth-primary-button" type="submit" disabled={loading}>{loading ? t("Creating") : <><span>{t("SignUp")}</span><ArrowRight size={17} /></>}</button></form><div className="auth-divider"><span>{t("orsignupwith")}</span></div><button type="button" className="auth-google-button" onClick={loginWithGoogle}><FcGoogle size={20} /><span>Continue with Google</span></button><button type="button" className="auth-switch-button" onClick={handleLoginOpen}>{t("Alreadyhaveanaccount?Login")}</button></DialogContent></section>
      </motion.div>
    </Dialog>
  );
}
