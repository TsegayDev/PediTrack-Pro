'use client';

import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Bone, Loader2 } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { calculateSubscapularSkinfoldForAge } from '@/engines/growth';
import type { GrowthClassification, Sex } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { SubscapularSkinfoldForAgeChart } from './subscapular-skinfold-chart';
import { useLoading } from '@/hooks/use-loading';
import { useActivityStore } from '@/store/use-activity-store';
import { useTranslation } from '@/context/language-context';
import { cn } from '@/lib/utils';
import { TOOLS } from '@/lib/constants';
import { Breadcrumb } from '@/components/breadcrumb';
import { PageDescription } from '@/components/page-description';

const formSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  age: z.coerce.number().min(3, 'Age must be between 3 and 60 months.').max(60, 'Age must be between 3 and 60 months.'),
  subscapularSkinfold: z.coerce.number().min(2, 'Skinfold seems too low').max(25, 'Skinfold seems too high'),
  sex: z.enum(['male', 'female'], { required_error: 'Please select a sex' }),
});

type FormValues = z.infer<typeof formSchema>;

export default function SubscapularSkinfoldForAgePage() {
  const [result, setResult] = useState<GrowthClassification | null>(null);
  const [chartData, setChartData] = useState<{ age: number; subscapularSkinfold: number; sex: Sex } | null>(null);
  const { toast } = useToast();
  const { isLoading, withLoader } = useLoading();
  const addActivity = useActivityStore(state => state.addActivity);
  const getActivity = useActivityStore(state => state.getActivity);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useTranslation();
  const tool = TOOLS.find(t => t.id === 'subscapular-skinfold-for-age');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      age: '' as any,
      subscapularSkinfold: '' as any,
      sex: 'male',
    },
  });

  useEffect(() => {
    const activityId = searchParams.get('activityId');
    if (activityId) {
      const activity = getActivity(activityId);
      if (activity && activity.toolId === 'subscapular-skinfold-for-age' && activity.data) {
        form.reset(activity.data.inputs);
        setResult(activity.data.results);
        setChartData({
          age: activity.data.inputs.age,
          subscapularSkinfold: activity.data.inputs.subscapularSkinfold,
          sex: activity.data.inputs.sex,
        });
        router.replace('/subscapular-skinfold-for-age');
      }
    }
  }, [searchParams, getActivity, form, router]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setResult(null);
    try {
      const analysis = await withLoader(calculateSubscapularSkinfoldForAge(data.age, data.subscapularSkinfold, data.sex as Sex));
      setResult(analysis);
      setChartData({ age: data.age, subscapularSkinfold: data.subscapularSkinfold, sex: data.sex as Sex });
      addActivity({
        id: Date.now().toString(),
        timestamp: Date.now(),
        toolId: 'subscapular-skinfold-for-age',
        toolName: t('Subscapular Skinfold-for-Age'),
        fullName: data.fullName,
        summary: `Z-Score: ${analysis.zScore.toFixed(2)}, ${analysis.classification}`,
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
        case 'Very Low':
            return {
                title: "Very Low Body Fat",
                description: "Indicates extremely low subcutaneous fat reserves, which may suggest severe malnutrition or an underlying health issue. Requires immediate medical and nutritional evaluation.",
                color: "hsl(var(--destructive))",
            };
        case 'Low':
            return {
                title: "Low Body Fat",
                description: "Suggests low body fat stores. This may indicate a risk for undernutrition. A nutritional assessment is recommended to ensure adequate energy reserves.",
                color: "hsl(var(--chart-4))",
            };
        case 'High':
            return {
                title: "High Body Fat",
                description: "Indicates a high level of subcutaneous fat, suggesting a risk of overweight or obesity. Lifestyle and dietary counseling are often recommended.",
                color: "hsl(var(--chart-3))",
            };
        case 'Very High':
            return {
                title: "Very High Body Fat",
                description: "Indicates a very high level of subcutaneous fat, strongly suggesting obesity. This requires a comprehensive medical evaluation to address potential health risks.",
                color: "hsl(var(--destructive))",
            };
        case 'Normal':
        default:
            return {
                title: "Normal Body Fat",
                description: "The child's subscapular skinfold measurement is within the expected range, indicating healthy subcutaneous fat stores for their age and sex.",
                color: "hsl(var(--primary))",
            };
    }
  }

  const implications = getImplications(result?.classification);


  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title={t('Subscapular Skinfold-for-Age')}
        Icon={Bone}
        gradient={tool?.gradient}
      >
        <Breadcrumb />
      </PageHeader>
      <PageDescription 
        title="About this Tool"
        description={t('ssfa_description')}
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
                        <Input type="number" placeholder="e.g., 36" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subscapularSkinfold"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('subscapular_skinfold_mm')}</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" placeholder="e.g., 6.5" {...field} />
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
                    <CardTitle>{t('growth_chart_title')}: {t('Subscapular Skinfold-for-Age')}</CardTitle>
                </CardHeader>
                <CardContent>
                    {chartData ? <SubscapularSkinfoldForAgeChart {...chartData} /> : <div className="h-[400px] flex items-center justify-center"><p className="text-center text-muted-foreground">{t('enter_data_for_chart')}</p></div>}
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
