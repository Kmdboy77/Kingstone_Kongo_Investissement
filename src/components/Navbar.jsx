import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut } from "lucide-react";
import { SITE1_URL } from "@/lib/config";
import UserAvatar from "@/components/UserAvatar";

const LOGO = "/images/LogoKingstoneKongo.PNG";

export default function Navbar({ user, profile, onLogout }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { label: "Accueil", href: "/" },
    { label: "Investir", href: "/investir" },
    { label: "Partenariats", href: "/partenariat" },
    { label: "Mon Espace", href: "/dashboard" },
  ];

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -80 }} animate={{ y: 0 }}
        transition={{ duration: 0.7, ease: [0.22,1,0.36,1] }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-black/90 backdrop-blur-xl border-b border-white/5" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
          <a href={SITE1_URL} className="flex items-center gap-3 group">
            <img src={LOGO} alt="KK" className="w-9 h-9 rounded-full object-contain" />
            <div>
              <span className="text-xs tracking-[0.25em] uppercase text-white group-hover:text-gold transition-colors">Kingstone Kongo</span>
              <p className="text-[10px] text-neutral-600 tracking-widest uppercase">Plateforme d'Investissement</p>
            </div>
          </a>

          {/* Avatar/Rejoindre + hamburger — toujours visibles, à toutes les tailles d'écran */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <UserAvatar user={user} profile={profile} onClick={() => { window.location.href = "/dashboard"; }} />
                <button onClick={onLogout}
                  className="p-2 rounded-full border border-white/10 hover:border-gold/40 hover:text-gold text-neutral-500 transition-all duration-300">
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <a href="/auth"
                className="px-5 py-2 rounded-full bg-gold text-black text-xs font-bold tracking-widest uppercase hover:bg-gold-dim transition-all duration-300 magnetic-btn">
                Rejoindre
              </a>
            )}

            {/* Hamburger — ouvre/ferme le menu plein écran ci-dessous */}
            <button onClick={() => setMenuOpen(v => !v)}
              aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              className="p-2 rounded-full border border-white/10 hover:border-gold/40 hover:text-gold text-neutral-300 transition-all duration-300">
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Menu plein écran — remplace l'ancienne rangée de liens */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8">
            {links.map((l, i) => (
              <motion.a key={l.label} href={l.href} onClick={() => setMenuOpen(false)}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="text-lg uppercase tracking-[0.2em] text-neutral-300 hover:text-gold transition-colors">
                {l.label}
              </motion.a>
            ))}

            {!user && (
              <motion.a href="/auth" onClick={() => setMenuOpen(false)}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: links.length * 0.08 }}
                className="mt-4 px-8 py-3 text-sm uppercase tracking-[0.15em] bg-gold text-black font-bold rounded-full">
                Rejoindre
              </motion.a>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}