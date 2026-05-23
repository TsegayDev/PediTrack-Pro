"use client"

import { UnifiedGrowthChart } from "@/components/unified-growth-chart";
import type { Sex } from "@/lib/types";

interface TricepsSkinfoldForAgeChartProps {
  age: number;
  tricepsSkinfold: number;
  sex: Sex;
}

export function TricepsSkinfoldForAgeChart({ age, tricepsSkinfold, sex }: TricepsSkinfoldForAgeChartProps) {
    return <UnifiedGrowthChart indicator="tsfa" sex={sex} patientData={{ x: age, y: tricepsSkinfold }} />;
}
