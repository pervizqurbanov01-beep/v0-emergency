"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import type { User, Driver, UserType } from "@/lib/types"
import { supabase } from "./supabase"

interface AuthContextType {
  isAuthenticated: boolean
  userType: UserType | null
  user: User | Driver | null
  login: (userType: UserType, credentials: any) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userType, setUserType] = useState<UserType | null>(null)
  const [user, setUser] = useState<User | Driver | null>(null)

  const login = async (type: UserType, credentials: any): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("fin", credentials.finCode)
        .eq("phone_number", credentials.phoneNumber)
        .eq("role", type)
        .single()

      if (error || !data) {
        console.error("[v0] User not found:", error)
        return false
      }

      if (!data.is_active) {
        console.error("[v0] User account is inactive")
        return false
      }

      setUserType(type)
      setIsAuthenticated(true)

      if (type === "user") {
        setUser({
          id: data.id,
          firstName: data.first_name,
          lastName: data.last_name,
          phoneNumber: data.phone_number,
          finCode: data.fin_code,
          userType: "user",
        })
      } else {
        setUser({
          id: data.id,
          phoneNumber: data.phone_number,
          finCode: data.fin_code,
          userType: "driver",
        })
      }

      return true
    } catch (err) {
      console.error("[v0] Login error:", err)
      return false
    }
  }

  const logout = () => {
    setIsAuthenticated(false)
    setUserType(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, userType, user, login, logout }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
