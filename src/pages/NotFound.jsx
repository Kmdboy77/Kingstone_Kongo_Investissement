import { motion } from "framer-motion";
export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-center px-6">
      <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:0.8}}>
        <p className="font-display text-[120px] font-black text-gold/10 leading-none select-none">404</p>
        <h1 className="font-display text-3xl font-black text-white -mt-4 mb-4">Page introuvable</h1>
        <p className="text-neutral-500 text-sm mb-8 max-w-sm mx-auto">Cette page n'existe pas ou a été déplacée.</p>
        <a href="/" className="inline-flex px-8 py-3 rounded-full bg-gold text-black font-bold text-xs tracking-widest uppercase hover:shadow-[0_0_30px_rgba(245,176,65,0.3)] transition-all duration-300">
          Retour à l'accueil →
        </a>
      </motion.div>
    </div>
  );
}
