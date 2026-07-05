import { useState } from "react";
import { motion } from "framer-motion";
import ParticleField from "@/components/ParticleField";
import GoldDivider from "@/components/GoldDivider";
import { CONTACT_EMAIL, PILLARS } from "@/lib/config";
import { supabase } from "@/lib/supabase";
import { Building2, Globe, HandshakeIcon, TrendingUp, Award, Users, ChevronDown, ChevronUp } from "lucide-react";

const TIERS = [
  { id:"fondateur", label:"Fondateur", min:100000, color:"#F5B041", icon:"👑",
    perks:["Siège au Conseil d'Administration", "Logo premium sur tous les supports", "Accès VIP aux rapports d'impact", "Dédicace dans le Livre Blanc", "Visite de terrain exclusive RDC", "Conférence de présentation privée"] },
  { id:"diamant", label:"Diamant", min:50000, color:"#93C5FD", icon:"💎",
    perks:["Représentant au Comité de Pilotage", "Logo gold sur site & publications", "Rapports trimestriels détaillés", "Invitation aux assemblées annuelles", "Accès early aux nouvelles levées"] },
  { id:"or", label:"Or", min:10000, color:"#F5B041", icon:"🥇",
    perks:["Mention comme partenaire stratégique", "Logo sur le site officiel", "Newsletters d'impact bimensuelles", "Invitation aux webinaires partenaires"] },
  { id:"argent", label:"Argent", min:2500, color:"#D1D5DB", icon:"🥈",
    perks:["Badge Partenaire sur le site", "Accès au portail de reporting", "Newsletter mensuelle"] },
];

const FAQS = [
  { q:"Quel est le minimum pour un partenariat institutionnel ?", a:"2 500 $ pour le niveau Argent. Pour les ONG et organisations à but non lucratif, des conditions préférentielles existent — contactez-nous directement." },
  { q:"Les partenariats sont-ils déductibles fiscalement ?", a:"Cela dépend de votre pays de résidence et du statut légal de la structure. Nous recommandons de consulter votre conseiller fiscal. Nous fournissons tous les documents nécessaires." },
  { q:"Comment se passe le suivi de l'impact ?", a:"Chaque partenaire reçoit des rapports d'impact personnalisés avec indicateurs chiffrés par pilier financé : emplois créés, hectares cultivés, MW installés, etc." },
  { q:"Puis-je orienter mon investissement vers un pilier spécifique ?", a:"Oui, tout partenaire peut flécher 100% de sa contribution vers le(s) pilier(s) de son choix, avec un reporting dédié." },
];

export default function Partenariat() {
  const [openFaq, setOpenFaq] = useState(null);
  const [form, setForm] = useState({ org:"", name:"", email:"", tier:"or", pillar:"general", message:"" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSending(true);
    const { error: err } = await supabase.from("partnership_leads").insert({
      organization: form.org,
      contact_name: form.name,
      email: form.email,
      tier: form.tier,
      pillar_slug: form.pillar,
      message: form.message,
    });
    setSending(false);
    if (err) {
      setError("Impossible d'envoyer votre demande pour le moment. Réessayez ou écrivez-nous directement.");
      return;
    }
    setSent(true);
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-32">
      <ParticleField count={12} />

      {/* Hero */}
      <section className="px-6 md:px-12 py-20 text-center relative">
        <div className="absolute inset-0 pointer-events-none"
          style={{background:"radial-gradient(ellipse at 50% 30%, rgba(245,176,65,0.06), transparent 60%)"}} />
        <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:0.9}} className="relative z-10 max-w-3xl mx-auto">
          <p className="text-[10px] tracking-[0.4em] uppercase text-gold mb-5">Partenariats Stratégiques</p>
          <h1 className="font-display text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
            Construisons l'Afrique<br/><em className="not-italic text-gold">ensemble</em>
          </h1>
          <p className="text-neutral-400 text-base leading-relaxed max-w-xl mx-auto">
            Rejoignez les entreprises, ONG, gouvernements et diaspora qui investissent dans la renaissance coopérative du Congo.
            Chaque partenariat est une alliance pour l'histoire.
          </p>
        </motion.div>
      </section>

      {/* Partenaire actuel */}
      <section className="px-6 md:px-12 py-10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[10px] tracking-[0.4em] uppercase text-gold mb-6">Notre Partenaire</p>
          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} transition={{duration:0.7}} viewport={{once:true}}
            className="glass-card rounded-2xl px-8 py-10 inline-block">
            <h3 className="font-display text-2xl font-bold text-white mb-2">Natural DanceHall Production</h3>
            <p className="text-xs text-neutral-500 max-w-md">
              Partenaire fondateur du mouvement Kingstone Kongo NDP.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tiers */}
      <section className="px-6 md:px-12 py-16">
        <div className="max-w-7xl mx-auto">
          <GoldDivider className="mb-14" />
          <div className="text-center mb-12">
            <p className="text-[10px] tracking-[0.4em] uppercase text-gold mb-3">Niveaux de Partenariat</p>
            <h2 className="font-display text-3xl font-black text-white">Choisissez votre <em className="not-italic text-gold">niveau d'engagement</em></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {TIERS.map((t, i) => (
              <motion.div key={t.id} initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}}
                transition={{duration:0.7,delay:i*0.1}} viewport={{once:true}}
                className={`glass-card rounded-3xl p-7 relative overflow-hidden group hover:-translate-y-1 transition-all duration-400 cursor-pointer
                  ${form.tier===t.id ? "border-2":"border"}`}
                style={{borderColor:form.tier===t.id ? t.color : "rgba(255,255,255,0.06)"}}
                onClick={() => setForm(f=>({...f,tier:t.id}))}>
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 group-hover:opacity-20 transition-opacity"
                  style={{background:t.color, transform:"translate(50%,-50%)"}} />
                <div className="text-3xl mb-4">{t.icon}</div>
                <h3 className="font-bold text-white text-lg mb-1">{t.label}</h3>
                <p className="text-[10px] tracking-widest uppercase mb-4" style={{color:t.color}}>
                  À partir de {t.min.toLocaleString("fr-FR")} $
                </p>
                <ul className="space-y-2">
                  {t.perks.map(p => (
                    <li key={p} className="flex items-start gap-2 text-xs text-neutral-400">
                      <span className="mt-0.5 w-3 h-3 rounded-full flex-shrink-0 flex items-center justify-center"
                        style={{background:`${t.color}20`, border:`1px solid ${t.color}40`}}>
                        <span className="text-[6px]" style={{color:t.color}}>✓</span>
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
                {form.tier===t.id && (
                  <div className="absolute bottom-4 right-4">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{background:t.color}}>
                      <span className="text-black text-[8px] font-black">✓</span>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners type */}
      <section className="px-6 md:px-12 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon:<Building2 size={24}/>, title:"Entreprises & Groupes", desc:"RSE, investissement à impact, co-développement de projets sur les 12 piliers.", color:"#F5B041" },
              { icon:<Globe size={24}/>, title:"ONG & Institutions", desc:"Co-construction de programmes, accès terrain, partage de données et d'expertise.", color:"#10B981" },
              { icon:<Users size={24}/>, title:"Diaspora Organisée", desc:"Associations, collectifs, clubs d'investissement — mobilisez votre réseau.", color:"#8B5CF6" },
              { icon:<TrendingUp size={24}/>, title:"Fonds & Family Office", desc:"Investissement à impact à rendement coopératif. Reporting ESG complet.", color:"#3B82F6" },
              { icon:<Award size={24}/>, title:"Gouvernements & Bailleurs", desc:"Appui institutionnel, co-financement de piliers prioritaires, accords-cadres.", color:"#EC4899" },
              { icon:<HandshakeIcon size={24}/>, title:"Médias & Ambassadeurs", desc:"Relayez la vision, créez du contenu, participez aux missions terrain.", color:"#F59E0B" },
            ].map((c, i) => (
              <motion.div key={c.title} initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}}
                transition={{duration:0.6,delay:i*0.08}} viewport={{once:true}}
                className="glass-card rounded-2xl p-7 group hover:border-white/10 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                  style={{background:`${c.color}15`, border:`1px solid ${c.color}25`, color:c.color}}>
                  {c.icon}
                </div>
                <h3 className="font-semibold text-white text-sm mb-2">{c.title}</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="px-6 md:px-12 py-16">
        <div className="max-w-2xl mx-auto">
          <GoldDivider className="mb-14" />
          <div className="text-center mb-10">
            <p className="text-[10px] tracking-[0.4em] uppercase text-gold mb-3">Entrons en Contact</p>
            <h2 className="font-display text-3xl font-black text-white">Parlez-nous de votre <em className="not-italic text-gold">projet</em></h2>
          </div>

          {sent ? (
            <motion.div initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} className="glass-card rounded-2xl p-12 text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="font-display text-2xl font-bold text-white mb-3">Message envoyé !</h3>
              <p className="text-neutral-400 text-sm">Notre équipe vous répondra dans les 48h. Merci pour votre intérêt.</p>
            </motion.div>
          ) : (
            <motion.form initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} transition={{duration:0.8}} viewport={{once:true}}
              onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-neutral-600 mb-2">Organisation</label>
                  <input value={form.org} onChange={e=>setForm(f=>({...f,org:e.target.value}))} required
                    className="w-full glass-card rounded-xl px-4 py-3 text-white text-sm placeholder:text-neutral-700 border border-white/10 focus:border-gold/40 focus:outline-none bg-transparent"
                    placeholder="Votre organisation" />
                </div>
                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-neutral-600 mb-2">Nom & Prénom</label>
                  <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} required
                    className="w-full glass-card rounded-xl px-4 py-3 text-white text-sm placeholder:text-neutral-700 border border-white/10 focus:border-gold/40 focus:outline-none bg-transparent"
                    placeholder="Jean Ntumba" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] tracking-widest uppercase text-neutral-600 mb-2">Email</label>
                <input type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} required
                  className="w-full glass-card rounded-xl px-4 py-3 text-white text-sm placeholder:text-neutral-700 border border-white/10 focus:border-gold/40 focus:outline-none bg-transparent"
                  placeholder="contact@organisation.com" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-neutral-600 mb-2">Niveau souhaité</label>
                  <select value={form.tier} onChange={e=>setForm(f=>({...f,tier:e.target.value}))}
                    className="w-full glass-card rounded-xl px-4 py-3 text-white text-sm border border-white/10 focus:border-gold/40 focus:outline-none bg-black/80">
                    {TIERS.map(t => <option key={t.id} value={t.id} className="bg-black">{t.icon} {t.label} (≥ {t.min.toLocaleString()} $)</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-neutral-600 mb-2">Pilier prioritaire</label>
                  <select value={form.pillar} onChange={e=>setForm(f=>({...f,pillar:e.target.value}))}
                    className="w-full glass-card rounded-xl px-4 py-3 text-white text-sm border border-white/10 focus:border-gold/40 focus:outline-none bg-black/80">
                    <option value="general" className="bg-black">🌍 Fonds Général</option>
                    {PILLARS.map(p => <option key={p.slug} value={p.slug} className="bg-black">{p.icon} {p.label}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] tracking-widest uppercase text-neutral-600 mb-2">Message</label>
                <textarea value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))} rows={5}
                  className="w-full glass-card rounded-xl px-4 py-3 text-white text-sm placeholder:text-neutral-700 border border-white/10 focus:border-gold/40 focus:outline-none bg-transparent resize-none"
                  placeholder="Décrivez votre projet de partenariat, vos objectifs et la nature de votre organisation…" />
              </div>
              <button type="submit" disabled={sending}
                className="w-full py-4 rounded-full bg-gold text-black font-black text-sm tracking-widest uppercase hover:shadow-[0_0_40px_rgba(245,176,65,0.4)] transition-all duration-300 disabled:opacity-60">
                {sending ? "Envoi en cours…" : "Envoyer ma Demande"}
              </button>
              {error && <p className="text-xs text-red-400 text-center">{error}</p>}
            </motion.form>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 md:px-12 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl font-black text-white">Questions fréquentes</h2>
          </div>
          <div className="space-y-2">
            {FAQS.map((f, i) => (
              <motion.div key={i} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}}
                transition={{duration:0.5,delay:i*0.08}} viewport={{once:true}}>
                <button onClick={() => setOpenFaq(openFaq===i ? null : i)}
                  className="w-full glass-card rounded-xl px-6 py-4 text-left flex items-center justify-between gap-4 hover:border-white/10 transition-all duration-300">
                  <span className="text-sm text-white font-medium">{f.q}</span>
                  {openFaq===i ? <ChevronUp size={16} className="text-gold shrink-0"/> : <ChevronDown size={16} className="text-neutral-600 shrink-0"/>}
                </button>
                <motion.div initial={false} animate={{ height: openFaq===i ? "auto":0, opacity:openFaq===i?1:0 }}
                  className="overflow-hidden">
                  <div className="px-6 py-4 text-xs text-neutral-400 leading-relaxed">{f.a}</div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
