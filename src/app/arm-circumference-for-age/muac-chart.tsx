"use client"

import { UnifiedGrowthChart } from "@/components/unified-growth-chart";
import type { Sex } from "@/lib/types";

interface MuacChartProps {
  age: number;
  muac: number;
  sex: Sex;
}

export function MuacChart({ age, muac, sex }: MuacChartProps) {
  return <UnifiedGrowthChart indicator="acfa" sex={sex} patientData={{ x: age, y: muac }} />;
}
