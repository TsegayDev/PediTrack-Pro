'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Baby } from 'lucide-react';
import Link from 'next/link';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { TOOLS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/context/language-context';
import { ThemeSwitcher } from '../theme-switcher';

export function AppSidebar() {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-3 p-4">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-orange-500 to-pink-500 transition-transform duration-300 ease-in-out hover:scale-110 hover:rotate-6">
            <Baby className="w-6 h-6 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-sidebar-foreground font-headline tracking-tight">
              {t('app_name')}
            </h1>
            <p className="text-xs text-sidebar-foreground/70">{t('app_subtitle')}</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {TOOLS.map((tool) => (
            <SidebarMenuItem key={tool.id}>
              <Link href={tool.path} className="w-full">
                <SidebarMenuButton
                  isActive={pathname === tool.path}
                  tooltip={t(tool.name)}
                >
                  <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center text-primary-foreground group-data-[active=true]:from-sidebar-primary group-group-data-[active=true]:to-accent bg-gradient-to-br", tool.gradient)}>
                    <tool.Icon className="w-4 h-4" />
                  </div>
                  <span>{t(tool.name)}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className='p-2 space-y-2'>
        <ThemeSwitcher />
      </SidebarFooter>
    </Sidebar>
  );
}
