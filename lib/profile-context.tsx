"use client"

import type React from "react"

import { createContext, useContext, useState } from "react"

export interface Profile {
  firstName: string
  lastName: string
  phoneNumber: string
  dateOfBirth: string
  gender: string
  address: string
  medicalHistory: string
  bloodType: string
}

interface ProfileContextType {
  profile: Profile
  updateProfile: (updates: Partial<Profile>) => void
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

const defaultProfile: Profile = {
  firstName: "",
  lastName: "",
  phoneNumber: "",
  dateOfBirth: "",
  gender: "",
  address: "",
  medicalHistory: "",
  bloodType: "",
}

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile>(defaultProfile)

  const updateProfile = (updates: Partial<Profile>) => {
    setProfile((prev) => ({ ...prev, ...updates }))
  }

  return <ProfileContext.Provider value={{ profile, updateProfile }}>{children}</ProfileContext.Provider>
}

export function useProfile() {
  const context = useContext(ProfileContext)
  if (!context) {
    throw new Error("useProfile must be used within ProfileProvider")
  }
  return context
}
