"use client"

import { useState, useRef, useEffect } from "react"
import { LanguageSwitcher } from "@/components/language-switcher"
import { CardiogramCircle } from "@/components/cardiogram-circle"
import { EmergencyRequestDialog } from "@/components/emergency-request-dialog"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"
import { useEmergencyCalls } from "@/lib/emergency-calls-context"
import { Cross, Phone } from "lucide-react"
import { ActiveCallCard } from "@/components/active-call-card"

export function MainPage() {
  const [showRequestDialog, setShowRequestDialog] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const [shouldScroll, setShouldScroll] = useState(false)

  const { t } = useLanguage()
  const { calls } = useEmergencyCalls()

  const activeCall = calls.find((call) => call.status === "active")

  useEffect(() => {
    if (shouldScroll && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
      setShouldScroll(false)
    }
  }, [shouldScroll])

  return (
    <div className="flex h-full flex-col p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cross className="h-6 w-6 text-red-600" />
          <h1 className="text-xl font-bold text-red-600">{t.appName}</h1>
        </div>
        <LanguageSwitcher />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center">
        <CardiogramCircle />

        <h2 className="mt-8 text-center text-3xl font-bold text-black">{t.emergency}</h2>
        <p className="mt-2 max-w-xs text-center text-sm text-gray-600">{t.emergencyDescription}</p>

        <Button
          onClick={() => setShowRequestDialog(true)}
          className="mt-8 flex h-16 items-center gap-2 bg-red-600 px-16 text-lg font-semibold text-white hover:bg-red-700"
        >
          <Phone className="h-5 w-5" />
          {t.emergencyCall}
        </Button>
      </div>

      {activeCall && (
        <div className="mt-6 border-t border-gray-200 pt-6 pb-8" ref={cardRef}>
          <ActiveCallCard call={activeCall} onCardClick={() => setShouldScroll(true)} />
        </div>
      )}

      <EmergencyRequestDialog open={showRequestDialog} onOpenChange={setShowRequestDialog} />
    </div>
  )
}
