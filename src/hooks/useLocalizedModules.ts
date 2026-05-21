"use client";

import { useMemo } from "react";
import { MODULES, type ModuleInfo } from "@/data/modules";
import { useLocale } from "@/lib/i18n/context";
import type { TranslationKey } from "@/lib/i18n/translations";
import type { ModuleId } from "@/types";

const MODULE_KEYS: Record<
  ModuleId,
  { title: TranslationKey; subtitle: TranslationKey; description: TranslationKey; level: TranslationKey }
> = {
  grammar: {
    title: "module.grammar.title",
    subtitle: "module.grammar.subtitle",
    description: "module.grammar.description",
    level: "module.grammar.level",
  },
  vocabulary: {
    title: "module.vocabulary.title",
    subtitle: "module.vocabulary.subtitle",
    description: "module.vocabulary.description",
    level: "module.vocabulary.level",
  },
  sat: {
    title: "module.sat.title",
    subtitle: "module.sat.subtitle",
    description: "module.sat.description",
    level: "module.sat.level",
  },
};

export function useLocalizedModules(): ModuleInfo[] {
  const { t } = useLocale();

  return useMemo(
    () =>
      MODULES.map((m) => {
        const keys = MODULE_KEYS[m.id];
        return {
          ...m,
          title: t(keys.title),
          subtitle: t(keys.subtitle),
          description: t(keys.description),
          level: t(keys.level),
        };
      }),
    [t]
  );
}
