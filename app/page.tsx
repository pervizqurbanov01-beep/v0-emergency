"use client"

import { useAuth } from "@/lib/auth-context"
import EmergencyApp from "@/components/emergency-app"
import DriverDashboard from "@/components/driver-dashboard"
import LoginPage from "@/components/login-page"

export default function Page() {
  const { isAuthenticated, userType } = useAuth()

  if (!isAuthenticated) {
    return <LoginPage />
  }

  if (userType === "driver") {
    return <DriverDashboard />
  }

  return (
    <div className="mx-auto max-w-md bg-white">
      <EmergencyApp />
    </div>
  )
}
