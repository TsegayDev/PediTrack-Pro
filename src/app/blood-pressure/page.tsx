
'use client';

import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { HeartPulse, Loader2 } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { useLoading } from '@/hooks/use-loading';
import { analyzeBloodPressure } from '@/engines/blood-pressure';
import type { Sex, BpClassification } from '@/lib/types';
import { useActivityStore } from '@/store/use-activity-store';
import { useTranslation } from '@/context/language-context';
import { cn } from '@/lib/utils';
import { TOOLS } from '@/lib/constants';
import { Breadcrumb } from '@/components/breadcrumb';
import { PageDescription } from '@/components/page-description';
import { BloodPressureChart, type BloodPressureChartData } from './blood-pressure-chart';


const formSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  age_years: z.coerce.number().min(1, 'Age must be at least 1 year').max(17, 'Age must be 17 years or less'),
  sex: z.enum(['male', 'female'], { required_error: 'Please select a sex' }),
  height: z.coerce.number().min(50, 'Height seems too low').max(220, 'Height seems too high'),
  systolic: z.coerce.number().min(40, 'Systolic BP seems too low').max(200, 'Systolic BP seems too high'),
  diastolic: z.coerce.number().min(20, 'Diastolic BP seems too low').max(150, 'Diastolic BP seems too high'),
});

type FormValues = z.infer<typeof formSchema>;

export default function BloodPressurePage() {
  const [result, setResult] = useState<BpClassification | null>(null);
  const { toast } = useToast();
  const { isLoading, withLoader } = useLoading();
  const addActivity = useActivityStore(state => state.addActivity);
  const getActivity = useActivityStore(state => state.getActivity);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useTranslation();
  const tool = TOOLS.find(t => t.id === 'blood-pressure');
  const [chartData, setChartData] = useState<BloodPressureChartData | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      age_years: '' as any,
      sex: 'male',
      height: '' as any,
      systolic: '' as any,
      diastolic: '' as any,
    },
  });

  useEffect(() => {
    const activityId = searchParams.get('activityId');
    if (activityId) {
      const activity = getActivity(activityId);
      if (activity && activity.toolId === 'blood-pressure' && activity.data) {
        form.reset(activity.data.inputs);
        setResult(activity.data.results);
        setChartData({
            sex: activity.data.inputs.sex,
            ageInYears: activity.data.inputs.age_years,
            patientData: {
                systolic: activity.data.inputs.systolic,
                diastolic: activity.data.inputs.diastolic,
            }
        })
        router.replace('/blood-pressure');
      }
    }
  }, [searchParams, getActivity, form, router]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setResult(null);
    setChartData(null);
    try {
      const analysis = await withLoader(analyzeBloodPressure(data.age_years, data.sex as Sex, data.height, data.systolic, data.diastolic));
      setResult(analysis);
      setChartData({
        sex: data.sex as Sex,
        ageInYears: data.age_years,
        patientData: {
          systolic: data.systolic,
          diastolic: data.diastolic,
        }
      });
      addActivity({
        id: Date.now().toString(),
        timestamp: Date.now(),
        toolId: 'blood-pressure',
        toolName: t('Blood Pressure Analyzer'),
        fullName: data.fullName,
        summary: `SBP: ${data.systolic}, DBP: ${data.diastolic} - ${analysis.classification}`,
        data: {
          inputs: data,
          results: analysis,
        },
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Calculation Error',
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
      });
    }
  };
  
    const getImplications = (classification: string | undefined) => {
        switch(classification) {
            case 'Normal':
                return {
                    title: "Normal Blood Pressure",
                    description: "Blood pressure is in the ideal range. Continue routine monitoring as recommended by a healthcare provider.",
                    color: "hsl(var(--primary))",
                };
            case 'Elevated':
                return {
                    title: "Elevated Blood Pressure",
                    description: "Indicates a potential for developing hypertension. Lifestyle modifications such as diet and exercise are often recommended. Regular monitoring is crucial.",
                    color: "hsl(var(--chart-3))",
                };
            case 'Stage 1 Hypertension':
                return {
                    title: "Stage 1 Hypertension",
                    description: "Indicates high blood pressure. This often requires lifestyle changes and may require medical treatment. A thorough medical evaluation is necessary.",
                    color: "hsl(var(--chart-4))",
                };
            case 'Stage 2 Hypertension':
                return {
                    title: "Stage 2 Hypertension",
                    description: "A more severe level of high blood pressure that requires prompt medical evaluation and treatment, typically including both lifestyle changes and medication.",
                    color: "hsl(var(--destructive))",
                };
            case 'Hypotension':
                 return {
                    title: "Hypotension",
                    description: "Indicates low blood pressure. While often asymptomatic, it can sometimes cause dizziness or fainting and may indicate an underlying medical issue that requires evaluation.",
                    color: "hsl(var(--chart-2))",
                };
            default:
                return {
                    title: "Awaiting Analysis",
                    description: "Enter the child's data to get a blood pressure analysis.",
                    color: "hsl(var(--muted-foreground))",
                };
        }
    }

  const implications = getImplications(result?.classification);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title={t('Blood Pressure Analyzer')}
        Icon={HeartPulse}
        gradient={tool?.gradient}
      >
        <Breadcrumb />
      </PageHeader>
      <PageDescription 
        title="About this Tool"
        description={t('bp_description')}
      />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>{t('enter_child_data')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                 <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('full_name')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('full_name_placeholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                control={form.control}
                name="age_years"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{t('age_years')}</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="e.g., 5" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                  control={form.control}
                  name="sex"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('sex')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('select_sex')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">{t('male')}</SelectItem>
                          <SelectItem value="female">{t('female')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('height_cm')}</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" placeholder="e.g., 110.5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-4">
                    <FormField
                    control={form.control}
                    name="systolic"
                    render={({ field }) => (
                        <FormItem className="flex-1">
                        <FormLabel>{t('systolic_bp')}</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="e.g., 105" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="diastolic"
                    render={({ field }) => (
                        <FormItem className="flex-1">
                        <FormLabel>{t('diastolic_bp')}</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="e.g., 70" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>

                 <Button type="submit" disabled={isLoading} className={cn("w-full", tool?.gradient && `bg-gradient-to-r ${tool.gradient}`)}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoading ? t('analyzing') : t('analyze_and_save')}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>{t('results')}</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading && <ResultsSkeleton />}
                    {result && !isLoading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <ResultCard label="Systolic BP" value={`${result.systolic} mmHg`} />
                        <ResultCard label="Diastolic BP" value={`${result.diastolic} mmHg`} />
                        <ResultCard label="BP Centile" value={`≈${result.bp_percentile}th`} highlightColor="hsl(var(--primary))"/>
                        <ResultCard label={t('classification')} value={result.classification} highlightColor={implications.color} />
                    </div>
                    )}
                    {!result && !isLoading && <p className="text-center text-muted-foreground">{t('enter_data_to_see_results')}</p>}
                </CardContent>
            </Card>

            {result && !isLoading && (
              <Card>
                <CardHeader>
                  <CardTitle style={{ color: implications.color }}>{implications.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{implications.description}</p>
                </CardContent>
              </Card>
            )}

            {chartData && (
                <Card>
                    <CardHeader>
                        <CardTitle>Blood Pressure Chart</CardTitle>
                    </CardHeader>
                    <CardContent>
                       <BloodPressureChart {...chartData} />
                    </CardContent>
                </Card>
            )}
        </div>
      </div>
    </div>
  );
}

function ResultsSkeleton() {
    return (
        <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
        </div>
    );
}

function ResultCard({ label, value, highlightColor }: { label: string; value: string; highlightColor?: string }) {
    return (
        <Card className="p-4" style={{borderColor: highlightColor}}>
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold" style={{color: highlightColor}}>{value}</p>
        </Card>
    )
}
