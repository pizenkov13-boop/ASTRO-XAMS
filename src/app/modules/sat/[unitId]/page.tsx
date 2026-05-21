"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { satUnits } from "@/data/sat";
import { UnitQuizShell } from "@/components/modules/UnitQuizShell";

export default function SatUnitQuizPage() {
  const params = useParams();
  const unit = satUnits.find((u) => u.id === params.unitId);

  if (!unit) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p>Lesson not found</p>
        <Link href="/modules/sat">Back</Link>
      </div>
    );
  }

  return (
    <UnitQuizShell unit={unit} backHref="/modules/sat" backLabel="← All lessons" />
  );
}
