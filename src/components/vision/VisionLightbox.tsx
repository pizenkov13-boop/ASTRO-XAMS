"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { useLocale } from "@/lib/i18n/context";
import type { VisionImageItem } from "./VisionMosaic";

const SWIPE_THRESHOLD = 50;

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
  const touchStartX = useRef<number | null>(null);

  const goPrev = useCallback(() => {
    if (!open || index === null) return;
    onIndexChange((index - 1 + images.length) % images.length);
  }, [open, index, images.length, onIndexChange]);

  const goNext = useCallback(() => {
    if (!open || index === null) return;
    onIndexChange((index + 1) % images.length);
  }, [open, index, images.length, onIndexChange]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_THRESHOLD) goNext();
    else if (info.offset.x > SWIPE_THRESHOLD) goPrev();
  };

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
          className="fixed inset-0 z-[100] flex items-center justify-center pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]"
          role="dialog"
          aria-modal="true"
          aria-label={`Vision image ${index! + 1} of ${images.length}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
        >
          <button
            type="button"
            className="absolute inset-0 cursor-zoom-out bg-black/92 backdrop-blur-sm touch-manipulation"
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
                className="absolute left-2 top-1/2 z-20 hidden min-h-[52px] min-w-[52px] -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white/90 transition hover:border-astro-orange/60 sm:flex md:left-6"
                aria-label={t("vision.lightbox.prev")}
              >
                <span className="text-3xl leading-none">‹</span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                className="absolute right-2 top-1/2 z-20 hidden min-h-[52px] min-w-[52px] -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white/90 transition hover:border-astro-orange/60 sm:flex md:right-6"
                aria-label={t("vision.lightbox.next")}
              >
                <span className="text-3xl leading-none">›</span>
              </button>
            </>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="absolute right-3 top-[max(0.75rem,env(safe-area-inset-top))] z-20 min-h-[44px] rounded-full border border-white/20 bg-black/50 px-4 py-2 font-display text-base font-bold uppercase tracking-wider text-white/80 touch-manipulation md:right-6"
            aria-label={t("vision.lightbox.close")}
          >
            {t("vision.lightbox.esc")}
          </button>

          <motion.div
            className="pointer-events-none relative z-10 flex h-full w-full max-h-[100dvh] flex-col items-center justify-center px-4 py-16 md:px-12"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="pointer-events-auto flex w-full max-w-full flex-col items-center touch-pan-y"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={(e) => {
                touchStartX.current = e.touches[0]?.clientX ?? null;
              }}
              onTouchEnd={(e) => {
                const start = touchStartX.current;
                const end = e.changedTouches[0]?.clientX;
                touchStartX.current = null;
                if (start == null || end == null) return;
                const delta = end - start;
                if (delta < -SWIPE_THRESHOLD) goNext();
                else if (delta > SWIPE_THRESHOLD) goPrev();
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  drag={images.length > 1 ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.15}
                  onDragEnd={handleDragEnd}
                  className="relative flex max-h-[calc(100dvh-8rem)] w-full max-w-[100vw] cursor-grab items-center justify-center active:cursor-grabbing"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.22 }}
                >
                  <Image
                    src={current.url}
                    alt=""
                    width={1920}
                    height={1080}
                    className="max-h-[calc(100dvh-8rem)] w-auto max-w-full select-none object-contain"
                    sizes="100vw"
                    priority
                    draggable={false}
                    unoptimized={current.url.endsWith(".svg")}
                  />
                </motion.div>
              </AnimatePresence>

              <p className="mt-4 max-w-full px-2 text-center font-display text-base font-bold uppercase tracking-[0.2em] text-white/60">
                {index! + 1} / {images.length}
              </p>
              {images.length > 1 && (
                <p className="mt-2 text-base text-white/40 sm:hidden">
                  ← swipe →
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
