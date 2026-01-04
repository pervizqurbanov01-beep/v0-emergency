"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useLanguage } from "@/lib/language-context"
import { useEmergencyCalls, type EmergencyCall } from "@/lib/emergency-calls-context"
import { Clock, MapPin, AlertCircle, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AmbulanceMap } from "@/components/ambulance-map"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useEffect, useState as useState_tracking } from "react"

export function ActiveCallCard({ call, onCardClick }: { call: EmergencyCall; onCardClick?: () => void }) {
  const { t } = useLanguage()
  const { cancelCall } = useEmergencyCalls()
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [status, setStatus] = useState_tracking<"dispatched" | "en-route" | "arriving" | "arrived">("dispatched")
  const [estimatedTime, setEstimatedTime] = useState_tracking(270)

  useEffect(() => {
    if (!showDetailDialog) return

    const timeInterval = setInterval(() => {
      setEstimatedTime((prev) => {
        const newTime = prev - 1

        if (newTime > 0 && newTime % 60 === 0) {
          setStatus((prevStatus) => {
            if (prevStatus === "dispatched") return "en-route"
            if (prevStatus === "en-route") return "arriving"
            if (prevStatus === "arriving") return "arrived"
            return prevStatus
          })
        }

        return newTime <= 0 ? 0 : newTime
      })
    }, 1000)

    return () => clearInterval(timeInterval)
  }, [showDetailDialog])

  const minutes = Math.floor(estimatedTime / 60)
  const seconds = estimatedTime % 60

  const getStatusText = () => {
    switch (status) {
      case "dispatched":
        return t.ambulanceDispatched
      case "en-route":
        return t.ambulanceEnRoute
      case "arriving":
        return t.ambulanceArriving
      case "arrived":
        return t.ambulanceArrived
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case "dispatched":
        return "bg-yellow-50 border-yellow-200"
      case "en-route":
        return "bg-orange-50 border-orange-200"
      case "arriving":
        return "bg-green-50 border-green-200"
      case "arrived":
        return "bg-green-50 border-green-200"
    }
  }

  const formatCallTime = (timestamp: Date) => {
    const date = new Date(timestamp)
    const month = t.months[date.getMonth()]?.label || ""
    return `${date.getDate()} ${month} ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`
  }

  const getReasonDescription = () => {
    const reasonKey = Object.keys(t.reasonDescriptions).find((key) => t[key as keyof typeof t] === call.reason) as
      | keyof typeof t.reasonDescriptions
      | undefined
    return reasonKey ? t.reasonDescriptions[reasonKey] : ""
  }

  const handleCancelCall = () => {
    cancelCall(call.id)
    setShowCancelDialog(false)
    setShowDetailDialog(false)
  }

  const handleCardClick = () => {
    onCardClick?.()
    setShowDetailDialog(true)
  }

  return (
    <>
      <Card
        className="cursor-pointer border-red-200 bg-gradient-to-r from-red-50 to-red-25 hover:shadow-lg transition-shadow w-full"
        onClick={handleCardClick}
      >
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col gap-5">
            {/* Status badge */}
            <div className="flex items-center gap-2">
              <div className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor()}`}>
                <span className="text-red-600">{getStatusText()}</span>
              </div>
            </div>

            {/* Main content - improved spacing and responsive typography */}
            <div className="space-y-5">
              {/* Reason - ensuring language context is used */}
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-600 mb-1.5">{t.reason}</p>
                  <p className="text-base font-semibold text-gray-900 break-words">{call.reason}</p>
                  <p className="text-sm text-gray-600 mt-2">{getReasonDescription()}</p>
                </div>
              </div>

              {/* Request time */}
              <div className="flex gap-3">
                <Clock className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-600 mb-1.5">{t.callHistory}</p>
                  <p className="text-base font-semibold text-gray-900">{formatCallTime(call.timestamp)}</p>
                </div>
              </div>

              {/* Location */}
              <div className="flex gap-3">
                <MapPin className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-600 mb-1.5">{t.location}</p>
                  <p className="text-base font-semibold text-gray-900 break-words">{call.location}</p>
                </div>
              </div>
            </div>

            {/* Click indicator */}
            <div className="flex justify-end pt-2">
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{t.trackingAmbulance}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Map section */}
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900">{t.location}</h3>
              <AmbulanceMap status={status} />
            </div>

            {/* Status and timer */}
            <div className={`rounded-lg border-2 p-4 ${getStatusColor()}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t.trackingAmbulance}</p>
                  <p className="text-lg font-bold text-red-600">{getStatusText()}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-red-600">
                    {minutes}:{seconds.toString().padStart(2, "0")}
                  </div>
                  <p className="text-xs text-gray-600">{t.minutes}</p>
                </div>
              </div>
            </div>

            {/* Request details */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs text-gray-600 mb-1">{t.reason}</p>
                <p className="font-semibold text-gray-900">{call.reason}</p>
                <p className="text-xs text-gray-600 mt-1">{getReasonDescription()}</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs text-gray-600 mb-1">{t.callHistory}</p>
                <p className="font-semibold text-gray-900">{formatCallTime(call.timestamp)}</p>
              </div>
              <div className="md:col-span-2 rounded-lg bg-gray-50 p-3">
                <p className="text-xs text-gray-600 mb-1">{t.location}</p>
                <p className="font-semibold text-gray-900">{call.location}</p>
              </div>
            </div>

            {/* Status timeline */}
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-900">{t.trackingAmbulance}</p>
              <div className="space-y-2">
                {[
                  { step: "dispatched", label: t.ambulanceDispatched },
                  { step: "en-route", label: t.ambulanceEnRoute },
                  { step: "arriving", label: t.ambulanceArriving },
                  { step: "arrived", label: t.ambulanceArrived },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        ["dispatched", "en-route", "arriving", "arrived"]
                          .slice(0, ["dispatched", "en-route", "arriving", "arrived"].indexOf(item.step) + 1)
                          .includes(status)
                          ? "bg-red-600"
                          : "bg-gray-300"
                      }`}
                    />
                    <span className="text-sm text-gray-700">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cancel button */}
            <Button
              onClick={() => setShowCancelDialog(true)}
              variant="outline"
              className="w-full border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              {t.cancelCall}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cancel confirmation dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.cancelCallTitle}</AlertDialogTitle>
            <AlertDialogDescription>{t.cancelCallConfirmation}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              {t.no}
            </Button>
            <Button variant="destructive" onClick={handleCancelCall}>
              {t.yesCancelCall}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
