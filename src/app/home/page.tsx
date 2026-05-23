'use client';

import { ToolCard } from '@/components/tool-card';
import { TOOLS } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useActivityStore } from '@/store/use-activity-store';
import { ActivityTimeline } from '@/components/activity-timeline';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useTranslation } from '@/context/language-context';

export default function HomePage() {
  const dashboardTools = TOOLS.filter(tool => tool.id !== 'home');
  const recentActivities = useActivityStore(state => 
    [...state.activities]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 3)
  );
  const { t } = useTranslation();

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="text-center py-10 relative overflow-hidden rounded-xl bg-primary/5">
        <h1 className="text-4xl font-bold text-primary mb-3">{t('home_welcome')}</h1>
        <p className="text-xl max-w-2xl mx-auto text-muted-foreground font-body">{t('home_tagline')}</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-3 space-y-8">
            <Card>
                <CardHeader>
                    <h2 className="text-2xl font-bold text-center relative w-full inline-block">
                        {t('home_tools_title')}
                        <span className="block w-16 h-1 bg-gradient-to-r from-primary to-accent rounded-full mx-auto mt-2"></span>
                    </h2>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {dashboardTools.map((tool) => (
                          <ToolCard key={tool.id} tool={tool} />
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                         <h2 className="text-2xl font-bold text-center relative w-full inline-block">
                            {t('home_recent_activity')}
                            <span className="block w-16 h-1 bg-gradient-to-r from-primary to-accent rounded-full mx-auto mt-2"></span>
                        </h2>
                        <Button asChild variant="outline">
                            <Link href="/history">{t('home_view_all')}</Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {recentActivities.length > 0 ? (
                        <ActivityTimeline activities={recentActivities} />
                    ) : (
                        <p className="text-center text-muted-foreground">{t('home_no_activity')}</p>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
