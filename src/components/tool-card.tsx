import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import type { Tool } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/context/language-context';

export function ToolCard({ tool }: { tool: Tool }) {
  const { t } = useTranslation();
  return (
    <Link href={tool.path} className="group block h-full">
      <Card className="h-full transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-2 border-transparent hover:border-primary/50 overflow-hidden">
        <div className={cn("h-1.5 bg-gradient-to-r transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left", tool.gradient)}></div>
        <CardHeader className="text-center">
            <div className={cn("mx-auto w-16 h-16 mb-4 rounded-full flex items-center justify-center text-primary-foreground transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 bg-gradient-to-br", tool.gradient)}>
                <tool.Icon className="w-8 h-8" />
            </div>
            <CardTitle className="text-lg font-semibold">{t(tool.name)}</CardTitle>
        </CardHeader>
        <CardContent>
            <CardDescription className="text-center">{t(tool.description)}</CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}
