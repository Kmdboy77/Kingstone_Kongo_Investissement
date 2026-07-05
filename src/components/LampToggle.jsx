import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Petites particules de poussière dans le faisceau — génération pseudo-aléatoire stable
// (seed fixe) pour ne pas recalculer les positions à chaque re-render.
function useDustParticles(count = 18) {
  return useMemo(() => {
    let seed = 42;
    const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: 150 + rand() * 230,          // large de 150 à 380 (dans l'emprise du faisceau)
      yStart: 140 + rand() * 380,      // réparties sur toute la hauteur du faisceau
      size: 1 + rand() * 1.8,
      duration: 4 + rand() * 5,
      delay: rand() * 4,
      drift: (rand() - 0.5) * 30,
    }));
  }, [count]);
}

export default function RealisticLampToggle({ on, onToggle }) {
  const [isPulling, setIsPulling] = useState(false);
  const dust = useDustParticles(18);

  const handlePull = () => {
    setIsPulling(true);
    onToggle();
    setTimeout(() => setIsPulling(false), 500);
  };

  const metalColor = on ? "#0d0d0d" : "#1f1f1f";
  const shadeInner = on ? "#FFFDF6" : "#2a2a2a";

  return (
    <motion.div
      className="relative w-full h-full flex items-center justify-center overflow-hidden select-none"
      animate={{ backgroundColor: on ? "#120d04" : "#050505" }}
      transition={{ duration: 0.9, ease: "easeInOut" }}
    >
      {/* Éclairage ambiant de la pièce — remplit tout le cadre, pas juste une zone autour de la lampe */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: on ? 1 : 0 }}
        transition={{ duration: 0.9, ease: "easeInOut" }}
        style={{
          background: `
            radial-gradient(ellipse 90% 60% at 50% 15%, rgba(245,176,65,0.14), transparent 60%),
            radial-gradient(ellipse 120% 70% at 50% 100%, rgba(245,176,65,0.22), transparent 70%),
            radial-gradient(ellipse 140% 90% at 50% 60%, rgba(245,176,65,0.08), transparent 75%)
          `,
        }}
      />

      <svg
        viewBox="0 0 550 650"
        className="w-full h-full max-w-[440px] relative z-10"
        style={{ overflow: "visible" }}
      >
        <defs>
          <filter id="blurSoft" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
          <filter id="blurMed" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="28" />
          </filter>
          <filter id="blurWide" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="55" />
          </filter>
          <filter id="blurHuge" x="-120%" y="-120%" width="340%" height="340%">
            <feGaussianBlur stdDeviation="90" />
          </filter>

          {/* Coeur de l'ampoule, quasi blanc */}
          <radialGradient id="bulbCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="35%" stopColor="#FFF4D6" stopOpacity="0.95" />
            <stop offset="70%" stopColor="#F5B041" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#F5B041" stopOpacity="0" />
          </radialGradient>

          {/* Réflexion diffuse au sol */}
          <radialGradient id="floorGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F5B041" stopOpacity="0.55" />
            <stop offset="45%" stopColor="#F5B041" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#F5B041" stopOpacity="0" />
          </radialGradient>

          {/* Dégradé vertical du faisceau : lumineux près de la source, s'estompe en chemin,
              puis une remontée d'intensité juste avant le sol pour simuler l'impact lumineux. */}
          <linearGradient id="beamFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#F5B041" stopOpacity="1" />
            <stop offset="35%"  stopColor="#F5B041" stopOpacity="0.45" />
            <stop offset="70%"  stopColor="#F5B041" stopOpacity="0.15" />
            <stop offset="92%"  stopColor="#F5B041" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#F5B041" stopOpacity="0.55" />
          </linearGradient>

          {/* Impact au sol : coeur net et lumineux, entouré d'un halo plus doux */}
          <radialGradient id="floorImpact" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFE9B3" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#F5B041" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#F5B041" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ================= ZONE DE LUMIÈRE (visible uniquement si allumée) ================= */}
        <AnimatePresence>
          {on && (
            <motion.g
              key="light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              style={{ pointerEvents: "none" }}
            >
              {/* Halo diffus derrière la barre — très large, très flou */}
              <ellipse cx="265" cy="115" rx="220" ry="80" fill="#F5B041" opacity="0.10" filter="url(#blurHuge)" />
              <ellipse cx="265" cy="115" rx="140" ry="48" fill="#F5B041" opacity="0.16" filter="url(#blurWide)" />

              {/* Faisceau volumétrique — couches floues pour le volume, PUIS un triangle net par-dessus
                  pour que la forme se lise clairement, comme une vraie lumière projetée. */}
              <path d="M 205,123 L 325,123 L 470,555 L 60,555 Z" fill="url(#beamFade)" opacity="0.20" filter="url(#blurHuge)" />
              <path d="M 212,123 L 318,123 L 430,555 L 100,555 Z" fill="url(#beamFade)" opacity="0.35" filter="url(#blurWide)" />
              <path d="M 220,123 L 310,123 L 385,555 L 145,555 Z" fill="url(#beamFade)" opacity="0.55" filter="url(#blurMed)" />
              <path d="M 226,123 L 304,123 L 355,555 L 175,555 Z" fill="url(#beamFade)" opacity="0.7" filter="url(#blurSoft)" />
              <path d="M 232,123 L 298,123 L 335,555 L 195,555 Z" fill="url(#beamFade)" opacity="0.85" />

              {/* Impact + reflet au sol — large, pour donner l'impression que la lumière
                  couvre toute la pièce, pas juste un petit point sous la lampe. */}
              <ellipse cx="265" cy="558" rx="380" ry="75" fill="url(#floorGlow)" filter="url(#blurHuge)" />
              <ellipse cx="265" cy="557" rx="260" ry="45" fill="url(#floorGlow)" filter="url(#blurWide)" />
              <ellipse cx="265" cy="555" rx="150" ry="24" fill="url(#floorImpact)" filter="url(#blurMed)" />
              <ellipse cx="265" cy="553" rx="80" ry="12" fill="#FFF4D6" opacity="0.65" filter="url(#blurSoft)" />

              {/* Coeur incandescent juste sous la barre */}
              <ellipse cx="265" cy="124" rx="68" ry="9" fill="url(#bulbCore)" filter="url(#blurSoft)" />
              <ellipse cx="265" cy="123" rx="34" ry="5" fill="#FFFFFF" opacity="0.9" />

              {/* Poussière en suspension dans le faisceau */}
              {dust.map(d => (
                <motion.circle
                  key={d.id}
                  cx={d.x}
                  r={d.size}
                  fill="#FFE9B3"
                  initial={{ cy: d.yStart, opacity: 0 }}
                  animate={{
                    cy: [d.yStart, d.yStart - 40, d.yStart],
                    cx: [d.x, d.x + d.drift, d.x],
                    opacity: [0, 0.35, 0],
                  }}
                  transition={{ duration: d.duration, delay: d.delay, repeat: Infinity, ease: "easeInOut" }}
                />
              ))}
            </motion.g>
          )}
        </AnimatePresence>

        {/* ================= STRUCTURE DE LA LAMPE ================= */}
        <g id="lampStructure">
          {/* Pied vertical */}
          <rect x="261" y="120" width="8" height="430" rx="2" fill={metalColor} style={{ transition: "fill 0.6s ease" }} />

          {/* Base au sol */}
          <rect x="215" y="545" width="100" height="12" rx="5" fill={metalColor} style={{ transition: "fill 0.6s ease" }} />
          <rect x="220" y="555" width="90" height="4" rx="2" fill="#000000" opacity="0.6" />

          {/* Abat-jour : une simple barre plate et fine, comme la base — pas de dôme/ellipse */}
          <rect x="190" y="108" width="150" height="13" rx="6.5" fill={metalColor} style={{ transition: "fill 0.6s ease" }} />
          {/* Fine bande lumineuse sous la barre, qui s'allume */}
          <rect x="196" y="119" width="138" height="4" rx="2" fill={shadeInner} style={{ transition: "fill 0.6s ease" }} />
        </g>

        {/* ================= CORDE (interrupteur) ================= */}
        <motion.g
          onClick={handlePull}
          className="cursor-pointer"
          whileHover={{ scale: 1.02 }}
          style={{ originX: "325px", originY: "120px" }}
        >
          <motion.line
            x1="325" y1="120" x2="325"
            animate={{ y2: isPulling ? [200, 234, 214, 224, 218, 220] : 200 }}
            transition={{ duration: isPulling ? 0.7 : 0.4, ease: "easeOut", times: isPulling ? [0, 0.25, 0.5, 0.7, 0.85, 1] : undefined }}
            stroke="#2f2f2f"
            strokeWidth="2.5"
          />
          <motion.g
            animate={{ y: isPulling ? [0, 34, 14, 24, 18, 20] : 0 }}
            transition={{ duration: isPulling ? 0.7 : 0.4, ease: "easeOut", times: isPulling ? [0, 0.25, 0.5, 0.7, 0.85, 1] : undefined }}
          >
            <rect x="319" y="202" width="12" height="22" rx="4" fill="#000000" opacity="0.4" />
            <rect x="319" y="200" width="12" height="22" rx="4" fill="#E59866" />
            <rect x="321" y="202" width="3" height="18" rx="1" fill="#FFF3D1" opacity="0.4" />
          </motion.g>
          <rect x="300" y="115" width="50" height="120" fill="transparent" />
        </motion.g>
      </svg>
    </motion.div>
  );
}