import { useMemo } from "react";
import { motion } from "framer-motion";

export default function ParticleField({ count = 20, className = "" }) {
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 0.5,
      dur: Math.random() * 20 + 15,
      delay: Math.random() * 8,
      opacity: Math.random() * 0.25 + 0.08,
      color: Math.random() > 0.6 ? "#F5B041" : Math.random() > 0.5 ? "#10B981" : "#3B82F6",
    })), [count]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((p) => (
        <motion.div key={p.id}
          style={{ position:"absolute", left:`${p.x}%`, top:`${p.y}%`, width:p.size, height:p.size, borderRadius:"50%",
            backgroundColor:p.color, boxShadow:`0 0 ${p.size*5}px ${p.color}` }}
          animate={{ y:[0,-60,0], x:[0,20,0], opacity:[0, p.opacity, 0] }}
          transition={{ duration:p.dur, delay:p.delay, repeat:Infinity, ease:"easeInOut" }}
        />
      ))}
    </div>
  );
}
