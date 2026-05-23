'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { LineChart, PersonStanding, Weight, Ruler, BrainCircuit, Armchair, Bone, Baby, Scaling } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UnifiedGrowthChart } from '@/components/unified-growth-chart';
import { Sex } from '@/lib/types';
import { useTranslation } from '@/context/language-context';
import { TOOLS } from '@/lib/constants';
import { Breadcrumb } from '@/components/breadcrumb';
import { PageDescription } from '@/components/page-description';

export default function GrowthChartsPage() {
  const { t } = useTranslation();
  const tool = TOOLS.find(t => t.id === 'growth-charts');

  const indicators = [
    { value: 'hfa', label: t('Height-for-Age'), Icon: PersonStanding },
    { value: 'wfa', label: t('Weight-for-Age'), Icon: Weight },
    { value: 'wfl', label: t('Weight-for-Length'), Icon: Baby },
    { value: 'wfh', label: t('Weight-for-Height'), Icon: Scaling },
    { value: 'bfa', label: t('BMI-for-Age'), Icon: Ruler },
    { value: 'hcfa', label: t('Head Circumference-for-Age'), Icon: BrainCircuit },
    { value: 'acfa', label: t('Arm Circumference (MUAC)'), Icon: Armchair },
    { value: 'tsfa', label: t('Triceps Skinfold-for-Age'), Icon: Bone },
    { value: 'ssfa', label: t('Subscapular Skinfold-for-Age'), Icon: Bone },
  ];
  
  const [indicator, setIndicator] = useState('hfa');
  const [sex, setSex] = useState<Sex>('male');

  const selectedIndicator = indicators.find(i => i.value === indicator);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title={t('Growth Chart Viewer')}
        Icon={LineChart}
        gradient={tool?.gradient}
      >
        <Breadcrumb />
      </PageHeader>
      <PageDescription
        title="About this Tool"
        description={t('gcv_description')}
      />
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>{t('gcv_select_params')}</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select value={indicator} onValueChange={setIndicator}>
              <SelectTrigger>
                <SelectValue placeholder={t('gcv_select_indicator')} />
              </SelectTrigger>
              <SelectContent>
                {indicators.map(ind => (
                  <SelectItem key={ind.value} value={ind.value}>
                    <div className="flex items-center gap-2">
                      <ind.Icon className="h-4 w-4" />
                      <span>{ind.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sex} onValueChange={(value: Sex) => setSex(value)}>
              <SelectTrigger>
                <SelectValue placeholder={t('select_sex')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">{t('male')}</SelectItem>
                <SelectItem value="female">{t('female')}</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {selectedIndicator && <selectedIndicator.Icon className="w-6 h-6 text-primary" />}
              {selectedIndicator?.label} {t('gcv_chart')} ({sex === 'male' ? t('male') : t('female')})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <UnifiedGrowthChart indicator={indicator} sex={sex} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
