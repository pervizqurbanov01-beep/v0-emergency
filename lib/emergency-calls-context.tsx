"use client"

import type React from "react"

import { createContext, useContext, useState } from "react"

export interface EmergencyCall {
  id: string
  reason: string
  callFor: "me" | "someone"
  location: string
  timestamp: Date
  status: "completed" | "cancelled" | "active"
  voiceMessage?: File | null
}

interface EmergencyCallsContextType {
  calls: EmergencyCall[]
  addCall: (call: Omit<EmergencyCall, "id">) => string
  cancelCall: (callId: string) => void
  completeCall: (callId: string) => void
  getActiveCall: () => EmergencyCall | null
}

const EmergencyCallsContext = createContext<EmergencyCallsContextType | undefined>(undefined)

export function EmergencyCallsProvider({ children }: { children: React.ReactNode }) {
  const [calls, setCalls] = useState<EmergencyCall[]>([])

  const addCall = (call: Omit<EmergencyCall, "id">) => {
    const id = `call-${Date.now()}`
    setCalls((prev) => [{ ...call, id }, ...prev])
    return id
  }

  const cancelCall = (callId: string) => {
    setCalls((prev) => prev.map((call) => (call.id === callId ? { ...call, status: "cancelled" } : call)))
  }

  const completeCall = (callId: string) => {
    setCalls((prev) => prev.map((call) => (call.id === callId ? { ...call, status: "completed" } : call)))
  }

  const getActiveCall = () => {
    return calls.find((call) => call.status === "active") || null
  }

  return (
    <EmergencyCallsContext.Provider value={{ calls, addCall, cancelCall, completeCall, getActiveCall }}>
      {children}
    </EmergencyCallsContext.Provider>
  )
}

export function useEmergencyCalls() {
  const context = useContext(EmergencyCallsContext)
  if (!context) {
    throw new Error("useEmergencyCalls must be used within EmergencyCallsProvider")
  }
  return context
}
