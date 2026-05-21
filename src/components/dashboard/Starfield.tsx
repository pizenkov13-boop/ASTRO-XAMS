"use client";

import { motion } from "framer-motion";

const STARS = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 1,
  delay: Math.random() * 2,
}));

export function Starfield() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {STARS.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
          }}
          animate={{ opacity: [0.2, 0.9, 0.2] }}
          transition={{
            duration: 2 + Math.random() * 2,
            delay: star.delay,
            repeat: Infinity,
          }}
        />
      ))}
    </div>
  );
}
