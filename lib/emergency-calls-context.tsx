"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { supabase } from "./supabase"

export interface EmergencyCall {
  id: string
  reason: string
  callFor: "me" | "someone"
  location: string
  timestamp: Date
  status: "completed" | "cancelled" | "active" | "waiting"
  voiceMessage?: File | null
  callerFirstName?: string
  callerLastName?: string
  callerPhone?: string
  latitude?: number
  longitude?: number
  address?: string
}

interface EmergencyCallsContextType {
  calls: EmergencyCall[]
  addCall: (call: Omit<EmergencyCall, "id">) => Promise<string>
  cancelCall: (callId: string) => Promise<void>
  completeCall: (callId: string) => Promise<void>
  getActiveCall: () => EmergencyCall | null
}

const EmergencyCallsContext = createContext<EmergencyCallsContextType | undefined>(undefined)

export function EmergencyCallsProvider({ children }: { children: React.ReactNode }) {
  const [calls, setCalls] = useState<EmergencyCall[]>([])

  // Load calls on mount
  useEffect(() => {
    loadCalls()
    subscribeToChanges()
  }, [])

  const loadCalls = async () => {
    try {
      const { data, error } = await supabase.from("emergency_calls").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("[v0] Error loading calls:", error)
        return
      }

      const transformedCalls: EmergencyCall[] = (data || []).map((call: any) => ({
        id: call.id,
        reason: call.reason,
        callFor: call.call_for || "me",
        location: call.address || "",
        timestamp: new Date(call.created_at),
        status: call.status || "waiting",
        callerFirstName: call.caller_first_name,
        callerLastName: call.caller_last_name,
        callerPhone: call.caller_phone,
        latitude: call.latitude,
        longitude: call.longitude,
        address: call.address,
      }))

      setCalls(transformedCalls)
    } catch (err) {
      console.error("[v0] Failed to load calls:", err)
    }
  }

  const subscribeToChanges = () => {
    const channel = supabase
      .channel("emergency_calls")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "emergency_calls",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newCall: EmergencyCall = {
              id: payload.new.id,
              reason: payload.new.reason,
              callFor: payload.new.call_for || "me",
              location: payload.new.address || "",
              timestamp: new Date(payload.new.created_at),
              status: payload.new.status || "waiting",
              callerFirstName: payload.new.caller_first_name,
              callerLastName: payload.new.caller_last_name,
              callerPhone: payload.new.caller_phone,
              latitude: payload.new.latitude,
              longitude: payload.new.longitude,
              address: payload.new.address,
            }
            setCalls((prev) => [newCall, ...prev])
          } else if (payload.eventType === "UPDATE") {
            setCalls((prev) =>
              prev.map((call) =>
                call.id === payload.new.id
                  ? {
                      ...call,
                      status: payload.new.status,
                      reason: payload.new.reason,
                    }
                  : call
              )
            )
          } else if (payload.eventType === "DELETE") {
            setCalls((prev) => prev.filter((call) => call.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  const addCall = async (call: Omit<EmergencyCall, "id">): Promise<string> => {
    try {
      const { data, error } = await supabase
        .from("emergency_calls")
        .insert({
          caller_first_name: call.callerFirstName,
          caller_last_name: call.callerLastName,
          caller_phone: call.callerPhone,
          reason: call.reason,
          call_for: call.callFor || "me",
          latitude: call.latitude,
          longitude: call.longitude,
          address: call.address || call.location,
          status: "waiting",
        })
        .select()
        .single()

      if (error) {
        console.error("[v0] Error adding call:", error)
        throw error
      }

      return data.id
    } catch (err) {
      console.error("[v0] Failed to add call:", err)
      throw err
    }
  }

  const cancelCall = async (callId: string) => {
    try {
      const { error } = await supabase.from("emergency_calls").update({ status: "cancelled" }).eq("id", callId)

      if (error) {
        console.error("[v0] Error cancelling call:", error)
        throw error
      }
    } catch (err) {
      console.error("[v0] Failed to cancel call:", err)
      throw err
    }
  }

  const completeCall = async (callId: string) => {
    try {
      const { error } = await supabase.from("emergency_calls").update({ status: "completed" }).eq("id", callId)

      if (error) {
        console.error("[v0] Error completing call:", error)
        throw error
      }
    } catch (err) {
      console.error("[v0] Failed to complete call:", err)
      throw err
    }
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
