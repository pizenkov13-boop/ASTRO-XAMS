"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { mosaicClassForIndex } from "@/lib/vision-images";
import { useLocale } from "@/lib/i18n/context";
import { VisionLightbox } from "./VisionLightbox";

export interface VisionImageItem {
  id: string;
  filename: string;
  url: string;
  label: string;
}

export function VisionMosaic() {
  const { t } = useLocale();
  const [images, setImages] = useState<VisionImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/vision/images", { cache: "no-store" });
        const data = (await res.json()) as {
          images?: VisionImageItem[];
          error?: string;
        };
        if (!res.ok) throw new Error(data.error ?? "Failed to load images");
        if (!cancelled) {
          setImages(data.images ?? []);
          setError(
            (data.images?.length ?? 0) === 0 ? t("vision.mosaic.empty") : null
          );
        }
      } catch {
        if (!cancelled) {
          setError(t("vision.mosaic.error"));
          setImages([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <section className="flex min-h-[50vh] items-center justify-center">
        <motion.div
          className="h-10 w-10 rounded-full border-2 border-astro-orange border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </section>
    );
  }

  if (error && images.length === 0) {
    return (
      <section className="flex min-h-[40vh] items-center justify-center px-4">
        <p className="text-center text-sm text-gray-500">{error}</p>
      </section>
    );
  }

  return (
    <section className="relative w-full">
      <VisionLightbox
        images={images}
        index={lightboxIndex}
        onClose={closeLightbox}
        onIndexChange={setLightboxIndex}
      />

      <div className="grid min-h-[calc(100vh-2rem)] w-full auto-rows-[minmax(22vh,1fr)] grid-cols-2 gap-1 md:grid-cols-4 md:gap-1.5 lg:min-h-screen">
        {images.map((tile, i) => (
          <motion.article
            key={tile.id}
            role="button"
            tabIndex={0}
            onClick={() => openLightbox(i)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openLightbox(i);
              }
            }}
            className={`relative cursor-zoom-in overflow-hidden ${mosaicClassForIndex(i)}`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, delay: Math.min(i * 0.04, 0.4) }}
          >
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                className="relative h-full w-full"
                animate={{ scale: [1, 1.14] }}
                transition={{
                  duration: 18 + (i % 4) * 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "linear",
                }}
              >
                <Image
                  src={tile.url}
                  alt={tile.label}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                  priority={i < 4}
                  unoptimized={tile.url.endsWith(".svg")}
                />
              </motion.div>
            </div>

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/50" />
            <div className="pointer-events-none absolute inset-0 bg-black/20 mix-blend-multiply" />

            <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
              <p className="font-display text-sm font-bold uppercase tracking-[0.2em] text-white/90 md:text-base">
                {tile.label}
              </p>
            </div>

            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/5" />
          </motion.article>
        ))}
      </div>
    </section>
  );
}
