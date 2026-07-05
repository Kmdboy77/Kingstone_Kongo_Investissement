import { motion } from "framer-motion";

/**
 * État "vide" — à utiliser quand la requête a RÉUSSI mais qu'il n'y a simplement
 * rien à afficher (ex: aucune contribution pour l'instant). Différent de l'état
 * d'erreur : ici tout va bien, il n'y a juste pas encore de contenu.
 *
 * Usage :
 *   if (!loading && !error && contributions.length === 0)
 *     return <EmptyState icon="📭" title="Aucune contribution pour l'instant"
 *              description="Vos futures contributions apparaîtront ici."
 *              actionLabel="Devenir coopérateur" actionHref="/investir" />;
 */
export default function EmptyState({
  icon = "📭",
  title = "Rien à afficher pour l'instant",
  description,
  actionLabel,
  actionHref,
  onAction,
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center text-center gap-3 py-16 px-6 rounded-2xl border border-dashed border-white/10">
      <span className="text-3xl opacity-70">{icon}</span>
      <p className="text-sm font-semibold text-white">{title}</p>
      {description && <p className="text-xs text-neutral-500 max-w-sm">{description}</p>}
      {actionLabel && (actionHref || onAction) && (
        actionHref ? (
          <a href={actionHref}
            className="mt-2 px-5 py-2.5 rounded-full bg-gold text-black text-xs font-bold tracking-widest uppercase hover:shadow-[0_0_20px_rgba(245,176,65,0.3)] transition-all duration-300">
            {actionLabel}
          </a>
        ) : (
          <button onClick={onAction}
            className="mt-2 px-5 py-2.5 rounded-full bg-gold text-black text-xs font-bold tracking-widest uppercase hover:shadow-[0_0_20px_rgba(245,176,65,0.3)] transition-all duration-300">
            {actionLabel}
          </button>
        )
      )}
    </motion.div>
  );
}