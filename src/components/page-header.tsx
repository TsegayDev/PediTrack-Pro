import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react';

interface PageHeaderProps {
  title: string;
  Icon: LucideIcon;
  gradient?: string;
  className?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, Icon, gradient, className, children }: PageHeaderProps) {
  return (
    <div className={cn("mb-6", className)}>
      {children}
      <div className="flex items-center gap-4">
        <div className={cn("p-3 rounded-xl text-primary-foreground", gradient ? `bg-gradient-to-br ${gradient}` : 'bg-primary/10 text-primary border border-primary/20')}>
          <Icon className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h1>
      </div>
    </div>
  );
}
