import { motion } from "framer-motion";
import { CONTACT_EMAIL, SITE1_URL } from "@/lib/config";
const LOGO = "/images/LogoKingstoneKongo.PNG";

export default function Footer() {
  const cols = [
    { title:"Plateforme", links:[{l:"Investir",h:"/investir"},{l:"Partenariats",h:"/partenariat"},{l:"Mon Dashboard",h:"/dashboard"},{l:"Sécurité",h:"/securite"}] },
    { title:"Projet", links:[{l:"Vision",h:`${SITE1_URL}#vision`},{l:"12 Piliers",h:`${SITE1_URL}#piliers`},{l:"Modèle Coopératif",h:`${SITE1_URL}#modele`},{l:"Feuille de Route",h:`${SITE1_URL}#roadmap`}] },
    { title:"Contact", links:[{l:CONTACT_EMAIL,h:`mailto:${CONTACT_EMAIL}`},{l:"Presse & Médias",h:`mailto:${CONTACT_EMAIL}`},{l:"Mentions légales",h:"/legal"},{l:"Politique de confidentialité",h:"/legal"}] },
  ];

  return (
    <footer className="relative border-t border-white/5 mt-32">
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <img src={LOGO} alt="KK" className="w-9 h-9 rounded-full object-contain" />
              <div>
                <p className="text-sm font-semibold text-white">Kingstone Kongo</p>
                <p className="text-[10px] text-neutral-600 tracking-widest uppercase">L'Audace du Changement</p>
              </div>
            </div>
            <p className="text-neutral-500 text-xs leading-relaxed mb-6">
              Plateforme d'investissement coopératif pour la renaissance de la République Démocratique du Congo.
            </p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-DEFAULT animate-pulse" style={{background:"#10B981"}} />
              <span className="text-[10px] text-neutral-500 tracking-widest uppercase">Paiements sécurisés SSL</span>
            </div>
          </div>
          {cols.map(c => (
            <div key={c.title}>
              <h4 className="text-[10px] tracking-[0.3em] uppercase text-neutral-600 mb-5 font-medium">{c.title}</h4>
              <ul className="space-y-3">
                {c.links.map(lk => (
                  <li key={lk.l}><a href={lk.h}
                    className="text-xs text-neutral-400 hover:text-gold transition-colors leading-relaxed break-all">{lk.l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-neutral-700 tracking-widest">
            © 2025–2026 Natural Dancehall Production & Kingstone Kongo NDP. Tous droits réservés.
          </p>
          <div className="flex items-center gap-6">
            <a href="/legal" className="text-[10px] tracking-widest text-neutral-700 hover:text-gold uppercase transition-colors">Politique de confidentialité</a>
            <a href="/legal#cgu" className="text-[10px] tracking-widest text-neutral-700 hover:text-gold uppercase transition-colors">CGU</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
