'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { TOOLS } from '@/lib/constants';
import { useTranslation } from '@/context/language-context';

export function Breadcrumb() {
  const pathname = usePathname();
  const { t } = useTranslation();
  
  const currentTool = TOOLS.find(tool => tool.path === pathname);

  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
      <ol className="flex items-center gap-1.5">
        <li>
          <Link href="/home" className="hover:text-foreground">
            {t('home')}
          </Link>
        </li>
        {currentTool && currentTool.id !== 'home' && (
           <>
            <li className="flex items-center">
              <ChevronRight className="w-3.5 h-3.5" />
            </li>
            <li>
              <span className="font-medium text-foreground">
                {t(currentTool.name)}
              </span>
            </li>
           </>
        )}
      </ol>
    </nav>
  );
}
