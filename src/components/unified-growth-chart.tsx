"use client"

import * as React from "react"
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"
import type { Sex } from "@/lib/types"
import { 
    getHeightForAgeChartData, 
    getWeightForAgeChartData,
    getWeightForLengthChartData,
    getWeightForHeightChartData,
    getBmiForAgeChartData,
    getHeadCircumferenceForAgeChartData,
    getMuacForAgeChartData,
    getTricepsSkinfoldForAgeChartData,
    getSubscapularSkinfoldForAgeChartData
} from "@/engines/growth"

interface UnifiedGrowthChartProps {
  indicator: string;
  sex: Sex;
  patientData?: { x: number; y: number } | null;
}

const chartConfig: { [key: string]: { xAxisKey: string, yAxisKey: string, xAxisLabel: string, yAxisLabel: string, getChartData: any, zScores: number[], domain?: { min: number, max: number, ticks?: number[] }, getDomain?: (x: number) => { min: number, max: number, ticks: number[] } } } = {
    hfa: { xAxisKey: 'month', yAxisKey: 'height', xAxisLabel: 'Age (months)', yAxisLabel: 'Height (cm)', getChartData: getHeightForAgeChartData, zScores: [-3, -2, 0, 2, 3], getDomain: (ageMonths: number) => { if (ageMonths <= 24) return { min: 0, max: 24, ticks: [0, 3, 6, 9, 12, 15, 18, 21, 24] }; if (ageMonths <= 60) return { min: 0, max: 60, ticks: [0, 6, 12, 18, 24, 30, 36, 42, 48, 54, 60] }; const maxAge = Math.ceil(ageMonths / 12) * 12; const ticks = Array.from({length: maxAge / 12 + 1}, (_, i) => i * 12); return { min: 0, max: Math.max(ageMonths, 228), ticks: ticks }; } },
    wfa: { xAxisKey: 'month', yAxisKey: 'weight', xAxisLabel: 'Age (months)', yAxisLabel: 'Weight (kg)', getChartData: getWeightForAgeChartData, zScores: [-3, -2, 0, 2, 3], getDomain: (ageMonths: number) => { if (ageMonths <= 24) return { min: 0, max: 24, ticks: [0, 3, 6, 9, 12, 15, 18, 21, 24] }; if (ageMonths <= 60) return { min: 0, max: 60, ticks: [0, 6, 12, 18, 24, 30, 36, 42, 48, 54, 60] }; const maxAge = Math.ceil(ageMonths / 12) * 12; const ticks = Array.from({length: maxAge / 12 + 1}, (_, i) => i * 12); return { min: 0, max: Math.max(ageMonths, 120), ticks: ticks }; } },
    wfl: { xAxisKey: 'length', yAxisKey: 'weight', xAxisLabel: 'Length (cm)', yAxisLabel: 'Weight (kg)', getChartData: getWeightForLengthChartData, zScores: [-3, -2, 0, 2, 3], domain: { min: 45, max: 110 } },
    wfh: { xAxisKey: 'height', yAxisKey: 'weight', xAxisLabel: 'Height (cm)', yAxisLabel: 'Weight (kg)', getChartData: getWeightForHeightChartData, zScores: [-3, -2, 0, 2, 3], domain: { min: 65, max: 120 } },
    bfa: { xAxisKey: 'month', yAxisKey: 'bmi', xAxisLabel: 'Age (months)', yAxisLabel: 'BMI (kg/m²)', getChartData: getBmiForAgeChartData, zScores: [-3, -2, -1, 0, 1, 2, 3], getDomain: (ageMonths: number) => { if (ageMonths <= 60) return { min: 0, max: 60, ticks: [0, 6, 12, 18, 24, 30, 36, 42, 48, 54, 60] }; const maxAge = Math.ceil(ageMonths / 12) * 12; const ticks = Array.from({length: maxAge / 12 + 1}, (_, i) => i * 12); return { min: 0, max: Math.max(ageMonths, 228), ticks: ticks }; } },
    hcfa: { xAxisKey: 'month', yAxisKey: 'hc', xAxisLabel: 'Age (months)', yAxisLabel: 'Head Circumference (cm)', getChartData: getHeadCircumferenceForAgeChartData, zScores: [-3, -2, 0, 2, 3], domain: { min: 0, max: 60, ticks: [0, 6, 12, 18, 24, 30, 36, 42, 48, 54, 60] } },
    acfa: { xAxisKey: 'month', yAxisKey: 'muac', xAxisLabel: 'Age (months)', yAxisLabel: 'MUAC (cm)', getChartData: getMuacForAgeChartData, zScores: [-3, -2, 0, 2, 3], domain: { min: 3, max: 60, ticks: [3, 6, 12, 18, 24, 30, 36, 42, 48, 54, 60] } },
    tsfa: { xAxisKey: 'month', yAxisKey: 'tricepsSkinfold', xAxisLabel: 'Age (months)', yAxisLabel: 'Triceps Skinfold (mm)', getChartData: getTricepsSkinfoldForAgeChartData, zScores: [-3, -2, -1, 0, 1, 2, 3], domain: { min: 3, max: 60, ticks: [3, 6, 12, 18, 24, 30, 36, 42, 48, 54, 60] } },
    ssfa: { xAxisKey: 'month', yAxisKey: 'subscapularSkinfold', xAxisLabel: 'Age (months)', yAxisLabel: 'Subscapular Skinfold (mm)', getChartData: getSubscapularSkinfoldForAgeChartData, zScores: [-3, -2, -1, 0, 1, 2, 3], domain: { min: 3, max: 60, ticks: [3, 6, 12, 18, 24, 30, 36, 42, 48, 54, 60] } },
};


export function UnifiedGrowthChart({ indicator, sex, patientData }: UnifiedGrowthChartProps) {
  const config = chartConfig[indicator];
  const { xAxisKey, yAxisKey, xAxisLabel, yAxisLabel, getChartData, zScores, domain, getDomain } = config;
  
  const [chartData, setChartData] = React.useState<any[]>([]);

  React.useEffect(() => {
    async function fetchData() {
        const data = await getChartData(sex, zScores);
        setChartData(data);
    }
    fetchData();
  }, [sex, getChartData, zScores]);

  const patientChartData = patientData ? [{ [xAxisKey]: patientData.x, [yAxisKey]: patientData.y, name: "Patient" }] : [];

  const chartDomain = getDomain ? getDomain(patientData?.x ?? 24) : domain;
  
  if (chartData.length === 0) {
    return <div className="h-[450px] w-full flex items-center justify-center"><p>Loading chart data...</p></div>;
  }
  
  const filteredChartData = chartDomain ? chartData.filter(d => d[xAxisKey] >= chartDomain.min && d[xAxisKey] <= chartDomain.max) : chartData;

  return (
    <div className="h-[450px] w-full">
        <ResponsiveContainer width="100%" height="100%">
            <LineChart margin={{ top: 5, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey={xAxisKey}
                    type="number"
                    domain={chartDomain ? [chartDomain.min, chartDomain.max] : ['auto', 'auto']}
                    ticks={chartDomain?.ticks}
                    label={{ value: xAxisLabel, position: 'insideBottom', offset: -15 }}
                />
                <YAxis
                    domain={['dataMin - 1', 'dataMax + 1']}
                    label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                    formatter={(value, name) => {
                        const displayValue = typeof value === 'number' ? value.toFixed(1) : value;
                        const nameStr = String(name || '');
                        if (nameStr === 'sd0') return [displayValue, 'Median'];
                        if (nameStr === 'Patient') return [displayValue, 'Patient'];
                        return [displayValue, `${nameStr.replace('sd', '')} SD`];
                    }}
                    labelFormatter={(label) => `${xAxisLabel.split(' ')[0]}: ${label}`}
                />
                <Legend 
                    formatter={(value) => {
                        const valueStr = String(value || '');
                        return valueStr === 'sd0' ? 'Median' : `${valueStr.replace('sd', '')} SD`;
                    }}
                    wrapperStyle={{paddingTop: 20}}
                />

                {zScores.map(z => (
                    <Line
                        key={`sd${z}`}
                        dataKey={`sd${z}`}
                        data={filteredChartData}
                        type="monotone"
                        stroke={z === 0 ? '#16a34a' : '#a1a1aa'}
                        strokeWidth={z === 0 ? 2 : 1.5}
                        strokeDasharray={z !== 0 ? "5 5" : "0"}
                        dot={false}
                        name={`sd${z}`}
                    />
                ))}
                
                {patientData && (
                    <Line
                        dataKey={yAxisKey}
                        data={patientChartData}
                        stroke="hsl(var(--primary))"
                        strokeWidth={0}
                        dot={{ r: 6, fill: 'hsl(var(--primary))', stroke: 'hsl(var(--background))', strokeWidth: 2 }}
                        isAnimationActive={false}
                        name="Patient"
                    />
                )}
            </LineChart>
        </ResponsiveContainer>
    </div>
  )
}
