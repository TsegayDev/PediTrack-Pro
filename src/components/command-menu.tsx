"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TOOLS } from "@/lib/constants"
import { useActivityStore } from "@/store/use-activity-store"
import { useTranslation } from "@/context/language-context"
import { DialogTitle } from "@radix-ui/react-dialog"

interface CommandMenuProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export function CommandMenu({ open, setOpen }: CommandMenuProps) {
  const router = useRouter()
  const { t } = useTranslation();
  const [query, setQuery] = React.useState("")
  const allActivities = useActivityStore(state => state.activities);

  const filteredTools = React.useMemo(() => {
    return TOOLS.filter(tool => 
        t(tool.name).toLowerCase().includes(query.toLowerCase()) || 
        t(tool.description).toLowerCase().includes(query.toLowerCase())
    ).filter(tool => tool.id !== 'home' && tool.id !== 'history');
  }, [query, t]);
  
  const filteredActivities = React.useMemo(() => {
    return allActivities.filter(activity =>
        activity.fullName.toLowerCase().includes(query.toLowerCase()) ||
        t(activity.toolName).toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5); // Limit to 5 most recent matching activities
  }, [allActivities, query, t]);

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false)
    command()
  }, [setOpen])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="overflow-hidden p-0 shadow-lg">
        <DialogTitle className="sr-only">Command Menu</DialogTitle>
        <Input 
            placeholder={t('search_placeholder')}
            className="h-12 text-lg border-none focus-visible:ring-0"
            value={query}
            onInput={(e) => setQuery(e.currentTarget.value)}
        />
        <ScrollArea className="max-h-[400px]">
            <div className="p-2">
            {query && filteredTools.length === 0 && filteredActivities.length === 0 && (
                <div className="py-6 text-center text-sm">No results found.</div>
            )}
            
            {filteredTools.length > 0 && (
                <>
                <h4 className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Tools</h4>
                {filteredTools.map(tool => (
                    <div 
                        key={tool.id}
                        className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-accent"
                        onClick={() => runCommand(() => router.push(tool.path))}
                    >
                        <div className={`w-7 h-7 rounded-md flex items-center justify-center text-primary-foreground bg-gradient-to-br ${tool.gradient}`}>
                            <tool.Icon className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-sm font-medium">{t(tool.name)}</p>
                            <p className="text-xs text-muted-foreground">{t(tool.description)}</p>
                        </div>
                    </div>
                ))}
                </>
            )}

            {filteredActivities.length > 0 && (
                 <>
                 <h4 className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-4">History</h4>
                 {filteredActivities.map(activity => {
                    const tool = TOOLS.find(t => t.id === activity.toolId);
                    if (!tool) return null;
                    return (
                        <div
                            key={activity.id}
                            className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-accent"
                            onClick={() => runCommand(() => router.push(`${tool.path}?activityId=${activity.id}`))}
                        >
                             <div className={`w-7 h-7 rounded-md flex items-center justify-center text-primary-foreground bg-gradient-to-br ${tool.gradient}`}>
                                <tool.Icon className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">{t(activity.toolName)} for {activity.fullName}</p>
                                <p className="text-xs text-muted-foreground">{activity.summary}</p>
                            </div>
                        </div>
                    )
                 })}
                 </>
            )}
            </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
