import { useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import ParticleField from "@/components/ParticleField";
import Globe3D from "@/components/Globe3D";
import AnimatedCounter from "@/components/AnimatedCounter";
import GoldDivider from "@/components/GoldDivider";
import { PILLARS, GLOBAL_GOAL, SITE1_URL, MIN_CONTRIBUTION } from "@/lib/config";
import { useGlobalFundingTotals } from "@/hooks/useFundingTotals";
import { formatCurrency, pct } from "@/lib/utils";

const LOGO = "/images/LogoKingstoneKongo.PNG";

const wordV = {
  hidden: { opacity:0, y:50, filter:"blur(12px)" },
  visible: (i) => ({ opacity:1, y:0, filter:"blur(0px)",
    transition:{ duration:0.7, delay:i*0.13, ease:[0.25,0.46,0.45,0.94] } }),
};

export default function Home() {
  const totals = useGlobalFundingTotals();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start","end start"] });
  const heroY = useTransform(scrollYProgress, [0,1], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0,0.6], [1, 0]);

  // On anime par GROUPE (ligne 1 / mot mis en avant / ligne 2) plutôt que mot-à-mot :
  // l'ordre des mots change selon la langue ("Invest in the Future" vs "Investissez dans le Futur"),
  // donc découper un tableau français figé casserait la traduction. Cette structure marche pour toutes les langues.
  const titleGroups = [
    { text: "Investissez dans", gold: false },
    { text: "le Futur", gold: true },
    { text: "du Congo", gold: false },
  ];

  return (
    <div className="bg-black min-h-screen">
      {/* ─── HERO ─── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
        <ParticleField count={25} />
        {/* Ambient orbs */}
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full"
          style={{background:"radial-gradient(circle, rgba(245,176,65,0.06) 0%, transparent 70%)", animation:"orb-pulse 8s ease-in-out infinite"}} />
        <div className="absolute bottom-1/3 left-1/5 w-[400px] h-[400px] rounded-full"
          style={{background:"radial-gradient(circle, rgba(16,185,129,0.04) 0%, transparent 70%)", animation:"orb-pulse 10s ease-in-out infinite 2s"}} />

        <motion.div style={{ y:heroY, opacity:heroOpacity }}
          className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-24 pb-16">

          {/* Left */}
          <div>
            <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.3, duration:0.8}}
              className="mb-8">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/20 bg-gold/5 text-gold text-[10px] tracking-[0.3em] uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                Plateforme d'investissement coopératif
              </span>
            </motion.div>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-black leading-[0.95] mb-8">
              {titleGroups.map((g,i) => (
                <motion.span key={i} custom={i} variants={wordV} initial="hidden" animate="visible"
                  className={`inline-block mr-3 ${g.gold ? "text-gold" : ""}`}>
                  {g.text}
                </motion.span>
              ))}
            </h1>

            <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:1.2, duration:0.8}}
              className="text-neutral-400 text-lg leading-relaxed mb-10 max-w-lg">
              Rejoignez les coopérateurs qui construisent ensemble les 12 piliers de la renaissance congolaise. Chaque contribution est traçable, transparente et impactante.
            </motion.p>

            <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:1.5, duration:0.8}}
              className="flex flex-col sm:flex-row gap-4">
              <a href="/investir"
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gold text-black font-bold text-sm tracking-widest uppercase overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(245,176,65,0.4)]">
                <span className="relative z-10">Investir Maintenant</span>
                <svg className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-r from-gold via-yellow-300 to-gold translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
              </a>
              <a href="/partenariat"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-white/15 text-sm tracking-widest uppercase text-neutral-300 hover:border-gold/40 hover:text-gold transition-all duration-300">
                Partenariats
              </a>
            </motion.div>
          </div>

          {/* Right — Globe */}
          <motion.div initial={{opacity:0,scale:0.8}} animate={{opacity:1,scale:1}} transition={{delay:0.5, duration:1.2, ease:[0.22,1,0.36,1]}}
            className="flex justify-center relative">
            <div className="relative">
              <div className="absolute inset-0 rounded-full" style={{background:"radial-gradient(circle at 40% 40%, rgba(245,176,65,0.15), transparent 70%)"}} />
              <Globe3D className="w-[320px] h-[320px] md:w-[420px] md:h-[420px]" />
              {/* Orbiting badge */}
              <motion.div animate={{rotate:360}} transition={{duration:25, repeat:Infinity, ease:"linear"}}
                className="absolute inset-0 pointer-events-none">
                <div className="absolute top-4 right-8 px-3 py-1.5 rounded-full border border-gold/30 bg-black/80 backdrop-blur-sm">
                  <span className="text-[10px] text-gold tracking-widest uppercase font-bold">RDC 🇨🇩</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div animate={{y:[0,8,0]}} transition={{duration:2,repeat:Infinity}}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-gold/40 to-transparent" />
          <span className="text-[9px] tracking-[0.3em] text-neutral-700 uppercase">Défiler</span>
        </motion.div>
      </section>

      {/* ─── COUNTER BENTO ─── */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <GoldDivider className="mb-16" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Big counter */}
            <motion.div initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} transition={{duration:0.8}} viewport={{once:true}}
              className="md:col-span-2 glass-card rounded-3xl p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full"
                style={{background:"radial-gradient(circle, rgba(245,176,65,0.06), transparent 70%)", transform:"translate(30%,-30%)"}} />
              <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-600 mb-3">Fonds collectés</p>
              <div className="flex items-end gap-4 mb-4">
                <span className="font-display text-5xl md:text-6xl font-black text-gold">
                  $<AnimatedCounter value={totals.loading ? 0 : totals.total_collected_usd} duration={2500} format={n => n.toLocaleString("fr-FR")} />
                </span>
                <span className="text-neutral-600 text-lg mb-2">/ {formatCurrency(GLOBAL_GOAL)}</span>
              </div>
              {/* Progress bar */}
              <div className="h-2 rounded-full bg-white/5 overflow-hidden mb-3">
                <motion.div initial={{width:0}} whileInView={{width:`${pct(totals.loading ? 0 : totals.total_collected_usd, GLOBAL_GOAL)}%`}}
                  transition={{duration:1.5, ease:"easeOut"}} viewport={{once:true}}
                  className="h-full rounded-full bg-gradient-to-r from-gold to-yellow-300" />
              </div>
              <p className="text-xs text-neutral-500">{pct(totals.loading ? 0 : totals.total_collected_usd, GLOBAL_GOAL)}% de l'objectif total</p>
            </motion.div>

            {/* Backers */}
            <motion.div initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} transition={{duration:0.8,delay:0.1}} viewport={{once:true}}
              className="glass-card rounded-3xl p-8 flex flex-col justify-between">
              <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-600">Coopérateurs</p>
              <div>
                <span className="font-display text-5xl font-black text-white">
                  <AnimatedCounter value={totals.loading ? 0 : totals.approx_backers} duration={2000} />
                </span>
                <p className="text-xs text-neutral-500 mt-2">actifs dans le monde</p>
              </div>
              <div className="flex gap-1">
                {["🇫🇷","🇧🇪","🇨🇦","🇨🇩","🇺🇸","🇬🇧"].map(f => (
                  <span key={f} className="text-lg">{f}</span>
                ))}
              </div>
            </motion.div>

            {/* Pilier cards — mini bento */}
            {PILLARS.slice(0,3).map((p, i) => (
              <motion.div key={p.slug} initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}}
                transition={{duration:0.7, delay:i*0.1}} viewport={{once:true}}
                className="glass-card rounded-2xl p-6 group hover:border-white/10 transition-all duration-300 cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl">{p.icon}</span>
                  <span className="text-[9px] tracking-widest uppercase" style={{color:p.color}}>Pilier {String(i+1).padStart(2,"0")}</span>
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">{p.label}</h3>
                <div className="h-1 rounded-full bg-white/5 mt-3">
                  <div className="h-full rounded-full transition-all duration-700 group-hover:opacity-100 opacity-70"
                    style={{width:"0%",background:p.color}} />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px] text-neutral-600">Objectif</span>
                  <span className="text-[10px]" style={{color:p.color}}>{formatCurrency(p.goal)}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHY SECTION ─── */}
      <section className="py-24 px-6 md:px-12 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
            style={{background:"radial-gradient(circle, rgba(245,176,65,0.03), transparent 60%)"}} />
        </div>
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} transition={{duration:0.8}} viewport={{once:true}}
            className="text-center mb-16">
            <p className="text-[10px] tracking-[0.4em] uppercase text-gold mb-4">Pourquoi Nous</p>
            <h2 className="font-display text-4xl md:text-5xl font-black text-white max-w-2xl mx-auto leading-tight">
              Un investissement qui <em className="not-italic text-gold">transforme vraiment</em>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon:"🔒", title:"Sécurité absolue", desc:"Paiements chiffrés de bout en bout. Vos données bancaires ne transitent jamais par nos serveurs.", color:"#10B981" },
              { icon:"📊", title:"Transparence totale", desc:"Chaque franc investi est tracé. Dashboard temps réel, rapports mensuels publics.", color:"#F5B041" },
              { icon:"🗳️", title:"Gouvernance démocratique", desc:"1 personne = 1 voix. Les décisions se prennent ensemble, peu importe la mise.", color:"#8B5CF6" },
              { icon:"🌍", title:"Impact mesurable", desc:"Indicateurs d'impact par pilier. Vous voyez concrètement où va chaque dollar.", color:"#3B82F6" },
            ].map((c, i) => (
              <motion.div key={c.title} initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}}
                transition={{duration:0.7,delay:i*0.12}} viewport={{once:true}}
                className="glass-card rounded-2xl p-7 hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5 transition-all duration-300"
                  style={{background:`${c.color}15`, border:`1px solid ${c.color}25`}}>
                  {c.icon}
                </div>
                <h3 className="font-semibold text-white text-sm mb-2">{c.title}</h3>
                <p className="text-neutral-500 text-xs leading-relaxed">{c.desc}</p>
                <div className="mt-5 h-px transition-all duration-500 group-hover:opacity-100 opacity-0"
                  style={{background:`linear-gradient(to right, ${c.color}50, transparent)`}} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PILLARS MINI GRID ─── */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <GoldDivider className="mb-16" />
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[10px] tracking-[0.4em] uppercase text-gold mb-3">12 Piliers Coopératifs</p>
              <h2 className="font-display text-3xl md:text-4xl font-black text-white">Choisissez votre <em className="not-italic text-gold">pilier</em></h2>
            </div>
            <a href="/investir" className="text-xs text-neutral-500 hover:text-gold transition-colors tracking-widest uppercase">
              Voir tout →
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {PILLARS.map((p, i) => (
              <motion.a key={p.slug} href={`/investir?pilier=${p.slug}`}
                initial={{opacity:0,scale:0.95}} whileInView={{opacity:1,scale:1}}
                transition={{duration:0.5,delay:i*0.05}} viewport={{once:true}}
                whileHover={{scale:1.03}} whileTap={{scale:0.97}}
                className="glass-card rounded-2xl p-5 cursor-pointer group transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{p.icon}</span>
                  <span className="text-[8px] tracking-widest opacity-60 group-hover:opacity-100 transition-opacity" style={{color:p.color}}>
                    {String(i+1).padStart(2,"0")}
                  </span>
                </div>
                <h3 className="text-xs font-semibold text-white leading-tight">{p.label}</h3>
                <p className="text-[10px] text-neutral-600 mt-1 line-clamp-2 leading-relaxed">{p.tagline}</p>
                <div className="mt-3 h-0.5 rounded-full w-0 group-hover:w-full transition-all duration-500"
                  style={{background:p.color}} />
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TRUST / SECURITY ─── */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} transition={{duration:0.8}} viewport={{once:true}}
            className="glass-card rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none"
              style={{background:"radial-gradient(circle at 50% 0%, rgba(245,176,65,0.08), transparent 60%)"}} />
            <p className="text-[10px] tracking-[0.4em] uppercase text-gold mb-4 relative z-10">Confiance & Sécurité</p>
            <h2 className="font-display text-3xl md:text-4xl font-black text-white mb-5 relative z-10">
              Votre argent est <em className="not-italic text-gold">protégé</em>
            </h2>
            <p className="text-neutral-400 text-sm leading-relaxed max-w-xl mx-auto mb-10 relative z-10">
              Connexion chiffrée de bout en bout · Aucune donnée bancaire stockée sur nos serveurs ·
              Chaque paiement est vérifié et tracé. Le détail complet de nos mesures de sécurité et de la
              protection de vos données figure dans notre{" "}
              <a href="/legal" className="text-gold underline hover:text-gold/80 transition-colors">politique de confidentialité</a>.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 relative z-10">
              {["Paiement chiffré","Données protégées","Traçabilité complète"].map(b => (
                <div key={b} className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 bg-white/5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{background:"#10B981"}} />
                  <span className="text-xs text-neutral-400 tracking-widest uppercase">{b}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-32 px-6 md:px-12 text-center relative overflow-hidden">
        <ParticleField count={12} />
        <div className="absolute inset-0 pointer-events-none"
          style={{background:"radial-gradient(ellipse at 50% 50%, rgba(245,176,65,0.05), transparent 70%)"}} />
        <motion.div initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} transition={{duration:0.9}} viewport={{once:true}}
          className="relative z-10 max-w-2xl mx-auto">
          <p className="text-[10px] tracking-[0.4em] uppercase text-gold mb-6">Rejoignez le Mouvement</p>
          <h2 className="font-display text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
            L'Afrique se lève.<br/><em className="not-italic text-gold">Soyez-en.</em>
          </h2>
          <p className="text-neutral-400 text-base leading-relaxed mb-10">
            Dès {MIN_CONTRIBUTION.toLocaleString("fr-FR")} $, devenez coopérateur et faites partie de l'histoire.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/investir"
              className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 rounded-full bg-gold text-black font-black text-sm tracking-widest uppercase overflow-hidden hover:shadow-[0_0_60px_rgba(245,176,65,0.4)] transition-all duration-300">
              <span className="relative z-10">Commencer à Investir</span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-gold translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
            </a>
            <a href={SITE1_URL}
              className="inline-flex items-center justify-center gap-2 px-10 py-5 rounded-full border border-white/15 text-sm tracking-widest uppercase text-neutral-400 hover:text-white hover:border-white/30 transition-all duration-300">
              ← Retour au Site Officiel
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
}