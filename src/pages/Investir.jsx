import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PILLARS, CONTACT_EMAIL, MIN_CONTRIBUTION, LOCK_PERIOD_YEARS } from "@/lib/config";
import { formatCurrency } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import ParticleField from "@/components/ParticleField";
import { Check, ChevronRight, Lock, CreditCard, Smartphone, Globe, Mail, Info } from "lucide-react";

const AMOUNTS = [1000, 2500, 5000, 10000, 25000, 50000];

const STEPS = ["Pilier", "Montant", "Réservation", "Confirmation"];

const PAY_METHODS = [
  { id: "card",   icon: <CreditCard size={14} />, label: "Carte bancaire" },
  { id: "mobile", icon: <Smartphone size={14} />, label: "Mobile Money" },
  { id: "paypal", icon: <Globe size={14} />,      label: "PayPal" },
  { id: "cheque", icon: <Mail size={14} />,        label: "Chèque" },
];

export default function Investir() {
  const [step, setStep] = useState(0);
  const [selectedPillar, setSelectedPillar] = useState(null);
  const [amount, setAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [payMethod, setPayMethod] = useState("card");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState("");
  const [session, setSession] = useState(undefined); // undefined = pas encore vérifié, null = déconnecté

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  // Pré-remplit nom/email si connecté
  useEffect(() => {
    if (session?.user) {
      setEmail((e) => e || session.user.email || "");
    }
  }, [session]);

  // Read URL param ?pilier=agriculture
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("pilier");
    if (p) {
      const found = PILLARS.find(pl => pl.slug === p);
      if (found) { setSelectedPillar(found); setStep(1); }
    }
  }, []);

  const finalAmount = amount || Number(customAmount) || 0;
  const currentPillar = selectedPillar;

  // ⚠️ Les contributions ne sont pas encore ouvertes : le compte bancaire de collecte
  // n'est pas encore opérationnel. On enregistre donc une PRÉ-RÉSERVATION (table `pledges`),
  // pas un vrai paiement. Aucune donnée bancaire n'est demandée ici.
  async function submitPledge(e) {
    e.preventDefault();
    setError("");
    if (!name.trim() || !email.trim()) { setError("Veuillez renseigner votre nom et email."); return; }
    if (finalAmount < MIN_CONTRIBUTION) { setError(`Montant minimum : ${formatCurrency(MIN_CONTRIBUTION)}.`); return; }
    if (!session) {
      window.location.href = "/auth";
      return;
    }

    setLoading(true);
    try {
      const { error: insertError } = await supabase.from("pledges").insert({
        user_id: session.user.id,
        full_name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || null,
        pillar_slug: currentPillar?.slug === "general" ? "general" : currentPillar?.slug,
        amount: finalAmount,
        currency,
        intended_method: payMethod,
      });
      if (insertError) throw insertError;
      setConfirmed(true);
      setStep(3);
    } catch (err) {
      setError(err.message || "Une erreur est survenue. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-32 px-6 md:px-12">
      <ParticleField count={10} />
      <div className="max-w-4xl mx-auto relative z-10">

        {/* Header */}
        <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:0.8}}
          className="text-center mb-14">
          <p className="text-[10px] tracking-[0.4em] uppercase text-gold mb-4">Rejoindre le Mouvement</p>
          <h1 className="font-display text-4xl md:text-5xl font-black text-white mb-4">
            Devenir <em className="not-italic text-gold">Coopérateur</em>
          </h1>
          <p className="text-neutral-400 text-sm max-w-lg mx-auto">
            Chaque contribution finance directement l'un des 12 piliers de la renaissance Africaine.
            Le capital investi est bloqué {LOCK_PERIOD_YEARS} ans et génère un rendement annuel.
          </p>
        </motion.div>

        {/* Stepper */}
        {!confirmed && (
          <div className="flex items-center justify-center gap-0 mb-14 flex-wrap">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-500 ${
                  i === step ? "bg-gold text-black" : i < step ? "bg-gold/20 text-gold" : "bg-white/5 text-neutral-600"
                }`}>
                  {i < step ? <Check size={12} /> : <span className="text-[10px] font-bold">{i+1}</span>}
                  <span className="text-[10px] tracking-widest uppercase font-bold">{s}</span>
                </div>
                {i < STEPS.length-1 && <div className={`w-8 h-px transition-all duration-500 ${i < step ? "bg-gold" : "bg-white/10"}`} />}
              </div>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">

          {/* STEP 0 — Choisir un pilier */}
          {step === 0 && (
            <motion.div key="step0" initial={{opacity:0,x:40}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-40}}
              transition={{duration:0.5}}>
              <h2 className="font-display text-2xl font-bold text-white mb-2 text-center">Quel pilier souhaitez-vous soutenir ?</h2>
              <p className="text-neutral-500 text-xs text-center mb-8">
                Toute contribution passe d'abord par le Fonds Général avant d'être affectée au pilier choisi.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                {/* Fonds général */}
                <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}}
                  onClick={() => { setSelectedPillar({slug:"general",label:"Fonds Général",color:"#F5B041",icon:"🌍",tagline:"Le fonds mère : point d'entrée obligatoire, réparti ensuite entre les 12 piliers."}); setStep(1); }}
                  className="col-span-2 md:col-span-3 glass-card rounded-2xl p-5 text-left group hover:border-gold/30 transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🌍</span>
                    <div>
                      <h3 className="text-sm font-semibold text-white">Fonds Général</h3>
                      <p className="text-[10px] text-neutral-500">Le fonds mère de la coopérative. Recommandé pour commencer.</p>
                    </div>
                    <ChevronRight size={16} className="ml-auto text-neutral-600 group-hover:text-gold transition-colors" />
                  </div>
                </motion.button>

                {PILLARS.map((p, i) => (
                  <motion.button key={p.slug} whileHover={{scale:1.03}} whileTap={{scale:0.97}}
                    onClick={() => { setSelectedPillar(p); setStep(1); }}
                    className="glass-card rounded-2xl p-5 text-left group hover:border-white/10 transition-all duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xl">{p.icon}</span>
                      <span className="text-[8px]" style={{color:p.color}}>{String(i+1).padStart(2,"0")}</span>
                    </div>
                    <h3 className="text-xs font-semibold text-white leading-tight">{p.label}</h3>
                    <p className="text-[9px] text-neutral-600 mt-1">Objectif {formatCurrency(p.goal)}</p>
                    <div className="mt-2 h-0.5 rounded-full w-0 group-hover:w-full transition-all duration-500" style={{background:p.color}} />
                  </motion.button>
                ))}
              </div>

              <div className="text-center pt-4">
                <a href="/investissement-info"
                  className="inline-flex items-center gap-2 text-xs text-neutral-500 hover:text-gold transition-colors tracking-widest uppercase">
                  <Info size={13} /> En savoir plus sur les investissements
                </a>
              </div>
            </motion.div>
          )}

          {/* STEP 1 — Montant */}
          {step === 1 && currentPillar && (
            <motion.div key="step1" initial={{opacity:0,x:40}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-40}}
              transition={{duration:0.5}}>
              {/* Pilier recap */}
              <div className="glass-card rounded-2xl p-5 mb-8 flex items-center gap-4 border"
                style={{borderColor:`${currentPillar.color}30`}}>
                <span className="text-3xl">{currentPillar.icon}</span>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-white">{currentPillar.label}</h3>
                  <p className="text-[11px] text-neutral-500">{currentPillar.tagline}</p>
                </div>
                <button onClick={() => setStep(0)} className="text-[10px] text-neutral-600 hover:text-gold transition-colors tracking-widest uppercase">
                  Changer
                </button>
              </div>

              <h2 className="font-display text-2xl font-bold text-white mb-6 text-center">Choisissez votre contribution</h2>

              {/* Currency */}
              <div className="flex items-center justify-center gap-2 mb-6">
                {["USD","EUR","CDF"].map(c => (
                  <button key={c} onClick={() => setCurrency(c)}
                    className={`px-4 py-1.5 rounded-full text-[10px] tracking-widest uppercase transition-all duration-300 ${
                      currency===c ? "bg-gold text-black font-bold" : "border border-white/10 text-neutral-500 hover:text-gold"
                    }`}>
                    {c}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3 mb-5">
                {AMOUNTS.map(a => (
                  <motion.button key={a} whileTap={{scale:0.95}}
                    onClick={() => { setAmount(a); setCustomAmount(""); }}
                    className={`rounded-2xl py-5 text-center transition-all duration-300 font-bold text-base ${
                      amount===a ? "bg-gold text-black shadow-[0_0_30px_rgba(245,176,65,0.3)]" : "glass-card hover:border-gold/30 text-white"
                    }`}>
                    {a.toLocaleString("fr-FR")} {currency}
                  </motion.button>
                ))}
              </div>

              <div className="relative mb-3">
                <input
                  type="number" min={MIN_CONTRIBUTION} placeholder="Montant personnalisé..."
                  value={customAmount}
                  onChange={e => { setCustomAmount(e.target.value); setAmount(null); }}
                  className="w-full glass-card rounded-2xl px-5 py-4 text-white text-sm placeholder:text-neutral-700 border border-white/10 focus:border-gold/40 focus:outline-none transition-all duration-300 bg-transparent"
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">{currency}</span>
              </div>
              <p className="text-[10px] text-neutral-600 mb-8">Montant minimum : {formatCurrency(MIN_CONTRIBUTION)}.</p>

              <div className="flex items-center gap-3 p-4 rounded-xl border border-gold/15 bg-gold/5 mb-8">
                <Lock size={14} className="text-gold shrink-0" />
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Ce capital sera bloqué {LOCK_PERIOD_YEARS} ans et génère un rendement annuel versé chaque année. {" "}
                  <a href="/investissement-info" className="underline hover:text-gold transition-colors">En savoir plus</a>
                </p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(0)}
                  className="px-6 py-3 rounded-full border border-white/10 text-xs text-neutral-500 hover:text-white transition-colors tracking-widest uppercase">
                  ← Retour
                </button>
                <button onClick={() => finalAmount >= MIN_CONTRIBUTION && setStep(2)} disabled={finalAmount < MIN_CONTRIBUTION}
                  className={`flex-1 py-4 rounded-full font-bold text-sm tracking-widest uppercase transition-all duration-300 ${
                    finalAmount >= MIN_CONTRIBUTION ? "bg-gold text-black hover:shadow-[0_0_30px_rgba(245,176,65,0.4)]" : "bg-white/5 text-neutral-700 cursor-not-allowed"
                  }`}>
                  Continuer — {finalAmount >= MIN_CONTRIBUTION ? `${finalAmount.toLocaleString("fr-FR")} ${currency}` : "Choisissez un montant"}
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2 — Réservation (les contributions ne sont pas encore ouvertes) */}
          {step === 2 && (
            <motion.div key="step2" initial={{opacity:0,x:40}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-40}}
              transition={{duration:0.5}}>

              {/* Order recap */}
              <div className="glass-card rounded-2xl p-5 mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{currentPillar?.icon}</span>
                  <div>
                    <p className="text-xs font-semibold text-white">{currentPillar?.label}</p>
                    <p className="text-[10px] text-neutral-500">Contribution coopérative</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gold">{finalAmount.toLocaleString("fr-FR")} {currency}</p>
                  <p className="text-[10px] text-neutral-600">Bloqué {LOCK_PERIOD_YEARS} ans</p>
                </div>
              </div>

              {/* Bandeau "bientôt ouvert" */}
              <div className="glass-card rounded-2xl p-6 mb-8 border border-gold/25 text-center">
                <p className="text-sm font-semibold text-gold mb-2">Les contributions ouvrent bientôt</p>
                <p className="text-xs text-neutral-400 leading-relaxed max-w-lg mx-auto">
                  Le compte de collecte de Kingstone Kongo est en cours de finalisation. Vous pouvez dès maintenant
                  réserver votre place : renseignez vos informations ci-dessous et nous vous contacterons par email
                  dès l'ouverture officielle pour finaliser votre contribution avec le moyen de paiement choisi.
                  Aucune donnée bancaire n'est demandée à cette étape.
                </p>
              </div>

              <h2 className="font-display text-xl font-bold text-white mb-6 text-center">Comment souhaitez-vous contribuer ?</h2>

              {/* Payment methods */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {PAY_METHODS.map(m => (
                  <button key={m.id} type="button" onClick={() => setPayMethod(m.id)}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] tracking-widest uppercase transition-all duration-300 ${
                      payMethod===m.id ? "bg-gold text-black font-bold" : "glass-card text-neutral-500 hover:text-white"
                    }`}>
                    {m.icon}{m.label}
                  </button>
                ))}
              </div>

              {payMethod === "cheque" && (
                <div className="mb-6 p-4 rounded-xl border border-gold/15 bg-gold/5">
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    Une fois la collecte ouverte, vous recevrez par email à l'adresse ci-dessous l'adresse postale
                    de Kingstone Kongo ainsi que les instructions pour l'envoi de votre chèque
                    (et la possibilité de nous en transmettre une copie scannée par email pour accélérer le traitement).
                  </p>
                </div>
              )}
              {(payMethod === "mobile" || payMethod === "paypal" || payMethod === "card") && (
                <div className="mb-6 p-4 rounded-xl border border-white/10 bg-white/2">
                  <p className="text-[11px] text-neutral-500 leading-relaxed">
                    Une fois la collecte ouverte, vous recevrez un lien sécurisé par email pour finaliser
                    votre contribution via {PAY_METHODS.find(m=>m.id===payMethod)?.label}.
                  </p>
                </div>
              )}

              {error && (
                <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">{error}</div>
              )}

              <form onSubmit={submitPledge} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] tracking-widest uppercase text-neutral-600 mb-2">Nom complet</label>
                    <input value={name} onChange={e=>setName(e.target.value)} required
                      className="w-full glass-card rounded-xl px-4 py-3 text-white text-sm placeholder:text-neutral-700 border border-white/10 focus:border-gold/40 focus:outline-none bg-transparent"
                      placeholder="Jean Ntumba" />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-widest uppercase text-neutral-600 mb-2">Email</label>
                    <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required
                      className="w-full glass-card rounded-xl px-4 py-3 text-white text-sm placeholder:text-neutral-700 border border-white/10 focus:border-gold/40 focus:outline-none bg-transparent"
                      placeholder="jean@exemple.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-neutral-600 mb-2">Téléphone (optionnel)</label>
                  <input value={phone} onChange={e=>setPhone(e.target.value)}
                    className="w-full glass-card rounded-xl px-4 py-3 text-white text-sm placeholder:text-neutral-700 border border-white/10 focus:border-gold/40 focus:outline-none bg-transparent"
                    placeholder="+243 ..." />
                </div>

                {!session && (
                  <p className="text-[11px] text-neutral-500 text-center">
                    Vous devrez vous connecter (ou créer un compte) pour finaliser votre réservation.
                  </p>
                )}

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setStep(1)}
                    className="px-6 py-3 rounded-full border border-white/10 text-xs text-neutral-500 hover:text-white transition-colors tracking-widest uppercase">
                    ← Retour
                  </button>
                  <button type="submit" disabled={loading}
                    className="flex-1 py-4 rounded-full bg-gold text-black font-black text-sm tracking-widest uppercase transition-all duration-300 hover:shadow-[0_0_40px_rgba(245,176,65,0.5)] disabled:opacity-60 flex items-center justify-center gap-3">
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    ) : (
                      <>Réserver ma contribution</>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* STEP 3 — Confirmation */}
          {step === 3 && (
            <motion.div key="step3" initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} transition={{duration:0.7}}
              className="text-center py-8">
              <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:"spring",delay:0.2,stiffness:120}}
                className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8"
                style={{background:"radial-gradient(circle, rgba(16,185,129,0.3), rgba(16,185,129,0.05))", border:"2px solid #10B981"}}>
                <Check size={40} style={{color:"#10B981"}} />
              </motion.div>
              <h2 className="font-display text-3xl font-black text-white mb-3">Réservation enregistrée !</h2>
              <p className="text-neutral-400 text-sm max-w-sm mx-auto mb-2">
                Merci <strong className="text-white">{name}</strong>. Votre réservation de{" "}
                <strong className="text-gold">{finalAmount.toLocaleString("fr-FR")} {currency}</strong> pour le pilier{" "}
                <strong className="text-white">{currentPillar?.label}</strong> est bien enregistrée.
              </p>
              <p className="text-neutral-600 text-xs mb-10">
                Nous vous contacterons à {email} dès l'ouverture officielle des contributions pour finaliser
                via {PAY_METHODS.find(m=>m.id===payMethod)?.label.toLowerCase()}.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/dashboard"
                  className="px-8 py-4 rounded-full bg-gold text-black font-bold text-xs tracking-widest uppercase hover:shadow-[0_0_30px_rgba(245,176,65,0.3)] transition-all duration-300">
                  Mon Dashboard →
                </a>
                <button onClick={() => { setStep(0); setAmount(null); setSelectedPillar(null); setConfirmed(false); }}
                  className="px-8 py-4 rounded-full border border-white/10 text-xs text-neutral-400 hover:text-white tracking-widest uppercase transition-colors">
                  Nouvelle réservation
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}