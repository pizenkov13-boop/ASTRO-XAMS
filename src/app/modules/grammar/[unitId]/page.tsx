"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { getGrammarUnit } from "@/data/grammar";
import { UnitQuizShell } from "@/components/modules/UnitQuizShell";
import { useLocale } from "@/lib/i18n/context";

export default function GrammarUnitQuizPage() {
  const params = useParams();
  const unitId = params.unitId as string;
  const unit = getGrammarUnit(unitId);
  const { t } = useLocale();

  if (!unit) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p>{t("common.notFound.unit")}</p>
        <Link href="/modules/grammar">{t("common.backToGrammar")}</Link>
      </div>
    );
  }

  return <UnitQuizShell unit={unit} backHref="/modules/grammar" />;
}
