"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { vocabularyUnits } from "@/data/vocabulary";
import { UnitQuizShell } from "@/components/modules/UnitQuizShell";
import { useLocale } from "@/lib/i18n/context";

export default function VocabularyUnitQuizPage() {
  const params = useParams();
  const unit = vocabularyUnits.find((u) => u.id === params.unitId);
  const { t } = useLocale();

  if (!unit) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p>{t("common.notFound.unit")}</p>
        <Link href="/modules/vocabulary">{t("common.back")}</Link>
      </div>
    );
  }

  return <UnitQuizShell unit={unit} backHref="/modules/vocabulary" />;
}
