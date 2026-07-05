import { motion } from "framer-motion";
import { Check } from "lucide-react";

/**
 * État "réussite" — à utiliser après une action confirmée avec succès
 * (contribution enregistrée, profil mis à jour, email envoyé...).
 *
 * Usage :
 *   if (submitted) return <SuccessState title="Réservation enregistrée !"
 *     description="Nous vous contacterons dès l'ouverture." actionLabel="Mon Dashboard" actionHref="/dashboard" />;
 */
export default function SuccessState({
  title = "C'est fait !",
  description,
  actionLabel,
  actionHref,
  onAction,
  secondaryLabel,
  onSecondary,
}) {
  return (
    <div className="text-center py-8">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.15, stiffness: 120 }}
        className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-7"
        style={{ background: "radial-gradient(circle, rgba(16,185,129,0.3), rgba(16,185,129,0.05))", border: "2px solid #10B981" }}>
        <Check size={34} style={{ color: "#10B981" }} />
      </motion.div>
      <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        className="font-display text-2xl font-black text-white mb-3">
        {title}
      </motion.h2>
      {description && (
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="text-neutral-400 text-sm max-w-sm mx-auto mb-8">
          {description}
        </motion.p>
      )}
      {(actionLabel || secondaryLabel) && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
          className="flex flex-col sm:flex-row gap-4 justify-center">
          {actionLabel && (
            actionHref ? (
              <a href={actionHref}
                className="px-8 py-4 rounded-full bg-gold text-black font-bold text-xs tracking-widest uppercase hover:shadow-[0_0_30px_rgba(245,176,65,0.3)] transition-all duration-300">
                {actionLabel}
              </a>
            ) : (
              <button onClick={onAction}
                className="px-8 py-4 rounded-full bg-gold text-black font-bold text-xs tracking-widest uppercase hover:shadow-[0_0_30px_rgba(245,176,65,0.3)] transition-all duration-300">
                {actionLabel}
              </button>
            )
          )}
          {secondaryLabel && (
            <button onClick={onSecondary}
              className="px-8 py-4 rounded-full border border-white/10 text-xs text-neutral-400 hover:text-white tracking-widest uppercase transition-colors">
              {secondaryLabel}
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
}