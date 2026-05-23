"use client"

import { UnifiedGrowthChart } from "@/components/unified-growth-chart"
import type { Sex } from "@/lib/types"

interface HeightChartProps {
  age: number
  height: number
  sex: Sex
}

export function HeightChart({ age, height, sex }: HeightChartProps) {
  return <UnifiedGrowthChart indicator="hfa" sex={sex} patientData={{ x: age, y: height }} />;
}
