"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { getOgeUnit } from "@/data/oge";
import { UnitQuizShell } from "@/components/modules/UnitQuizShell";
import { useLocale } from "@/lib/i18n/context";

export default function OgeUnitQuizPage() {
  const params = useParams();
  const unit = getOgeUnit(params.unitId as string);
  const { t } = useLocale();

  if (!unit) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p>{t("common.notFound.unit")}</p>
        <Link href="/modules/oge">{t("common.backToOge")}</Link>
      </div>
    );
  }

  return <UnitQuizShell unit={unit} backHref="/modules/oge" />;
}
