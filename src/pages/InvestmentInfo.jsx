import { motion } from "framer-motion";
import { Lock, TrendingUp, RotateCcw, ShieldCheck } from "lucide-react";
import { LOCK_PERIOD_YEARS, MIN_CONTRIBUTION, GLOBAL_GOAL } from "@/lib/config";
import { formatCurrency } from "@/lib/utils";
import GoldDivider from "@/components/GoldDivider";

const STEPS = [
  {
    icon: <Lock size={18} />,
    title: "1. Votre capital est bloqué 5 ans",
    text: `Dès que votre contribution est confirmée, votre capital est investi dans le Fonds Général puis affecté au pilier de votre choix pour une durée de ${LOCK_PERIOD_YEARS} ans. Ce blocage permet au projet de financer des infrastructures de long terme (agriculture, santé, énergie...) sans retrait anticipé qui fragiliserait les piliers.`,
  },
  {
    icon: <TrendingUp size={18} />,
    title: "2. Un rendement vous est versé chaque année",
    text: "Tant que votre capital reste investi, vous percevez chaque année un rendement calculé sur le montant que vous avez placé. Ce rendement varie selon le pilier soutenu et la performance de l'année — il vous est communiqué avant chaque campagne et versé automatiquement sur le moyen de paiement que vous avez utilisé pour investir.",
  },
  {
    icon: <RotateCcw size={18} />,
    title: "3. Au bout des 5 ans, vous récupérez votre capital",
    text: "À l'échéance des 5 ans, vous récupérez l'intégralité de votre capital de départ, en plus des rendements déjà perçus chaque année. Vous pouvez alors soit retirer votre capital, soit le réinvestir pour un nouveau cycle de 5 ans.",
  },
  {
    icon: <ShieldCheck size={18} />,
    title: "4. Le Fonds Général, point d'entrée obligatoire",
    text: `Personne ne peut investir directement dans un pilier spécifique sans passer d'abord par le Fonds Général (objectif : ${formatCurrency(GLOBAL_GOAL)}) — c'est lui qui garantit la mutualisation du risque et la gouvernance coopérative entre tous les coopérateurs, avant répartition vers les 12 piliers.`,
  },
];

export default function InvestmentInfo() {
  return (
    <div className="min-h-screen bg-black pt-28 pb-32 px-6 md:px-12">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:0.8}} className="text-center mb-16">
          <p className="text-[10px] tracking-[0.4em] uppercase text-gold mb-4">Comprendre votre investissement</p>
          <h1 className="font-display text-4xl md:text-5xl font-black text-white mb-5">
            Comment fonctionne <em className="not-italic text-gold">votre contribution</em>
          </h1>
          <p className="text-neutral-400 text-sm max-w-xl mx-auto leading-relaxed">
            Kingstone Kongo est une plateforme d'investissement coopératif, pas une plateforme de don.
            Voici, en toute transparence, ce qui se passe entre le moment où vous investissez et le moment
            où vous récupérez votre capital.
          </p>
        </motion.div>

        <GoldDivider className="mb-16" />

        <div className="space-y-6 mb-16">
          {STEPS.map((s, i) => (
            <motion.div key={s.title} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}}
              transition={{duration:0.6, delay:i*0.1}} viewport={{once:true}}
              className="glass-card rounded-2xl p-7 flex gap-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-gold/10 border border-gold/25 text-gold">
                {s.icon}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white mb-2">{s.title}</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">{s.text}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Exemple chiffré */}
        <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} transition={{duration:0.6}} viewport={{once:true}}
          className="glass-card rounded-2xl p-8 mb-16 border border-gold/15">
          <p className="text-[10px] tracking-[0.3em] uppercase text-gold mb-4">Exemple simplifié</p>
          <p className="text-sm text-neutral-300 leading-relaxed">
            Vous investissez <strong className="text-white">{formatCurrency(MIN_CONTRIBUTION)}</strong> dans le pilier Agriculture.
            Chaque année pendant {LOCK_PERIOD_YEARS} ans, vous recevez un rendement calculé sur ces {formatCurrency(MIN_CONTRIBUTION)}
            (le taux exact dépend de la performance du pilier cette année-là et vous est communiqué à l'avance).
            À la fin de la 5ᵉ année, vous récupérez vos {formatCurrency(MIN_CONTRIBUTION)} de capital de départ,
            en plus de tous les rendements annuels déjà perçus entre-temps.
          </p>
          <p className="text-[11px] text-neutral-600 mt-4">
            Le taux de rendement précis par pilier sera publié ici avant l'ouverture officielle des contributions.
          </p>
        </motion.div>

        <div className="text-center">
          <a href="/investir"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-gold text-black font-bold text-xs tracking-widest uppercase hover:shadow-[0_0_30px_rgba(245,176,65,0.3)] transition-all duration-300">
            ← Retour à Devenir Coopérateur
          </a>
        </div>
      </div>
    </div>
  );
}