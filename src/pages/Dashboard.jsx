import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PILLARS, GLOBAL_GOAL } from "@/lib/config";
import { formatCurrency, pct } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useGlobalFundingTotals, usePillarFundingTotals } from "@/hooks/useFundingTotals";
import AnimatedCounter from "@/components/AnimatedCounter";
import GoldDivider from "@/components/GoldDivider";
import LoadingState from "@/components/states/LoadingState";
import EmptyState from "@/components/states/EmptyState";
import ErrorState from "@/components/states/ErrorState";
import { Download, TrendingUp, Award, Clock, ChevronRight, BarChart3 } from "lucide-react";

const STATUS_LABEL = { pending:"en attente", processing:"en cours", succeeded:"confirmé", failed:"échoué", refunded:"remboursé" };
const STATUS_COLOR = { pending:"#F5B041", processing:"#F5B041", succeeded:"#10B981", failed:"#EF4444", refunded:"#8B5CF6" };

export default function Dashboard() {
  const [tab, setTab] = useState("overview");
  const [session, setSession] = useState(undefined);
  const [profile, setProfile] = useState(null);
  const [contributions, setContributions] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const globalTotals = useGlobalFundingTotals();
  const { pillars: pillarTotals, loading: pillarsLoading, error: pillarsError, retry: retryPillars } = usePillarFundingTotals();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session ?? null));
  }, []);

  async function loadDashboardData(currentSession) {
    setLoading(true);
    setLoadError(null);
    try {
      const [{ data: prof, error: profErr }, { data: contribs, error: contribErr }, { data: rcpts, error: rcptErr }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", currentSession.user.id).single(),
        supabase.from("contributions").select("*").eq("user_id", currentSession.user.id).order("created_at", { ascending: false }),
        supabase.from("receipts").select("*, contributions!inner(user_id)").eq("contributions.user_id", currentSession.user.id),
      ]);
      // On vérifie chaque erreur individuellement : Promise.all ne rejette PAS quand une requête
      // Supabase échoue (elle renvoie juste { error } dans sa réponse), donc un simple try/catch
      // ne suffit pas à l'attraper — il faut lire error sur chaque résultat.
      const firstError = profErr || contribErr || rcptErr;
      if (firstError) throw firstError;
      setProfile(prof || null);
      setContributions(contribs || []);
      setReceipts(rcpts || []);
    } catch (err) {
      console.error("Erreur chargement du dashboard:", err);
      setLoadError(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (session === undefined) return; // en cours de vérification
    if (session === null) { window.location.href = "/auth"; return; }
    loadDashboardData(session);
  }, [session]);

  if (session === undefined || loading) {
    return <LoadingState fullScreen label="Chargement de votre espace..." />;
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <div className="max-w-md w-full">
          <ErrorState
            title="Impossible de charger votre espace"
            message="Vérifiez votre connexion et réessayez. Si le problème persiste, contactez-nous."
            onRetry={() => loadDashboardData(session)}
          />
        </div>
      </div>
    );
  }

  const confirmedContribs = contributions.filter(c => c.payment_status === "succeeded");
  const total = confirmedContribs.reduce((s,c) => s + Number(c.amount), 0);
  const pillarsSupported = new Set(confirmedContribs.map(c => c.pillar_slug)).size;

  const getPillar = (slug) => PILLARS.find(p=>p.slug===slug) || { label: slug, icon: "🌍", color: "#F5B041" };

  return (
    <div className="min-h-screen bg-black pt-24 pb-32 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:0.8}} className="mb-12">
          <p className="text-[10px] tracking-[0.4em] uppercase text-gold mb-3">Mon Espace</p>
          <div className="flex items-end justify-between">
            <h1 className="font-display text-4xl font-black text-white">
              Bienvenue,<br/><em className="not-italic text-gold">{profile?.full_name || "Coopérateur"}</em>
            </h1>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-gold/20 bg-gold/5">
              <span className="w-2 h-2 rounded-full animate-pulse" style={{background:"#10B981"}} />
              <span className="text-[10px] tracking-widest uppercase text-neutral-400">Compte actif</span>
            </div>
          </div>
        </motion.div>

        {/* Stats bento */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:0.1,duration:0.7}}
            className="glass-card rounded-2xl p-7 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10"
              style={{background:"#F5B041",transform:"translate(30%,-30%)"}} />
            <p className="text-[10px] tracking-widest uppercase text-neutral-600 mb-3">Total investi</p>
            <p className="font-display text-4xl font-black text-gold">
              $<AnimatedCounter value={total} duration={1800} />
            </p>
            <p className="text-xs text-neutral-600 mt-1">sur {confirmedContribs.length} contribution{confirmedContribs.length>1?"s":""} confirmée{confirmedContribs.length>1?"s":""}</p>
          </motion.div>

          <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:0.15,duration:0.7}}
            className="glass-card rounded-2xl p-7">
            <p className="text-[10px] tracking-widest uppercase text-neutral-600 mb-3">Piliers soutenus</p>
            <p className="font-display text-4xl font-black text-white">{pillarsSupported}</p>
            <p className="text-xs text-neutral-600 mt-1">sur 12 disponibles</p>
            <div className="flex gap-1 mt-3">
              {[...new Set(confirmedContribs.map(c=>c.pillar_slug))].map(slug => (
                <span key={slug} className="text-lg">{getPillar(slug).icon}</span>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:0.2,duration:0.7}}
            className="glass-card rounded-2xl p-7">
            <p className="text-[10px] tracking-widest uppercase text-neutral-600 mb-3">Statut</p>
            <div className="flex items-center gap-2 mb-2">
              <Award size={20} style={{color:"#F5B041"}} />
              <span className="font-bold text-gold text-lg">Coopérateur</span>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              {total >= 100 ? "Argent — accès au portail de reporting" : "Débutant — investissez 100$ pour devenir Argent"}
            </p>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {["overview","contributions","receipts","transparence"].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-full text-[10px] tracking-widest uppercase transition-all duration-300 ${
                tab===t ? "bg-gold text-black font-bold" : "glass-card text-neutral-500 hover:text-white"
              }`}>
              {t==="overview"?"Vue d'ensemble":t==="contributions"?"Historique":t==="receipts"?"Reçus":"Transparence"}
            </button>
          ))}
        </div>

        {tab === "overview" && (
          confirmedContribs.length === 0 ? (
            <div className="glass-card rounded-2xl p-10 text-center">
              <p className="text-neutral-400 text-sm mb-4">Vous n'avez pas encore de contribution confirmée.</p>
              <a href="/investir" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gold text-black font-bold text-xs tracking-widest uppercase">
                Faire ma première contribution →
              </a>
            </div>
          ) : (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-4">
            <div className="glass-card rounded-2xl p-7">
              <h3 className="font-semibold text-white mb-5 text-sm">Répartition par pilier</h3>
              <div className="space-y-4">
                {confirmedContribs.map(c => {
                  const p = getPillar(c.pillar_slug);
                  return (
                    <div key={c.id} className="flex items-center gap-4">
                      <span className="text-xl">{p.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-white">{p.label}</span>
                          <span className="text-xs font-bold" style={{color:p.color}}>{c.amount} {c.currency}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/5">
                          <div className="h-full rounded-full" style={{width:`${(c.amount/total)*100}%`,background:p.color}} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="glass-card rounded-2xl p-7 border-l-2 border-gold/40">
              <div className="flex items-start gap-4">
                <TrendingUp size={20} className="text-gold mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-semibold text-white text-sm mb-1">Merci pour votre engagement</h3>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    Votre investissement total de ${total} soutient directement {pillarsSupported} pilier{pillarsSupported>1?"s":""} du mouvement Kingstone Kongo.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
          )
        )}

        {tab === "contributions" && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-3">
            {contributions.length === 0 && (
              <EmptyState
                icon="🌱"
                title="Aucune contribution pour le moment"
                description="Vos futures contributions et réservations apparaîtront ici, avec leur statut en temps réel."
                actionLabel="Devenir coopérateur"
                actionHref="/investir"
              />
            )}
            {contributions.map((c) => {
              const p = getPillar(c.pillar_slug);
              return (
                <div key={c.id} className="glass-card rounded-xl px-6 py-4 flex items-center gap-4 hover:border-white/10 transition-all duration-300">
                  <span className="text-2xl">{p.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-semibold text-white">{p.label}</span>
                      {c.provider_ref && <span className="text-[10px] text-neutral-700">#{c.provider_ref.slice(-8)}</span>}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-neutral-600">
                      <Clock size={10} />
                      {new Date(c.created_at).toLocaleDateString("fr-FR",{day:"2-digit",month:"long",year:"numeric"})}
                      <span style={{color: STATUS_COLOR[c.payment_status]}}>• {STATUS_LABEL[c.payment_status]}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gold">{c.amount} {c.currency}</p>
                  </div>
                  <ChevronRight size={14} className="text-neutral-700" />
                </div>
              );
            })}
          </motion.div>
        )}

        {tab === "receipts" && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-3">
            {receipts.length === 0 && (
              <EmptyState
                icon="🧾"
                title="Aucun reçu disponible"
                description="Un reçu est généré automatiquement après chaque contribution confirmée — vous pourrez le télécharger en PDF ici."
              />
            )}
            {receipts.map(r => (
              <div key={r.id} className="glass-card rounded-xl px-6 py-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/5">
                  <Download size={16} className="text-neutral-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white font-medium">Reçu de contribution</p>
                  <p className="text-[10px] text-neutral-600">{new Date(r.generated_at).toLocaleDateString("fr-FR")}</p>
                </div>
                <a href={r.pdf_url} target="_blank" rel="noreferrer"
                  className="px-4 py-2 rounded-full border border-white/10 text-[10px] tracking-widest uppercase text-neutral-400 hover:text-gold hover:border-gold/30 transition-all duration-300">
                  Télécharger PDF
                </a>
              </div>
            ))}
          </motion.div>
        )}

        {tab === "transparence" && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-8">

            {(globalTotals.error || pillarsError) ? (
              <ErrorState
                title="Impossible de charger les jauges de transparence"
                message="Les totaux n'ont pas pu être récupérés — ce n'est pas que rien n'a été collecté, la requête a échoué. Réessayez."
                onRetry={() => { globalTotals.retry?.(); retryPillars?.(); }}
              />
            ) : (globalTotals.loading || pillarsLoading) ? (
              <LoadingState label="Chargement des jauges de transparence..." />
            ) : (
              <>
            <div className="flex items-start gap-3 p-4 rounded-xl border border-gold/15 bg-gold/5">
              <BarChart3 size={16} className="text-gold shrink-0 mt-0.5" />
              <p className="text-xs text-neutral-400 leading-relaxed">
                Ces jauges reflètent les contributions réellement confirmées sur l'ensemble de la plateforme,
                tous coopérateurs confondus — pas seulement les vôtres. Elles se mettent à jour en temps réel.
              </p>
            </div>

            {/* Fonds Général */}
            <div className="glass-card rounded-2xl p-7">
              <div className="flex items-end justify-between mb-3">
                <div>
                  <p className="text-[10px] tracking-widest uppercase text-neutral-600 mb-1">Fonds Général</p>
                  <p className="text-xl font-bold text-gold">
                    {formatCurrency(globalTotals.total_collected_usd)}
                    <span className="text-neutral-600 text-sm font-normal"> / {formatCurrency(GLOBAL_GOAL)}</span>
                  </p>
                </div>
                <span className="text-sm text-neutral-500">
                  {pct(globalTotals.total_collected_usd, GLOBAL_GOAL)}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-gold to-yellow-300 transition-all duration-700"
                  style={{width: `${pct(globalTotals.total_collected_usd, GLOBAL_GOAL)}%`}} />
              </div>
            </div>

            {/* Les 12 piliers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PILLARS.map(p => {
                const row = pillarTotals.find(t => t.slug === p.slug);
                const collected = row?.total_collected_usd || 0;
                const percentage = pct(collected, p.goal);
                return (
                  <div key={p.slug} className="glass-card rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{p.icon}</span>
                        <span className="text-xs font-semibold text-white">{p.label}</span>
                      </div>
                      <span className="text-[10px] text-neutral-600">{percentage}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden mb-2">
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{width: `${percentage}%`, background: p.color}} />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-neutral-600">
                      <span>{formatCurrency(collected)}</span>
                      <span>Objectif {formatCurrency(p.goal)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
              </>
            )}
          </motion.div>
        )}

        {/* CTA */}
        <motion.div initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} transition={{duration:0.8}} viewport={{once:true}}
          className="mt-10 glass-card rounded-2xl p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none"
            style={{background:"radial-gradient(circle at 50% 0%, rgba(245,176,65,0.06), transparent 60%)"}} />
          <p className="text-sm text-neutral-400 mb-4 relative z-10">Augmentez votre impact — chaque dollar compte</p>
          <a href="/investir"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gold text-black font-bold text-xs tracking-widest uppercase hover:shadow-[0_0_30px_rgba(245,176,65,0.3)] transition-all duration-300 relative z-10">
            Nouvelle contribution →
          </a>
        </motion.div>
      </div>
    </div>
  );
}