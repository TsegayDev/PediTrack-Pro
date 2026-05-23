"use client"

import { UnifiedGrowthChart } from "@/components/unified-growth-chart";
import type { Sex } from "@/lib/types";

interface WeightForAgeChartProps {
  age: number;
  weight: number;
  sex: Sex;
}

export function WeightForAgeChart({ age, weight, sex }: WeightForAgeChartProps) {
  return <UnifiedGrowthChart indicator="wfa" sex={sex} patientData={{ x: age, y: weight }} />;
}
