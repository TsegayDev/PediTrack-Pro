"use client"

import { UnifiedGrowthChart } from "@/components/unified-growth-chart";
import type { Sex } from "@/lib/types";

interface BmiForAgeChartProps {
  age: number;
  bmi: number;
  sex: Sex;
}

export function BmiForAgeChart({ age, bmi, sex }: BmiForAgeChartProps) {
  return <UnifiedGrowthChart indicator="bfa" sex={sex} patientData={{ x: age, y: bmi }} />;
}
