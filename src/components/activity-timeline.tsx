'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { TOOLS } from '@/lib/constants';
import type { Activity } from '@/lib/types';
import { Checkbox } from './ui/checkbox';
import { cn } from '@/lib/utils';

interface ActivityTimelineProps {
    activities: Activity[];
    selectionMode?: boolean;
    selectedActivities?: string[];
    onToggleSelection?: (id: string) => void;
}

export function ActivityTimeline({ 
    activities, 
    selectionMode = false, 
    selectedActivities = [], 
    onToggleSelection = () => {} 
}: ActivityTimelineProps) {
    const router = useRouter();

    const handleCardClick = (e: React.MouseEvent<HTMLDivElement>, activity: Activity) => {
        if (selectionMode) {
            e.preventDefault();
            onToggleSelection(activity.id);
        } else {
            const tool = TOOLS.find(t => t.id === activity.toolId);
            if (tool) {
                router.push(`${tool.path}?activityId=${activity.id}`);
            }
        }
    };
    
    return (
        <div className="relative">
            {activities.map((activity, index) => {
                 const tool = TOOLS.find(t => t.id === activity.toolId);
                 const Icon = tool?.Icon;
                 const isSelected = selectedActivities.includes(activity.id);

                return (
                    <div key={activity.id} className="flex items-center gap-4 mb-6 last:mb-0">
                         {selectionMode && (
                             <Checkbox 
                                checked={isSelected}
                                onCheckedChange={() => onToggleSelection(activity.id)}
                                className="z-20"
                            />
                        )}
                        <div className="relative pl-8 flex-1">
                            <div className="absolute left-0 top-0 bottom-0 flex items-center">
                                <div className={cn("absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-full bg-border", index === 0 && 'top-1/2', index === activities.length - 1 && 'h-1/2')}></div>
                                <div className="absolute left-[-8.5px] top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-primary border-4 border-background flex items-center justify-center z-10">
                                {Icon && <Icon className="w-3 h-3 text-primary-foreground" />}
                                </div>
                            </div>
                            <Card 
                                className={cn(
                                    "flex-1 bg-background/50 transition-colors",
                                    selectionMode ? 'cursor-pointer' : 'hover:bg-muted/50 cursor-pointer',
                                    isSelected && 'bg-primary/10 border-primary'
                                )} 
                                onClick={(e) => handleCardClick(e, activity)}
                            >
                                <CardContent className="p-4">
                                    <p className="font-semibold text-foreground">{activity.toolName} analysis for {activity.fullName}</p>
                                    <p className="text-sm text-muted-foreground">{activity.summary}</p>
                                    <p className="text-xs text-muted-foreground mt-2">{new Date(activity.timestamp).toLocaleString()}</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            )}
        </div>
    );
}
