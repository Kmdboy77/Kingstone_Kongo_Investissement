import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ParticleField from "@/components/ParticleField";
import LampToggle from "@/components/LampToggle";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Check } from "lucide-react";
import { SITE1_URL } from "@/lib/config";
import { supabase } from "@/lib/supabase";
import { useGlobalFundingTotals } from "@/hooks/useFundingTotals";
import { formatCurrency, formatNumber } from "@/lib/utils";

const LOGO = "/images/LogoKingstoneKongo.PNG";

export default function Auth() {
  const totals = useGlobalFundingTotals();
  const [mode, setMode] = useState("login"); // login | register | forgot
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ name:"", email:"", password:"", confirm:"" });
  const [error, setError] = useState("");
  const [lampOn, setLampOn] = useState(false);

  const set = (k) => (e) => setForm(f => ({...f,[k]:e.target.value}));

  async function handleGoogleSignIn() {
    setError("");
    setLoading(true);
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (err) {
      setError("Connexion Google indisponible pour le moment.");
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (mode === "register" && form.password !== form.confirm) {
      setError("Les mots de passe ne correspondent pas."); return;
    }
    if (form.password && form.password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères."); return;
    }

    setLoading(true);
    try {
      if (mode === "login") {
        const { error: err } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (err) throw err;
        window.location.href = "/dashboard";
      } else if (mode === "register") {
        const { error: err } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: { full_name: form.name },
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        });
        if (err) throw err;
        setDone(true);
      } else if (mode === "forgot") {
        const { error: err } = await supabase.auth.resetPasswordForEmail(form.email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (err) throw err;
        setDone(true);
      }
    } catch (err) {
      const msg = err?.message || "";
      if (msg.includes("Invalid login credentials")) setError("Email ou mot de passe incorrect.");
      else if (msg.includes("already registered") || msg.includes("already been registered")) setError("Un compte existe déjà avec cet email.");
      else if (msg.includes("Password should be")) setError("Mot de passe trop faible (min. 8 caractères).");
      else setError(msg || "Une erreur est survenue. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  const titles = {
    login: { heading:"Bon retour,", accent:"Coopérateur", sub:"Accédez à votre espace d'investissement." },
    register: { heading:"Rejoignez", accent:"le Mouvement", sub:"Créez votre compte et commencez à investir dès aujourd'hui." },
    forgot: { heading:"Réinitialiser", accent:"votre accès", sub:"Renseignez votre email pour recevoir un lien de réinitialisation." },
  };
  const t = titles[mode];

  return (
    <div className="min-h-screen bg-black flex relative overflow-hidden">
      <ParticleField count={15} />

      <div className="hidden lg:flex flex-1 relative items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0"
          style={{background:"radial-gradient(ellipse at 30% 50%, rgba(245,176,65,0.08), transparent 60%)"}} />
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <LampToggle on={lampOn} onToggle={() => setLampOn(v => !v)} />
        </div>
        <div className="absolute bottom-0 inset-x-0 h-32"
          style={{background:"linear-gradient(to top, black, transparent)"}} />
      </div>

      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10 lg:max-w-lg">
        <div className="w-full max-w-md">

          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <img src={LOGO} alt="KK" className="w-8 h-8 rounded-full" />
            <span className="text-xs tracking-widest uppercase text-white">Kingstone Kongo</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={mode} initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}
              transition={{duration:0.4}}>

              <div className="mb-8">
                <h1 className="font-display text-3xl font-black text-white leading-tight mb-2">
                  {t.heading} <em className="not-italic text-gold">{t.accent}</em>
                </h1>
                <p className="text-neutral-500 text-sm">{t.sub}</p>
              </div>

              {!lampOn ? (
                <div className="border border-dashed border-white/10 rounded-2xl py-20 px-6 text-center lg:flex hidden flex-col items-center">
                  <Lock size={20} className="mx-auto mb-4 text-neutral-600" />
                  <p className="text-sm text-neutral-500">Tirez la corde pour activer la connexion.</p>
                </div>
              ) : null}

              <div className={lampOn ? "block" : "lg:hidden block"}>
                {done ? (
                  <div className="glass-card rounded-2xl p-8 text-center">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
                      style={{background:"rgba(16,185,129,0.15)",border:"1px solid #10B98140"}}>
                      <Check size={24} style={{color:"#10B981"}} />
                    </div>
                    <h3 className="font-semibold text-white mb-2">
                      {mode === "forgot" ? "Email envoyé !" : "Vérifiez votre boîte mail"}
                    </h3>
                    <p className="text-xs text-neutral-500 mb-6">
                      {mode === "forgot"
                        ? "Suivez les instructions reçues pour réinitialiser votre mot de passe."
                        : "Un email de confirmation a été envoyé. Cliquez sur le lien pour activer votre compte."}
                    </p>
                    <button onClick={() => { setMode("login"); setDone(false); }}
                      className="text-xs text-gold hover:text-gold/80 transition-colors tracking-widest uppercase">
                      ← Retour à la connexion
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">{error}</div>
                    )}

                    {mode === "register" && (
                      <div className="relative">
                        <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600" />
                        <input value={form.name} onChange={set("name")} required placeholder="Nom complet"
                          className="w-full glass-card rounded-xl pl-11 pr-4 py-3.5 text-white text-sm placeholder:text-neutral-700 border border-white/10 focus:border-gold/40 focus:outline-none bg-transparent" />
                      </div>
                    )}

                    <div className="relative">
                      <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600" />
                      <input type="email" value={form.email} onChange={set("email")} required placeholder="Adresse email"
                        className="w-full glass-card rounded-xl pl-11 pr-4 py-3.5 text-white text-sm placeholder:text-neutral-700 border border-white/10 focus:border-gold/40 focus:outline-none bg-transparent" />
                    </div>

                    {mode !== "forgot" && (
                      <div className="relative">
                        <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600" />
                        <input type={showPwd ? "text":"password"} value={form.password} onChange={set("password")} required
                          placeholder="Mot de passe"
                          className="w-full glass-card rounded-xl pl-11 pr-11 py-3.5 text-white text-sm placeholder:text-neutral-700 border border-white/10 focus:border-gold/40 focus:outline-none bg-transparent" />
                        <button type="button" onClick={() => setShowPwd(!showPwd)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-400 transition-colors">
                          {showPwd ? <EyeOff size={15}/> : <Eye size={15}/>}
                        </button>
                      </div>
                    )}

                    {mode === "register" && (
                      <div className="relative">
                        <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600" />
                        <input type={showPwd ? "text":"password"} value={form.confirm} onChange={set("confirm")} required
                          placeholder="Confirmer le mot de passe"
                          className="w-full glass-card rounded-xl pl-11 pr-4 py-3.5 text-white text-sm placeholder:text-neutral-700 border border-white/10 focus:border-gold/40 focus:outline-none bg-transparent" />
                      </div>
                    )}

                    {mode === "login" && (
                      <div className="flex justify-end">
                        <button type="button" onClick={() => setMode("forgot")}
                          className="text-[11px] text-neutral-600 hover:text-gold transition-colors">
                          Mot de passe oublié ?
                        </button>
                      </div>
                    )}

                    <button type="submit" disabled={loading}
                      className="w-full py-4 rounded-full bg-gold text-black font-black text-sm tracking-widest uppercase flex items-center justify-center gap-3 hover:shadow-[0_0_40px_rgba(245,176,65,0.4)] transition-all duration-300 disabled:opacity-60">
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      ) : (
                        <>
                          {mode==="login" ? "Se connecter" : mode==="register" ? "Créer mon compte" : "Envoyer le lien"}
                          <ArrowRight size={16} />
                        </>
                      )}
                    </button>

                    {mode !== "forgot" && (
                      <>
                        <div className="flex items-center gap-3 my-2">
                          <div className="flex-1 h-px bg-white/5" />
                          <span className="text-[10px] text-neutral-700 uppercase tracking-widest">ou</span>
                          <div className="flex-1 h-px bg-white/5" />
                        </div>

                        <button type="button" onClick={handleGoogleSignIn} disabled={loading}
                          className="w-full py-3.5 rounded-full glass-card border border-white/10 flex items-center justify-center gap-3 text-sm text-neutral-300 hover:border-white/20 hover:text-white transition-all duration-300 disabled:opacity-60">
                          <svg className="w-4 h-4" viewBox="0 0 48 48">
                            <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
                            <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
                            <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
                            <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
                          </svg>
                          Continuer avec Google
                        </button>
                        <p className="text-center text-[10px] text-neutral-700 leading-relaxed">
                          En continuant, vous acceptez notre{" "}
                          <a href="/legal#cgu" className="underline hover:text-gold transition-colors">politique de confidentialité</a>.
                        </p>
                      </>
                    )}
                  </form>
                )}

                {!done && (
                  <p className="text-center text-xs text-neutral-600 mt-6">
                    {mode === "login" ? (
                      <>Pas encore de compte ?{" "}
                        <button onClick={() => setMode("register")} className="text-gold hover:text-gold/80 transition-colors font-semibold">Créer un compte</button>
                      </>
                    ) : mode === "register" ? (
                      <>Déjà un compte ?{" "}
                        <button onClick={() => setMode("login")} className="text-gold hover:text-gold/80 transition-colors font-semibold">Se connecter</button>
                      </>
                    ) : (
                      <button onClick={() => setMode("login")} className="text-gold hover:text-gold/80 transition-colors font-semibold">
                        ← Retour à la connexion
                      </button>
                    )}
                  </p>
                )}
              </div>

              <p className="text-center mt-6">
                <a href={SITE1_URL} className="text-[10px] text-neutral-700 hover:text-neutral-500 transition-colors tracking-widest uppercase">
                  ← Retour au site officiel
                </a>
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}