import { useState } from "react";
import { motion } from "framer-motion";
import MiniMarkdown from "@/components/MiniMarkdown";
import { MENTIONS_LEGALES, CGU, CONFIDENTIALITE, COOKIES } from "@/lib/legalContent";

const TABS = [
  { id: "mentions", label: "Mentions légales", content: MENTIONS_LEGALES },
  { id: "cgu", label: "CGU", content: CGU },
  { id: "confidentialite", label: "Confidentialité", content: CONFIDENTIALITE },
  { id: "cookies", label: "Cookies", content: COOKIES },
];

export default function Legal() {
  const [active, setActive] = useState("mentions");
  const tab = TABS.find(t => t.id === active);

  return (
    <div className="min-h-screen bg-black pt-28 pb-32 px-6 md:px-12">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:0.8}}>
          <p className="text-[10px] tracking-[0.4em] uppercase text-gold mb-4">Documents Légaux</p>
          <h1 className="font-display text-4xl font-black text-white mb-3">Mentions légales & Confidentialité</h1>
          <p className="text-[11px] text-neutral-600 mb-10">
            Kingstone Kongo NDP est un projet porté par Natural DanceHall Production, association loi 1901.
            Dernière mise à jour : 5 juillet 2026.
          </p>

          {/* Onglets */}
          <div className="flex flex-wrap gap-2 mb-10">
            {TABS.map(t => (
              <button key={t.id} id={t.id} onClick={() => setActive(t.id)}
                className={`px-4 py-2 rounded-full text-[11px] tracking-wide transition-all duration-300 ${
                  active === t.id ? "bg-gold text-black font-bold" : "glass-card text-neutral-500 hover:text-white border border-white/10"
                }`}>
                {t.label}
              </button>
            ))}
          </div>

          <motion.div key={active} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:0.4}}>
            <MiniMarkdown text={tab.content} />
          </motion.div>

          <div className="mt-12 pt-8 border-t border-white/5">
            <p className="text-[10px] text-neutral-700 leading-relaxed">
              ⚠️ Ces documents reflètent le fonctionnement actuel de la plateforme (contributions sous forme de dons,
              sans promesse de rendement financier). Toute évolution du modèle économique nécessite une révision
              de ces textes par un professionnel du droit avant mise en application.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
