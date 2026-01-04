"use client"

import { useLanguage } from "@/lib/language-context"
import { useEmergencyCalls } from "@/lib/emergency-calls-context"
import { Clock, Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function HistoryPage() {
  const { t, language } = useLanguage()
  const { calls } = useEmergencyCalls()

  const formatDate = (date: Date) => {
    const monthIndex = date.getMonth()
    const monthName = t.months[monthIndex].label
    return `${monthName} ${date.getDate()}, ${date.getFullYear()}`
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat(language === "en" ? "en-US" : language === "ru" ? "ru-RU" : "az-AZ", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getStatusColor = (status: string) => {
    if (status === "cancelled") return "text-red-600 bg-red-50"
    return "text-green-600 bg-green-50"
  }

  const getStatusText = (status: string) => {
    if (status === "cancelled") return t.cancelledCall
    return t.completedCall
  }

  return (
    <div className="h-full p-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">{t.callHistory}</h1>

      {calls.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center text-center">
          <Clock className="mb-4 h-16 w-16 text-gray-300" />
          <p className="text-gray-500">{t.noCallsYet}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {calls.map((call) => (
            <Card key={call.id} className="border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{t[call.reason as keyof typeof t] || call.reason}</h3>
                    <p className="mt-1 text-sm text-gray-600">{call.callFor === "me" ? t.forMe : t.forSomeoneElse}</p>
                    <p className="mt-1 text-sm text-gray-600">{call.location}</p>
                    <div
                      className={`mt-2 inline-block rounded px-2 py-1 text-xs font-medium ${getStatusColor(call.status)}`}
                    >
                      {getStatusText(call.status)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(call.timestamp)}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>{formatTime(call.timestamp)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
