import { motion } from "framer-motion";
export default function GoldDivider({ className = "" }) {
  return (
    <motion.div className={`flex items-center gap-4 ${className}`}
      initial={{ opacity:0, scaleX:0 }} whileInView={{ opacity:1, scaleX:1 }}
      transition={{ duration:0.8 }} viewport={{ once:true }}>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="w-1.5 h-1.5 rounded-full bg-gold" />
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
    </motion.div>
  );
}
