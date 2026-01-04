"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import type { User, Driver, UserType } from "@/lib/types"

interface AuthContextType {
  isAuthenticated: boolean
  userType: UserType | null
  user: User | Driver | null
  login: (userType: UserType, credentials: any) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userType, setUserType] = useState<UserType | null>(null)
  const [user, setUser] = useState<User | Driver | null>(null)

  const login = (type: UserType, credentials: any) => {
    setUserType(type)
    setIsAuthenticated(true)

    if (type === "user") {
      setUser({
        id: Date.now().toString(),
        firstName: credentials.firstName,
        lastName: credentials.lastName,
        phoneNumber: credentials.phoneNumber,
        finCode: credentials.finCode,
        userType: "user",
      })
    } else {
      setUser({
        id: Date.now().toString(),
        phoneNumber: credentials.phoneNumber,
        finCode: credentials.finCode,
        userType: "driver",
      })
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
