'use client';
import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { History, Trash2 } from 'lucide-react';
import { useActivityStore } from '@/store/use-activity-store';
import { ActivityTimeline } from '@/components/activity-timeline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/context/language-context';
import { Breadcrumb } from '@/components/breadcrumb';
import { PageDescription } from '@/components/page-description';
import { TOOLS } from '@/lib/constants';

export default function HistoryPage() {
  const { t } = useTranslation();
  const tool = TOOLS.find(t => t.id === 'history');
  const activities = useActivityStore(state => 
    [...state.activities].sort((a, b) => b.timestamp - a.timestamp)
  );
  const clearHistory = useActivityStore(state => state.clearHistory);
  const deleteActivities = useActivityStore(state => state.deleteActivities);

  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const handleToggleSelection = (id: string) => {
    setSelectedActivities(prev => 
      prev.includes(id) ? prev.filter(activityId => activityId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedActivities.length === activities.length) {
      setSelectedActivities([]);
    } else {
      setSelectedActivities(activities.map(a => a.id));
    }
  };

  const handleDeleteSelected = () => {
    deleteActivities(selectedActivities);
    setSelectedActivities([]);
    setIsSelectionMode(false);
  };

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedActivities([]);
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title={t('history_title')}
        Icon={History}
        gradient={tool?.gradient}
      >
        <Breadcrumb />
      </PageHeader>
      <PageDescription
        title="About this Page"
        description={t('history_description')}
      />
      <Card>
        <CardHeader className='flex-row items-center justify-between'>
            <div className='flex items-center gap-4'>
                <CardTitle>{t('history_all_activities')}</CardTitle>
                {isSelectionMode && activities.length > 0 && (
                     <div className="flex items-center space-x-2">
                        <Checkbox id="select-all" onCheckedChange={handleSelectAll} checked={selectedActivities.length > 0 && selectedActivities.length === activities.length}/>
                        <Label htmlFor="select-all" className='text-sm font-medium'>{t('history_select_all')}</Label>
                    </div>
                )}
            </div>
            
            {activities.length > 0 && (
                <div className='flex items-center gap-2'>
                    {isSelectionMode ? (
                        <>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" disabled={selectedActivities.length === 0}>
                                        <Trash2 className="mr-2 h-4 w-4" /> {t('history_delete_selected')}
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>{t('history_are_you_sure')}</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        {t('history_delete_selected_warning', { count: selectedActivities.length })}
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDeleteSelected}>{t('continue')}</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                            <Button variant="outline" onClick={toggleSelectionMode}>{t('cancel')}</Button>
                        </>
                    ) : (
                        <>
                            <Button variant="outline" onClick={toggleSelectionMode}>{t('history_manage')}</Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                <Button variant="destructive">{t('history_clear_all')}</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>{t('history_are_you_sure')}</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        {t('history_clear_all_warning')}
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                                    <AlertDialogAction onClick={clearHistory}>{t('continue')}</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </>
                    )}
                </div>
            )}
        </CardHeader>
        <CardContent>
            {activities.length > 0 ? (
                <ActivityTimeline 
                    activities={activities}
                    selectionMode={isSelectionMode}
                    selectedActivities={selectedActivities}
                    onToggleSelection={handleToggleSelection}
                />
            ) : (
                <div className="text-center py-16">
                    <p className="text-muted-foreground mb-4">{t('history_no_activities')}</p>
                    <p className="text-sm text-muted-foreground">{t('history_no_activities_subtext')}</p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
