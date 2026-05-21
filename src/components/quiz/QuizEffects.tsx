"use client";

import { AnimatePresence, motion } from "framer-motion";

interface QuizEffectsProps {
  flash: boolean;
  shake: boolean;
  wild: boolean;
  adlibLabel?: string;
}

export function QuizEffects({ flash, shake, wild, adlibLabel }: QuizEffectsProps) {
  return (
    <>
      <AnimatePresence>
        {flash && (
          <motion.div
            className="pointer-events-none fixed inset-0 z-[100] bg-astro-orange/30"
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {wild && (
          <motion.div
            className="pointer-events-none fixed inset-0 z-[99] bg-gradient-to-br from-astro-orange/40 via-astro-purple/40 to-astro-cyan/40"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            style={{ animation: "wild-colors 1.5s ease-in-out infinite" }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {adlibLabel && (
          <motion.p
            className="pointer-events-none fixed bottom-24 left-1/2 z-[101] -translate-x-1/2 font-display text-2xl font-bold text-astro-orange drop-shadow-neon"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {adlibLabel}
          </motion.p>
        )}
      </AnimatePresence>

      {shake && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[98]"
          animate={{ x: [0, -6, 6, -4, 4, 0] }}
          transition={{ duration: 0.4 }}
        />
      )}
    </>
  );
}
