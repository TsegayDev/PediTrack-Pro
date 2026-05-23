"use client"

import { UnifiedGrowthChart } from "@/components/unified-growth-chart";
import type { Sex } from "@/lib/types";

interface SubscapularSkinfoldForAgeChartProps {
  age: number;
  subscapularSkinfold: number;
  sex: Sex;
}

export function SubscapularSkinfoldForAgeChart({ age, subscapularSkinfold, sex }: SubscapularSkinfoldForAgeChartProps) {
    return <UnifiedGrowthChart indicator="ssfa" sex={sex} patientData={{ x: age, y: subscapularSkinfold }} />;
}
