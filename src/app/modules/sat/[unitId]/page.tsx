"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { satUnits } from "@/data/sat";
import { UnitQuizShell } from "@/components/modules/UnitQuizShell";
import { useLocale } from "@/lib/i18n/context";

export default function SatUnitQuizPage() {
  const params = useParams();
  const unit = satUnits.find((u) => u.id === params.unitId);
  const { t } = useLocale();

  if (!unit) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p>{t("common.notFound.lesson")}</p>
        <Link href="/modules/sat">{t("common.back")}</Link>
      </div>
    );
  }

  return (
    <UnitQuizShell unit={unit} backHref="/modules/sat" backLabel={t("common.allLessons")} />
  );
}
