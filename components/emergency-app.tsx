"use client"

import { useState } from "react"
import { MainPage } from "@/components/main-page"
import { HistoryPage } from "@/components/history-page"
import { ProfilePage } from "@/components/profile-page"
import { Home, Clock, User } from "lucide-react"

export default function EmergencyApp() {
  const [activeTab, setActiveTab] = useState<"main" | "history" | "profile">("main")

  return (
    <div className="flex h-screen flex-col bg-white">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        {activeTab === "main" && <MainPage />}
        {activeTab === "history" && <HistoryPage />}
        {activeTab === "profile" && <ProfilePage />}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white">
        <div className="mx-auto flex max-w-md">
          <button
            onClick={() => setActiveTab("main")}
            className={`flex flex-1 flex-col items-center gap-1 py-3 transition-colors ${
              activeTab === "main" ? "text-red-600" : "text-gray-400"
            }`}
          >
            <Home className="h-6 w-6" />
            <span className="text-xs font-medium">Emergency</span>
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`flex flex-1 flex-col items-center gap-1 py-3 transition-colors ${
              activeTab === "history" ? "text-red-600" : "text-gray-400"
            }`}
          >
            <Clock className="h-6 w-6" />
            <span className="text-xs font-medium">History</span>
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`flex flex-1 flex-col items-center gap-1 py-3 transition-colors ${
              activeTab === "profile" ? "text-red-600" : "text-gray-400"
            }`}
          >
            <User className="h-6 w-6" />
            <span className="text-xs font-medium">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  )
}
