"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useLanguage } from "@/lib/language-context"
import { useEmergencyCalls } from "@/lib/emergency-calls-context"
import { Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MiniMapPreview } from "@/components/mini-map-preview"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function TrackingDialog({
  open,
  onOpenChange,
  callId,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  callId: string
}) {
  const { t } = useLanguage()
  const { cancelCall, calls } = useEmergencyCalls()
  const [status, setStatus] = useState<"dispatched" | "en-route" | "arriving" | "arrived">("dispatched")
  const [estimatedTime, setEstimatedTime] = useState(270)
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  const currentCall = calls.find((c) => c.id === callId)

  useEffect(() => {
    if (!open) return

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

        if (newTime <= 0) {
          return 0
        }
        return newTime
      })
    }, 1000)

    return () => {
      clearInterval(timeInterval)
    }
  }, [open])

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
        return "text-yellow-600"
      case "en-route":
        return "text-orange-600"
      case "arriving":
        return "text-green-600"
      case "arrived":
        return "text-green-600"
    }
  }

  const handleCancelCall = () => {
    cancelCall(callId)
    setShowCancelDialog(false)
    onOpenChange(false)
  }

  const handleCloseDialog = () => {
    onOpenChange(false)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">{t.trackingAmbulance}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {currentCall && (
              <MiniMapPreview
                location={{
                  latitude: 40.4093,
                  longitude: 49.8671,
                  address: currentCall.location || "Your Location",
                }}
              />
            )}

            <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
              <div>
                <p className={`text-sm font-semibold ${getStatusColor()}`}>{getStatusText()}</p>
                <p className="text-xs text-gray-600">
                  {t.callId}: {callId}
                </p>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Clock className="h-5 w-5" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {minutes}:{seconds.toString().padStart(2, "0")}
                  </div>
                  <div className="text-xs text-gray-600">{t.minutes}</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div
                  className={`h-3 w-3 rounded-full ${
                    status === "dispatched" || status === "en-route" || status === "arriving" || status === "arrived"
                      ? "bg-red-600"
                      : "bg-gray-300"
                  }`}
                />
                <span className="text-sm">{t.ambulanceDispatched}</span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`h-3 w-3 rounded-full ${
                    status === "en-route" || status === "arriving" || status === "arrived"
                      ? "bg-red-600"
                      : "bg-gray-300"
                  }`}
                />
                <span className="text-sm">{t.ambulanceEnRoute}</span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`h-3 w-3 rounded-full ${status === "arriving" || status === "arrived" ? "bg-red-600" : "bg-gray-300"}`}
                />
                <span className="text-sm">{t.ambulanceArriving}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className={`h-3 w-3 rounded-full ${status === "arrived" ? "bg-red-600" : "bg-gray-300"}`} />
                <span className="text-sm">{t.ambulanceArrived}</span>
              </div>
            </div>

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
