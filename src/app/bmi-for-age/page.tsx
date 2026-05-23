'use client';

import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Ruler, Loader2 } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { calculateBmiForAge } from '@/engines/growth';
import type { GrowthClassification, Sex } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { BmiForAgeChart } from './bmi-for-age-chart';
import { useLoading } from '@/hooks/use-loading';
import { useActivityStore } from '@/store/use-activity-store';
import { useTranslation } from '@/context/language-context';
import { cn } from '@/lib/utils';
import { TOOLS } from '@/lib/constants';
import { Breadcrumb } from '@/components/breadcrumb';
import { PageDescription } from '@/components/page-description';

const formSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  age: z.coerce.number().min(0, 'Age must be positive').max(228, 'Age must be 228 months or less for this tool'),
  weight: z.coerce.number().min(1, 'Weight seems too low').max(150, 'Weight seems too high'),
  height: z.coerce.number().min(45, 'Height seems too low').max(220, 'Height seems too high'),
  sex: z.enum(['male', 'female'], { required_error: 'Please select a sex' }),
});

type FormValues = z.infer<typeof formSchema>;

export default function BmiForAgePage() {
  const [result, setResult] = useState<GrowthClassification | null>(null);
  const [chartData, setChartData] = useState<{ age: number; bmi: number; sex: Sex } | null>(null);
  const { toast } = useToast();
  const { isLoading, withLoader } = useLoading();
  const addActivity = useActivityStore(state => state.addActivity);
  const getActivity = useActivityStore(state => state.getActivity);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useTranslation();
  const tool = TOOLS.find(t => t.id === 'bmi-for-age');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      age: '' as any,
      weight: '' as any,
      height: '' as any,
      sex: 'male',
    },
  });

  useEffect(() => {
    const activityId = searchParams.get('activityId');
    if (activityId) {
      const activity = getActivity(activityId);
      if (activity && activity.toolId === 'bmi-for-age' && activity.data) {
        form.reset(activity.data.inputs);
        setResult(activity.data.results);
        const bmi = activity.data.inputs.weight / ((activity.data.inputs.height / 100) ** 2);
        setChartData({
          age: activity.data.inputs.age,
          bmi: bmi,
          sex: activity.data.inputs.sex,
        });
        router.replace('/bmi-for-age');
      }
    }
  }, [searchParams, getActivity, form, router]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setResult(null);
    try {
      const bmi = data.weight / ((data.height / 100) ** 2);
      const analysis = await withLoader(calculateBmiForAge(data.age, bmi, data.sex as Sex));
      setResult(analysis);
      setChartData({ age: data.age, bmi, sex: data.sex as Sex });
       addActivity({
        id: Date.now().toString(),
        timestamp: Date.now(),
        toolId: 'bmi-for-age',
        toolName: t('BMI-for-Age'),
        fullName: data.fullName,
        summary: `BMI: ${bmi.toFixed(1)}, Z-Score: ${analysis.zScore.toFixed(2)}, ${analysis.classification}`,
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
        case 'Severely Thin':
            return {
                title: "Severe Thinness",
                description: "Indicates severe acute malnutrition. This is a critical condition requiring urgent medical and nutritional intervention to prevent severe health consequences.",
                color: "hsl(var(--destructive))",
            };
        case 'Thin':
            return {
                title: "Thinness",
                description: "Indicates mild to moderate acute malnutrition. This suggests a need for nutritional assessment and support to ensure the child returns to a healthy weight-for-height.",
                color: "hsl(var(--chart-4))",
            };
        case 'Overweight':
            return {
                title: "Overweight",
                description: "The child's weight is higher than what is considered healthy for their height, which may signal a risk for obesity. Lifestyle counseling is often recommended.",
                color: "hsl(var(--chart-3))",
            };
        case 'Obese':
            return {
                title: "Obese",
                description: "The child's weight is significantly above the healthy range, indicating obesity. This requires a comprehensive medical evaluation to address potential health risks and develop a management plan.",
                color: "hsl(var(--destructive))",
            };
        case 'Normal':
        default:
            return {
                title: "Normal BMI",
                description: "The child's BMI is within the healthy range for their age and sex. Continue routine monitoring of growth.",
                color: "hsl(var(--primary))",
            };
    }
  }

  const implications = getImplications(result?.classification);


  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title={t('BMI-for-Age')}
        Icon={Ruler}
        gradient={tool?.gradient}
      >
        <Breadcrumb />
      </PageHeader>
      <PageDescription
        title="About this Tool"
        description={t('bfa_description')}
      />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>{t('enter_child_data')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('age_months')}</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 60" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('weight_kg')}</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" placeholder="e.g., 18.2" {...field} />
                      </FormControl>
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
                        <Input type="number" step="0.1" placeholder="e.g., 110.0" {...field} />
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
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                        <ResultBox label="Z-Score" value={result.zScore.toFixed(2)} />
                        <ResultBox label="Percentile" value={`${result.percentile.toFixed(1)}%`} />
                        <ResultBox label={t('classification')} value={result.classification} isHighlight={true}/>
                    </div>
                    )}
                    {!result && !isLoading && <p className="text-center text-muted-foreground">{t('enter_data_to_see_results')}</p>}
                </CardContent>
            </Card>

            {result && !isLoading && (
              <Card>
                <CardHeader>
                  <CardTitle style={{ color: implications.color }}>{t('implications_title')}: {implications.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{implications.description}</p>
                </CardContent>
              </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>{t('growth_chart_title')}: {t('BMI-for-Age')}</CardTitle>
                </CardHeader>
                <CardContent>
                    {chartData ? <BmiForAgeChart {...chartData} /> : <div className="h-[400px] flex items-center justify-center"><p className="text-center text-muted-foreground">{t('enter_data_for_chart')}</p></div>}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

function ResultsSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
        </div>
    );
}

function ResultBox({label, value, isHighlight = false}: {label: string, value: string, isHighlight?: boolean}) {
    return (
        <div className={`p-4 rounded-lg ${isHighlight ? 'bg-primary/10' : 'bg-muted/50'}`}>
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className={`text-2xl font-bold ${isHighlight ? 'text-primary' : 'text-foreground'}`}>{value}</p>
        </div>
    )
}
