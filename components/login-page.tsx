"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, Users, Activity } from "lucide-react"
import Image from "next/image"

export default function LoginPage() {
  const { login } = useAuth()
  const { language, setLanguage, t } = useLanguage()
  const [userType, setUserType] = useState<"user" | "driver" | null>(null)
  const [step, setStep] = useState<"selection" | "otp" | "form">("selection")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    finCode: "",
    otp: "",
  })
  const [otpSent, setOtpSent] = useState(false)

  const translations = {
    en: {
      selectUserType: "Select Login Type",
      user: "User",
      driver: "Emergency Worker",
      firstName: "First Name",
      lastName: "Last Name",
      phoneNumber: "Phone Number",
      finCode: "FIN Code",
      otp: "Enter OTP",
      sendOtp: "Send OTP",
      verifyOtp: "Verify OTP",
      login: "Login",
      userLoginTitle: "User Login",
      driverLoginTitle: "Worker Login",
      verifyOtpMessage: "OTP sent to your phone",
      selectLanguage: "Select Language",
    },
    az: {
      selectUserType: "Giriş Tipini Seçin",
      user: "İstifadəçi",
      driver: "Təcili Yardım İşçisi",
      firstName: "Ad",
      lastName: "Soyad",
      phoneNumber: "Telefon Nömrəsi",
      finCode: "FİN Kod",
      otp: "OTP Kodunu Daxil Edin",
      sendOtp: "OTP Göndər",
      verifyOtp: "OTP Təsdiq Et",
      login: "Giriş",
      userLoginTitle: "İstifadəçi Girişi",
      driverLoginTitle: "İşçi Girişi",
      verifyOtpMessage: "OTP sizin telefon nömrənizə göndərildi",
      selectLanguage: "Dili Seçin",
    },
    ru: {
      selectUserType: "Выберите Тип Входа",
      user: "Пользователь",
      driver: "Работник Скорой",
      firstName: "Имя",
      lastName: "Фамилия",
      phoneNumber: "Номер Телефона",
      finCode: "Код ФИН",
      otp: "Введите OTP",
      sendOtp: "Отправить OTP",
      verifyOtp: "Проверить OTP",
      login: "Вход",
      userLoginTitle: "Вход для Пользователя",
      driverLoginTitle: "Вход для Работника",
      verifyOtpMessage: "OTP отправлено на ваш номер",
      selectLanguage: "Выберите Язык",
    },
  }

  const localT = translations[language]

  const handleUserTypeSelect = (type: "user" | "driver") => {
    setUserType(type)
    setStep(type === "driver" ? "otp" : "form")
  }

  const handleSendOtp = () => {
    if (formData.phoneNumber && formData.finCode) {
      setOtpSent(true)
    }
  }

  const handleVerifyOtp = () => {
    if (formData.otp) {
      login("driver", {
        phoneNumber: formData.phoneNumber,
        finCode: formData.finCode,
      })
    }
  }

  const handleUserLogin = () => {
    if (formData.firstName && formData.lastName && formData.phoneNumber && formData.finCode) {
      login("user", formData)
    }
  }

  if (step === "selection") {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-white p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="flex justify-center mb-4">
            <Image
              src="/images/life-saving-emergency-service-for-everyone-vector.jpg"
              alt={t.emergencyServiceLogo}
              width={128}
              height={128}
              className="object-contain"
            />
          </div>

          {/* Language Selection */}
          <div className="flex justify-center gap-2">
            {(["az", "ru", "en"] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  language === lang ? "bg-red-600 text-white" : "bg-gray-200 text-gray-700"
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>

          <h1 className="text-center text-3xl font-bold text-red-600">{localT.selectUserType}</h1>

          <div className="space-y-4">
            <Card
              onClick={() => handleUserTypeSelect("user")}
              className="cursor-pointer border-2 border-gray-200 hover:border-red-600 transition-colors"
            >
              <CardContent className="flex items-center gap-4 p-6">
                <Users className="h-10 w-10 text-red-600" />
                <div>
                  <h3 className="font-semibold text-lg">{localT.user}</h3>
                  <p className="text-sm text-gray-500">Təcili zəng üçün giriş</p>
                </div>
              </CardContent>
            </Card>

            <Card
              onClick={() => handleUserTypeSelect("driver")}
              className="cursor-pointer border-2 border-gray-200 hover:border-red-600 transition-colors"
            >
              <CardContent className="flex items-center gap-4 p-6">
                <Activity className="h-10 w-10 text-red-600" />
                <div>
                  <h3 className="font-semibold text-lg">{localT.driver}</h3>
                  <p className="text-sm text-gray-500">İşçi girişi üçün</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (step === "form" && userType === "user") {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-white p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">{localT.userLoginTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder={localT.firstName}
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
            <Input
              placeholder={localT.lastName}
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
            <Input
              placeholder={localT.phoneNumber}
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            />
            <Input
              placeholder={localT.finCode}
              value={formData.finCode}
              onChange={(e) => setFormData({ ...formData, finCode: e.target.value })}
            />
            <Button onClick={handleUserLogin} className="w-full bg-red-600 hover:bg-red-700">
              {localT.login}
            </Button>
            <Button onClick={() => setStep("selection")} variant="outline" className="w-full">
              Geri
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (step === "otp" && userType === "driver") {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-white p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">{localT.driverLoginTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!otpSent ? (
              <>
                <Input
                  placeholder={localT.phoneNumber}
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                />
                <Input
                  placeholder={localT.finCode}
                  value={formData.finCode}
                  onChange={(e) => setFormData({ ...formData, finCode: e.target.value })}
                />
                <Button onClick={handleSendOtp} className="w-full bg-red-600 hover:bg-red-700">
                  {localT.sendOtp}
                </Button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
                  <AlertCircle className="h-4 w-4" />
                  {localT.verifyOtpMessage}
                </div>
                <Input
                  placeholder={localT.otp}
                  value={formData.otp}
                  onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                />
                <Button onClick={handleVerifyOtp} className="w-full bg-red-600 hover:bg-red-700">
                  {localT.verifyOtp}
                </Button>
              </>
            )}
            <Button onClick={() => setStep("selection")} variant="outline" className="w-full">
              Geri
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }
}
