"use client"

import * as React from "react"
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Dot, ReferenceDot } from "recharts"
import type { Sex } from "@/lib/types"
import { getBloodPressureChartData } from '@/engines/blood-pressure';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export interface BloodPressureChartData {
  sex: Sex;
  ageInYears: number;
  patientData: {
    systolic: number;
    diastolic: number;
  };
}

export function BloodPressureChart({ sex, ageInYears, patientData }: BloodPressureChartData) {
    const [chartData, setChartData] = React.useState<any | null>(null);

    React.useEffect(() => {
        async function fetchData() {
            const data = await getBloodPressureChartData(sex);
            setChartData(data);
        }
        fetchData();
    }, [sex, ageInYears]);
    
    if (!chartData) {
        return <div className="h-[400px] w-full flex items-center justify-center"><p>Loading chart data...</p></div>;
    }

    const patientSystolicData = [{ age: ageInYears, value: patientData.systolic, name: "Patient Systolic" }];
    const patientDiastolicData = [{ age: ageInYears, value: patientData.diastolic, name: "Patient Diastolic" }];
    

    return (
      <Tabs defaultValue="systolic" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="systolic">Systolic</TabsTrigger>
            <TabsTrigger value="diastolic">Diastolic</TabsTrigger>
        </TabsList>
        <TabsContent value="systolic">
            <div className="h-[400px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={chartData}
                    margin={{
                    top: 5,
                    right: 30,
                    left: 0,
                    bottom: 20,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="age" type="number" domain={[1, 17]} ticks={[1, 3, 5, 7, 9, 11, 13, 15, 17]} label={{ value: 'Age (years)', position: 'insideBottom', offset: -15 }}/>
                    <YAxis label={{ value: 'Systolic BP (mmHg)', angle: -90, position: 'insideLeft' }} domain={['dataMin - 10', 'dataMax + 10']}/>
                    <Tooltip />
                    <Legend wrapperStyle={{paddingTop: 20}}/>
                    <Line type="monotone" dataKey="systolic.p50" stroke="hsl(var(--chart-1))" strokeWidth={2} name="Normal (50th %)" dot={false}/>
                    <Line type="monotone" dataKey="systolic.p90" stroke="hsl(var(--chart-3))" strokeWidth={2} strokeDasharray="5 5" name="Elevated (90th %)" dot={false}/>
                    <Line type="monotone" dataKey="systolic.p95" stroke="hsl(var(--chart-4))" strokeWidth={2} strokeDasharray="5 5" name="High (95th %)" dot={false}/>
                    <Line
                        dataKey="value"
                        data={patientSystolicData}
                        stroke="hsl(var(--destructive))"
                        strokeWidth={0}
                        name="Patient Systolic"
                        dot={{ r: 6, fill: 'hsl(var(--destructive))', stroke: 'hsl(var(--background))', strokeWidth: 2 }}
                    />
                </LineChart>
                </ResponsiveContainer>
            </div>
        </TabsContent>
        <TabsContent value="diastolic">
             <div className="h-[400px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={chartData}
                    margin={{
                    top: 5,
                    right: 30,
                    left: 0,
                    bottom: 20,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="age" type="number" domain={[1, 17]} ticks={[1, 3, 5, 7, 9, 11, 13, 15, 17]} label={{ value: 'Age (years)', position: 'insideBottom', offset: -15 }}/>
                    <YAxis label={{ value: 'Diastolic BP (mmHg)', angle: -90, position: 'insideLeft' }} domain={['dataMin - 10', 'dataMax + 10']} />
                    <Tooltip />
                    <Legend wrapperStyle={{paddingTop: 20}}/>
                    <Line type="monotone" dataKey="diastolic.p50" stroke="hsl(var(--chart-1))" strokeWidth={2} name="Normal (50th %)" dot={false} />
                    <Line type="monotone" dataKey="diastolic.p90" stroke="hsl(var(--chart-3))" strokeWidth={2} strokeDasharray="5 5" name="Elevated (90th %)" dot={false} />
                    <Line type="monotone" dataKey="diastolic.p95" stroke="hsl(var(--chart-4))" strokeWidth={2} strokeDasharray="5 5" name="High (95th %)" dot={false} />
                    <Line
                        dataKey="value"
                        data={patientDiastolicData}
                        stroke="hsl(var(--destructive))"
                        strokeWidth={0}
                        name="Patient Diastolic"
                        dot={{ r: 6, fill: 'hsl(var(--destructive))', stroke: 'hsl(var(--background))', strokeWidth: 2 }}
                    />
                </LineChart>
                </ResponsiveContainer>
            </div>
        </TabsContent>
      </Tabs>
    )
}
