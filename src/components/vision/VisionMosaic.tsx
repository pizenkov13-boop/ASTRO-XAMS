"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { mosaicClassForIndex } from "@/lib/vision-images";
import { useLocale } from "@/lib/i18n/context";
import { VisionLightbox } from "./VisionLightbox";

export interface VisionImageItem {
  id: string;
  filename: string;
  url: string;
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
  }, [t]);

  if (loading) {
    return (
      <section className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-sm text-gray-500">{t("vision.mosaic.loading")}</p>
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

      <div className="grid min-h-[50vh] w-full max-w-[100vw] auto-rows-[minmax(18vh,140px)] grid-cols-2 gap-1 sm:auto-rows-[minmax(20vh,1fr)] md:min-h-[calc(100vh-2rem)] md:grid-cols-4 md:gap-1.5 lg:min-h-screen">
        {images.map((tile, i) => (
          <article
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
            className={`relative min-h-[120px] cursor-zoom-in overflow-hidden touch-manipulation ${mosaicClassForIndex(i)}`}
          >
            <div className="absolute inset-0 overflow-hidden">
              <div className="relative h-full w-full">
                <Image
                  src={tile.url}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                  priority={i < 4}
                  unoptimized={tile.url.endsWith(".svg")}
                />
              </div>
            </div>

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/30" />
            <div className="pointer-events-none absolute inset-0 bg-black/10 mix-blend-multiply" />

            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/5" />
          </article>
        ))}
      </div>
    </section>
  );
}
