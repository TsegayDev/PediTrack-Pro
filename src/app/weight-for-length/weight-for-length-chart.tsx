"use client"

import { UnifiedGrowthChart } from "@/components/unified-growth-chart";
import type { Sex } from "@/lib/types";

interface WeightForLengthChartProps {
  length: number;
  weight: number;
  sex: Sex;
}

export function WeightForLengthChart({ length, weight, sex }: WeightForLengthChartProps) {
  return <UnifiedGrowthChart indicator="wfl" sex={sex} patientData={{ x: length, y: weight }} />;
}
