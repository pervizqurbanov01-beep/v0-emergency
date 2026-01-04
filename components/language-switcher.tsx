"use client"

import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  const languages = [
    { code: "az", label: "AZ" },
    { code: "ru", label: "RU" },
    { code: "en", label: "ENG" },
  ] as const

  return (
    <div className="flex gap-1 rounded-lg border border-gray-200 p-1">
      {languages.map((lang) => (
        <Button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          variant="ghost"
          size="sm"
          className={`h-8 px-3 text-xs font-medium ${
            language === lang.code
              ? "bg-red-600 text-white hover:bg-red-700 hover:text-white"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          {lang.label}
        </Button>
      ))}
    </div>
  )
}
