"use client";

import { useCallback, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale } from "@/lib/i18n/context";
import type { VisionImageItem } from "./VisionMosaic";

interface VisionLightboxProps {
  images: VisionImageItem[];
  index: number | null;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

export function VisionLightbox({
  images,
  index,
  onClose,
  onIndexChange,
}: VisionLightboxProps) {
  const { t } = useLocale();
  const open = index !== null && images.length > 0;
  const current = open ? images[index!] : null;

  const goPrev = useCallback(() => {
    if (!open || index === null) return;
    onIndexChange((index - 1 + images.length) % images.length);
  }, [open, index, images.length, onIndexChange]);

  const goNext = useCallback(() => {
    if (!open || index === null) return;
    onIndexChange((index + 1) % images.length);
  }, [open, index, images.length, onIndexChange]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose, goPrev, goNext]);

  return (
    <AnimatePresence>
      {open && current && (
        <motion.div
          key="vision-lightbox"
          className="fixed inset-0 z-[100] flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label={`${current.label} — image ${index! + 1} of ${images.length}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
        >
          <button
            type="button"
            className="absolute inset-0 cursor-zoom-out bg-black/92 backdrop-blur-sm"
            aria-label={t("vision.lightbox.close")}
            onClick={onClose}
          />

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/20 bg-black/50 p-3 text-white/90 transition hover:border-astro-orange/60 hover:bg-black/80 hover:text-astro-orange md:left-6 md:p-4"
                aria-label={t("vision.lightbox.prev")}
              >
                <span className="block text-2xl leading-none md:text-3xl">‹</span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/20 bg-black/50 p-3 text-white/90 transition hover:border-astro-orange/60 hover:bg-black/80 hover:text-astro-orange md:right-6 md:p-4"
                aria-label={t("vision.lightbox.next")}
              >
                <span className="block text-2xl leading-none md:text-3xl">›</span>
              </button>
            </>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="absolute right-3 top-3 z-20 rounded-full border border-white/20 bg-black/50 px-3 py-1.5 font-display text-[10px] font-bold uppercase tracking-[0.2em] text-white/80 transition hover:border-white/40 hover:text-white md:right-6 md:top-6"
            aria-label={t("vision.lightbox.close")}
          >
            {t("vision.lightbox.esc")}
          </button>

          <motion.div
            className="pointer-events-none relative z-10 flex max-h-[100dvh] w-full flex-col items-center justify-center px-4 py-16 md:px-12"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="pointer-events-auto flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  className="relative flex max-h-[calc(100dvh-8rem)] w-full max-w-6xl items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22 }}
                >
                  <Image
                    src={current.url}
                    alt={current.label}
                    width={1920}
                    height={1080}
                    className="max-h-[calc(100dvh-8rem)] w-auto max-w-full object-contain"
                    sizes="100vw"
                    priority
                    unoptimized={current.url.endsWith(".svg")}
                  />
                </motion.div>
              </AnimatePresence>

              <p className="mt-4 font-display text-xs font-bold uppercase tracking-[0.25em] text-white/80 md:text-sm">
                {current.label}
                <span className="ml-3 text-white/40">
                  {index! + 1} / {images.length}
                </span>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
