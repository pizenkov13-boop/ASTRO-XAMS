import type { ModuleIconId } from "@/components/icons/astro-icon-types";
import type { ModuleId } from "@/types";

export interface ModuleInfo {
  id: ModuleId;
  title: string;
  subtitle: string;
  description: string;
  unitCount: number;
  level: string;
  icon: ModuleIconId;
  gradient: string;
  href: string;
}

export const MODULES: ModuleInfo[] = [
  {
    id: "grammar",
    title: "Essential Grammar in Use",
    subtitle: "4th Edition · 115 Units",
    description:
      "Master A1–B1 grammar from articles to conditionals. Spaced repetition locks each pattern into long-term memory.",
    unitCount: 115,
    level: "A1 – B1",
    icon: "grammar",
    gradient: "from-astro-orange to-astro-pink",
    href: "/modules/grammar",
  },
  {
    id: "vocabulary",
    title: "4000 Essential English Words",
    subtitle: "Book 1 · All Chapters",
    description:
      "Core high-frequency vocabulary with context sentences, collocations, and recall drills.",
    unitCount: 30,
    level: "A2 – B1",
    icon: "vocabulary",
    gradient: "from-astro-purple to-astro-cyan",
    href: "/modules/vocabulary",
  },
  {
    id: "sat",
    title: "SAT Prep",
    subtitle: "Math + Reading/Writing → 1600",
    description:
      "Zero to hero: algebra, data, rhetoric, and grammar for a perfect score trajectory.",
    unitCount: 48,
    level: "Zero → 1600",
    icon: "sat",
    gradient: "from-astro-cyan to-astro-orange",
    href: "/modules/sat",
  },
  {
    id: "oge",
    title: "ОГЭ Математика",
    subtitle: "Прогрессии и треугольники · 4 юнита",
    description:
      "Задание 14: прогрессии. Задание 15: геометрия треугольников — углы, медианы, площадь, тригонометрия.",
    unitCount: 4,
    level: "ОГЭ 9 класс",
    icon: "oge",
    gradient: "from-green-600 to-astro-cyan",
    href: "/modules/oge",
  },
];
