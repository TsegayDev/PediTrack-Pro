"use client"

import { UnifiedGrowthChart } from "@/components/unified-growth-chart";
import type { Sex } from "@/lib/types";

interface WeightForHeightChartProps {
  height: number;
  weight: number;
  sex: Sex;
}

export function WeightForHeightChart({ height, weight, sex }: WeightForHeightChartProps) {
  return <UnifiedGrowthChart indicator="wfh" sex={sex} patientData={{ x: height, y: weight }} />;
}
