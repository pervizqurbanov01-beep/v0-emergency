"use client"

import { useLanguage } from "@/lib/language-context"
import { useProfile } from "@/lib/profile-context"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent } from "@/components/ui/card"
import { User, Phone, Calendar, Heart, Droplet } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function ProfilePage() {
  const { t } = useLanguage()
  const { profile, updateProfile } = useProfile()
  const { logout } = useAuth()
  const [saveSuccess, setSaveSuccess] = useState(false)

  const handleSave = () => {
    localStorage.setItem("userProfile", JSON.stringify(profile))
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
    console.log("[v0] Profile saved to system:", profile)
  }

  const parseDate = (dateString: string) => {
    if (!dateString) return { day: "", month: "", year: "" }
    const [year, month, day] = dateString.split("-")
    return { day: day || "", month: month || "", year: year || "" }
  }

  const formatDate = (day: string, month: string, year: string) => {
    if (!day || !month || !year) return ""
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
  }

  const { day, month, year } = parseDate(profile.dateOfBirth)

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear - 1950 + 1 }, (_, i) => currentYear - i)

  const days = Array.from({ length: 31 }, (_, i) => i + 1)

  const months = t.months

  return (
    <div className="h-full overflow-y-auto p-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">{t.profile}</h1>

      <div className="space-y-6">
        <Card className="border-gray-200">
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <User className="h-5 w-5 text-red-600" />
              <h2 className="text-lg font-semibold text-gray-900">{t.personalInformation}</h2>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{t.firstName}</Label>
                  <Input
                    id="firstName"
                    value={profile.firstName}
                    onChange={(e) => updateProfile({ firstName: e.target.value })}
                    placeholder={t.firstName}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">{t.lastName}</Label>
                  <Input
                    id="lastName"
                    value={profile.lastName}
                    onChange={(e) => updateProfile({ lastName: e.target.value })}
                    placeholder={t.lastName}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-red-600" />
                  {t.phoneNumber}
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={profile.phoneNumber}
                  onChange={(e) => updateProfile({ phoneNumber: e.target.value })}
                  placeholder="+994 XX XXX XX XX"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-red-600" />
                  {t.dateOfBirth}
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  <Select
                    value={day}
                    onValueChange={(value) => updateProfile({ dateOfBirth: formatDate(value, month, year) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t.day} />
                    </SelectTrigger>
                    <SelectContent>
                      {days.map((d) => (
                        <SelectItem key={d} value={d.toString()}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={month}
                    onValueChange={(value) => updateProfile({ dateOfBirth: formatDate(day, value, year) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t.month} />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((m) => (
                        <SelectItem key={m.value} value={m.value}>
                          {m.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={year}
                    onValueChange={(value) => updateProfile({ dateOfBirth: formatDate(day, month, value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t.year} />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((y) => (
                        <SelectItem key={y} value={y.toString()}>
                          {y}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender" className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-600" />
                  {t.gender}
                </Label>
                <Select value={profile.gender} onValueChange={(value) => updateProfile({ gender: value })}>
                  <SelectTrigger id="gender">
                    <SelectValue placeholder={t.selectGender} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">{t.male}</SelectItem>
                    <SelectItem value="female">{t.female}</SelectItem>
                    <SelectItem value="other">{t.otherGender}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <Heart className="h-5 w-5 text-red-600" />
              <h2 className="text-lg font-semibold text-gray-900">{t.medicalHistory}</h2>
            </div>

            <div className="space-y-2">
              <Label htmlFor="medical-history">{t.medicalHistory}</Label>
              <Textarea
                id="medical-history"
                value={profile.medicalHistory}
                onChange={(e) => updateProfile({ medicalHistory: e.target.value })}
                placeholder={t.enterMedicalHistory}
                className="resize-none"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <Droplet className="h-5 w-5 text-red-600" />
              <h2 className="text-lg font-semibold text-gray-900">{t.bloodType}</h2>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bloodType">{t.selectBloodType}</Label>
              <Select value={profile.bloodType} onValueChange={(value) => updateProfile({ bloodType: value })}>
                <SelectTrigger id="bloodType">
                  <SelectValue placeholder={t.selectBloodType} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={handleSave}
          className={`w-full py-6 text-lg font-semibold text-white transition-colors ${
            saveSuccess ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {saveSuccess ? "✓ " + t.saveProfile : t.saveProfile}
        </Button>

        <Button onClick={logout} className="w-full bg-gray-700 hover:bg-gray-800 py-6 text-lg font-semibold text-white">
          {t.logout}
        </Button>
      </div>
    </div>
  )
}
