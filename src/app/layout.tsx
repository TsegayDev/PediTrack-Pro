'use client';
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { AppPreloader } from "@/components/preloader";
import { LanguageProvider } from "@/context/language-context";
import React from 'react';
import { Baby, Search } from 'lucide-react';
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/navigation/app-sidebar';
import { LoadingProvider } from '@/hooks/use-loading';
import { Loader } from '@/components/ui/loader';
import Link from 'next/link';
import { CommandMenu } from '@/components/command-menu';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/language-switcher';
import { Footer } from '@/components/footer';
import { useTranslation } from "@/context/language-context";


// Since this is a client component, we can't export metadata directly.
// This would be handled in a parent layout or page if it were a server component.
/*
export const metadata: Metadata = {
  title: "PediTrack Pro",
  description: "Advanced Pediatric Monitoring & Analytics Platform",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8F9FA" },
    { media: "(prefers-color-scheme: dark)", color: "#121212" },
  ],
};
*/

function AppLayout({ children }: { children: React.ReactNode }) {
    const [openCommandMenu, setOpenCommandMenu] = React.useState(false);
    const { t } = useTranslation();

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
          if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault()
            setOpenCommandMenu((open) => !open)
          }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    return (
        <LoadingProvider>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <div className="flex flex-col min-h-screen">
                  <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
                      <SidebarTrigger />
                      <Link href="/home" className="flex items-center gap-2 font-semibold">
                        <div className="w-8 h-8 rounded-md flex items-center justify-center bg-gradient-to-br from-orange-500 to-pink-500 transition-transform duration-300 ease-in-out hover:scale-110 hover:rotate-6">
                          <Baby className="w-5 h-5 text-white" />
                        </div>
                      </Link>
                      <div className="flex-1 max-w-sm">
                         <Button variant="outline" className="h-9 w-full px-4 py-2 text-muted-foreground justify-start" onClick={() => setOpenCommandMenu(true)}>
                            <Search className="h-4 w-4 mr-2" />
                            <span className="inline-block">{t('search')}</span>
                            <kbd className="inline-block ml-auto pointer-events-none select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
                                <span className="text-xs">⌘</span>K
                            </kbd>
                        </Button>
                      </div>
                      <div className="ml-auto flex items-center gap-2">
                        <LanguageSwitcher />
                      </div>
                  </header>
                  <main className='flex-1'>
                    {children}
                  </main>
                  <Footer />
              </div>
            </SidebarInset>
            <Loader />
            <CommandMenu open={openCommandMenu} setOpen={setOpenCommandMenu} />
          </SidebarProvider>
        </LoadingProvider>
    )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>PediTrack Pro</title>
        <meta name="description" content="Advanced Pediatric Monitoring & Analytics Platform" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Nunito:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <LanguageProvider>
          <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
          >
            <AppPreloader>
              <AppLayout>
                {children}
              </AppLayout>
            </AppPreloader>
            <Toaster />
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
