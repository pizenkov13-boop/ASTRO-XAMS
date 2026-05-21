"use client";

import { useEffect } from "react";
import { preloadAdlibs } from "@/lib/adlibs";

/** Loads adlib catalog in the background so first correct answer is instant. */
export function AdlibPreloader() {
  useEffect(() => {
    void preloadAdlibs();
  }, []);

  return null;
}
