"use client"

import { UnifiedGrowthChart } from "@/components/unified-growth-chart";
import type { Sex } from "@/lib/types";

interface HeadCircumferenceChartProps {
  age: number;
  headCircumference: number;
  sex: Sex;
}

export function HeadCircumferenceChart({ age, headCircumference, sex }: HeadCircumferenceChartProps) {
  return <UnifiedGrowthChart indicator="hcfa" sex={sex} patientData={{ x: age, y: headCircumference }} />;
}
