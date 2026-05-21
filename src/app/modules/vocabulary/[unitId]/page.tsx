"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { vocabularyUnits } from "@/data/vocabulary";
import { UnitQuizShell } from "@/components/modules/UnitQuizShell";

export default function VocabularyUnitQuizPage() {
  const params = useParams();
  const unit = vocabularyUnits.find((u) => u.id === params.unitId);

  if (!unit) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p>Unit not found</p>
        <Link href="/modules/vocabulary">Back</Link>
      </div>
    );
  }

  return (
    <UnitQuizShell
      unit={unit}
      backHref="/modules/vocabulary"
      backLabel="← All units"
    />
  );
}
