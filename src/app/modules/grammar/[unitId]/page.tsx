"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { getGrammarUnit } from "@/data/grammar";
import { UnitQuizShell } from "@/components/modules/UnitQuizShell";

export default function GrammarUnitQuizPage() {
  const params = useParams();
  const unitId = params.unitId as string;
  const unit = getGrammarUnit(unitId);

  if (!unit) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p>Unit not found</p>
        <Link href="/modules/grammar">Back to grammar</Link>
      </div>
    );
  }

  return (
    <UnitQuizShell unit={unit} backHref="/modules/grammar" backLabel="← All units" />
  );
}
