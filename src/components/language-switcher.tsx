
"use client"

import * as React from "react"
import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { RadioGroupSelector } from "./radio-group-selector"
import { useTranslation, type Locale } from "@/context/language-context"

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useTranslation();

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'am', label: 'Amharic' },
    { value: 'ti', label: 'Tigrigna' }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-9">
          <Globe className="h-[1.2rem] w-[1.2rem] sm:mr-2" />
          <span className="hidden sm:inline-block">{t('language')}</span>
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="p-0">
        <RadioGroupSelector
          options={languageOptions}
          selectedValue={locale}
          onValueChange={(value) => setLocale(value as Locale)}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
