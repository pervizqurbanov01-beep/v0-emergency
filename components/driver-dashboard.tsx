"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, Clock, User, Phone, AlertCircle, CheckCircle } from "lucide-react"
import { MiniMapPreview } from "@/components/mini-map-preview"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

interface AcceptedCall {
  id: string
  patientName: string
  patientPhone: string
  reason: string
  location: {
    latitude: number
    longitude: number
    address: string
  }
  timestamp: Date
  medicalNotes: string
  acceptedAt: Date
}

export default function DriverDashboard() {
  const { logout } = useAuth()
  const { t, language } = useLanguage()
  const [activeTab, setActiveTab] = useState<"notifications" | "history" | "profile">("notifications")
  const [acceptedCalls, setAcceptedCalls] = useState<AcceptedCall[]>([])
  const [showAcceptDialog, setShowAcceptDialog] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState<(typeof notifications)[0] | null>(null)

  const driverT = {
    calls: t.emergency,
    history: t.callHistory,
    profile: t.profile,
    patient: "Pasiyent",
    reason: t.reason,
    location: t.location,
    notes: t.medicalNotes,
    accept: t.acceptCall,
    redirect: "Yönləndir",
    logout: t.logout,
    noHistory: t.noCallsYet,
  }

  const [notifications] = useState([
    {
      id: "1",
      patientName: "Açar Məmdiyev",
      patientPhone: "+994 55 123 45 67",
      reason: "Baş ağrısı",
      location: {
        latitude: 40.4093,
        longitude: 49.8671,
        address: "28 May 40/1, Baku",
      },
      timestamp: new Date(),
      status: "pending" as const,
      medicalNotes: "Şiddətli baş ağrısı, qusma",
    },
  ])

  const handleAcceptClick = (notification: (typeof notifications)[0]) => {
    setSelectedNotification(notification)
    setShowAcceptDialog(true)
  }

  const handleConfirmAccept = () => {
    if (selectedNotification) {
      const acceptedCall: AcceptedCall = {
        ...selectedNotification,
        acceptedAt: new Date(),
      }
      setAcceptedCalls([...acceptedCalls, acceptedCall])
      setShowAcceptDialog(false)
      setSelectedNotification(null)
    }
  }

  return (
    <div className="flex h-screen flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-red-600 p-4 text-white">
        <h1 className="text-2xl font-bold">{t.emergency}</h1>
        <p className="text-sm text-red-100">{t.profile}</p>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        {activeTab === "notifications" && (
          <div className="space-y-4 p-4">
            {notifications
              .filter((n) => !acceptedCalls.find((ac) => ac.id === n.id))
              .map((notification) => (
                <Card key={notification.id} className="border-red-200 bg-red-50">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-lg">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                        {driverT.patient}
                      </div>
                      <span className="text-xs bg-red-600 text-white px-2 py-1 rounded">{driverT.calls}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Patient Name and Phone */}
                    <div className="space-y-2">
                      <p className="font-semibold text-lg">{notification.patientName}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="h-4 w-4" />
                        {notification.patientPhone}
                      </div>
                    </div>

                    {/* Reason */}
                    <div className="border-t pt-2">
                      <p className="text-sm font-medium text-gray-600">{driverT.reason}</p>
                      <p className="font-semibold">{notification.reason}</p>
                    </div>

                    {/* Medical Notes */}
                    {notification.medicalNotes && (
                      <div className="border-t pt-2">
                        <p className="text-sm font-medium text-gray-600">{driverT.notes}</p>
                        <p className="text-sm text-gray-700">{notification.medicalNotes}</p>
                      </div>
                    )}

                    {/* Map */}
                    <div className="border-t pt-2">
                      <p className="mb-2 text-sm font-medium text-gray-600">{driverT.location}</p>
                      <MiniMapPreview location={notification.location} />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => handleAcceptClick(notification)}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        {driverT.accept}
                      </Button>
                      <Button variant="outline" className="flex-1 bg-transparent">
                        {language === "az" ? "Yönləndir" : language === "ru" ? "Перенаправить" : "Forward"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        )}

        {activeTab === "history" && (
          <div className="space-y-4 p-4">
            {acceptedCalls.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-gray-500">{driverT.noHistory}</CardContent>
              </Card>
            ) : (
              acceptedCalls.map((call) => (
                <Card key={call.id} className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      {call.patientName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      {call.patientPhone}
                    </div>

                    <div className="border-t pt-2">
                      <p className="text-sm font-medium text-gray-600">{driverT.reason}</p>
                      <p className="font-semibold">{call.reason}</p>
                    </div>

                    <div className="text-xs text-gray-500">
                      {call.acceptedAt.toLocaleString(
                        language === "az" ? "az-AZ" : language === "ru" ? "ru-RU" : "en-US",
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {activeTab === "profile" && (
          <div className="p-4">
            <Card>
              <CardHeader>
                <CardTitle>{t.profile}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">{t.phoneNumber}</p>
                  <p className="font-semibold">+994 55 123 45 67</p>
                </div>
                <Button onClick={logout} className="w-full bg-red-600 hover:bg-red-700">
                  {t.logout}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <Dialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {language === "az" ? "Çağrışı Qəbul Et?" : language === "ru" ? "Принять вызов?" : "Accept Call?"}
            </DialogTitle>
            <DialogDescription>
              {language === "az"
                ? `${selectedNotification?.patientName} üçün çağrışı qəbul etmək istədiyinizdən əminsiniz?`
                : language === "ru"
                  ? `Вы уверены, что хотите принять вызов для ${selectedNotification?.patientName}?`
                  : `Are you sure you want to accept the call for ${selectedNotification?.patientName}?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setShowAcceptDialog(false)}>
              {t.no}
            </Button>
            <Button onClick={handleConfirmAccept} className="bg-green-600 hover:bg-green-700">
              {t.yes}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white">
        <div className="mx-auto flex max-w-md">
          <button
            onClick={() => setActiveTab("notifications")}
            className={`flex flex-1 flex-col items-center gap-1 py-3 transition-colors ${
              activeTab === "notifications" ? "text-red-600" : "text-gray-400"
            }`}
          >
            <Bell className="h-6 w-6" />
            <span className="text-xs font-medium">{t.emergency}</span>
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`flex flex-1 flex-col items-center gap-1 py-3 transition-colors ${
              activeTab === "history" ? "text-red-600" : "text-gray-400"
            }`}
          >
            <Clock className="h-6 w-6" />
            <span className="text-xs font-medium">{t.callHistory}</span>
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`flex flex-1 flex-col items-center gap-1 py-3 transition-colors ${
              activeTab === "profile" ? "text-red-600" : "text-gray-400"
            }`}
          >
            <User className="h-6 w-6" />
            <span className="text-xs font-medium">{t.profile}</span>
          </button>
        </div>
      </nav>
    </div>
  )
}
