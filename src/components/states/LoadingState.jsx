import { motion } from "framer-motion";

/**
 * État "chargement" — à utiliser pendant qu'on attend une réponse de Supabase/Stripe.
 *
 * Usage :
 *   if (loading) return <LoadingState label="Chargement de vos contributions..." />;
 *
 * `fullScreen` : true pour une page entière (ex: Dashboard au premier chargement),
 * false pour un simple bloc à l'intérieur d'une page (ex: un onglet, une liste).
 */
export default function LoadingState({ label = "Chargement...", fullScreen = false }) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <div className="w-8 h-8 border-2 border-white/10 border-t-gold rounded-full animate-spin" />
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        className="text-xs text-neutral-500 tracking-wide">
        {label}
      </motion.p>
    </div>
  );

  if (fullScreen) {
    return <div className="min-h-screen bg-black flex items-center justify-center">{content}</div>;
  }
  return content;
}