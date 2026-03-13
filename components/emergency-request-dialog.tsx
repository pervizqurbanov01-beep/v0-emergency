"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Navigation } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { useEmergencyCalls } from "@/lib/emergency-calls-context"
import { TrackingDialog } from "@/components/tracking-dialog"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function EmergencyRequestDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { t } = useLanguage()
  const { addCall } = useEmergencyCalls()
  const [reason, setReason] = useState("")
  const [medicalNotes, setMedicalNotes] = useState("")
  const [callFor, setCallFor] = useState<"me" | "someone">("me")
  const [location, setLocation] = useState<"current" | "map">("current")
  const [showTracking, setShowTracking] = useState(false)
  const [currentCallId, setCurrentCallId] = useState<string | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [voiceFile, setVoiceFile] = useState<File | null>(null)

  const handleSubmitClick = () => {
    setShowConfirmation(true)
  }

  const handleConfirmedSubmit = () => {
    const callId = addCall({
      reason,
      callFor,
      location: location === "current" ? "My Current Location" : "Custom Location",
      timestamp: new Date(),
      status: "active",
      voiceMessage: voiceFile,
    })

    setCurrentCallId(callId)
    onOpenChange(false)
    setShowTracking(true)
    setShowConfirmation(false)

    setReason("")
    setMedicalNotes("")
    setCallFor("me")
    setLocation("current")
    setVoiceFile(null)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">{t.emergencyRequest}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">{t.reason}</Label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger id="reason">
                  <SelectValue placeholder={t.selectReason} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="headache">{t.headache}</SelectItem>
                  <SelectItem value="nausea">{t.nausea}</SelectItem>
                  <SelectItem value="fever">{t.fever}</SelectItem>
                  <SelectItem value="chest-pain">{t.chestPain}</SelectItem>
                  <SelectItem value="difficulty-breathing">{t.difficultyBreathing}</SelectItem>
                  <SelectItem value="injury">{t.injury}</SelectItem>
                  <SelectItem value="other">{t.other}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="medical-notes">{t.medicalNotes}</Label>
              <Textarea
                id="medical-notes"
                value={medicalNotes}
                onChange={(e) => setMedicalNotes(e.target.value)}
                placeholder={t.enterMedicalNotes}
                className="resize-none"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="voice-message">{t.voiceMessage}</Label>
              <div className="rounded-lg border border-dashed border-gray-300 p-4 text-center">
                <input
                  id="voice-message"
                  type="file"
                  accept="audio/*"
                  onChange={(e) => setVoiceFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
                <label htmlFor="voice-message" className="cursor-pointer">
                  <p className="text-sm text-gray-600">{t.uploadVoiceMessage}</p>
                  {voiceFile && <p className="mt-2 text-xs font-semibold text-green-600">{voiceFile.name}</p>}
                </label>
              </div>
            </div>

            <div className="space-y-3">
              <Label>{t.whoIsCallFor}</Label>
              <RadioGroup value={callFor} onValueChange={(value) => setCallFor(value as "me" | "someone")}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="me" id="for-me" />
                  <Label htmlFor="for-me" className="font-normal">
                    {t.forMe}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="someone" id="for-someone" />
                  <Label htmlFor="for-someone" className="font-normal">
                    {t.forSomeoneElse}
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {callFor === "someone" && (
              <div className="space-y-3">
                <Label>{t.location}</Label>
                <RadioGroup value={location} onValueChange={(value) => setLocation(value as "current" | "map")}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="current" id="current-location" />
                    <Label htmlFor="current-location" className="flex items-center gap-2 font-normal">
                      <Navigation className="h-4 w-4 text-red-600" />
                      {t.useCurrentLocation}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="map" id="map-location" />
                    <Label htmlFor="map-location" className="flex items-center gap-2 font-normal">
                      <MapPin className="h-4 w-4 text-red-600" />
                      {t.selectOnMap}
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            <Button
              onClick={handleSubmitClick}
              disabled={!reason}
              className="h-12 w-full bg-red-600 text-base font-semibold text-white hover:bg-red-700 disabled:opacity-50"
            >
              {t.sendRequest}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.sendRequest}</AlertDialogTitle>
            <AlertDialogDescription>{t.sendRequestConfirmation}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3">
            <Button onClick={() => setShowConfirmation(false)} variant="outline" className="flex-1">
              {t.no}
            </Button>
            <Button onClick={handleConfirmedSubmit} className="flex-1 bg-red-600 hover:bg-red-700">
              {t.yes}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {currentCallId && <TrackingDialog open={showTracking} onOpenChange={setShowTracking} callId={currentCallId} />}
    </>
  )
}
