import type { Unit } from "@/types";
import { generateGrammarUnits } from "./generate";

export const grammarUnits: Unit[] = generateGrammarUnits();

export function getGrammarUnit(id: string): Unit | undefined {
  return grammarUnits.find((u) => u.id === id);
}

export function getGrammarUnitByNumber(n: number): Unit | undefined {
  return grammarUnits.find((u) => u.number === n);
}
