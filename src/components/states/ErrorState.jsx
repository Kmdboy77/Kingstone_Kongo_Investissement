import { motion } from "framer-motion";
import { AlertTriangle, RotateCw } from "lucide-react";

/**
 * État "échec" — à utiliser quand une requête a RÉELLEMENT échoué (erreur réseau,
 * Supabase down, RLS qui bloque, etc.). Ne JAMAIS laisser une erreur silencieuse
 * afficher "0" ou une liste vide à la place : l'utilisateur doit savoir que quelque
 * chose s'est mal passé, pas croire qu'il n'a "rien".
 *
 * Usage :
 *   if (error) return <ErrorState message={error.message} onRetry={reload} />;
 */
export default function ErrorState({
  title = "Une erreur est survenue",
  message = "Impossible de charger ces données pour le moment. Réessayez dans quelques instants.",
  onRetry,
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center text-center gap-3 py-16 px-6 rounded-2xl border border-red-500/20 bg-red-500/5">
      <AlertTriangle size={26} className="text-red-400" />
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="text-xs text-neutral-500 max-w-sm">{message}</p>
      {onRetry && (
        <button onClick={onRetry}
          className="mt-2 flex items-center gap-2 px-5 py-2.5 rounded-full border border-red-500/30 text-red-300 text-xs font-bold tracking-widest uppercase hover:bg-red-500/10 transition-all duration-300">
          <RotateCw size={13} /> Réessayer
        </button>
      )}
    </motion.div>
  );
}