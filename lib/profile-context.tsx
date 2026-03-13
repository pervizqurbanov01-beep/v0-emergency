"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { supabase } from "./supabase"
import { useAuth } from "./auth-context"

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
  updateProfile: (updates: Partial<Profile>) => Promise<void>
  isLoading: boolean
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
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  // Load profile on mount or when user changes
  useEffect(() => {
    if (user?.id) {
      loadProfile(user.id)
    } else {
      setProfile(defaultProfile)
      setIsLoading(false)
    }
  }, [user?.id])

  const loadProfile = async (userId: string) => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single()

      if (error && error.code !== "PGRST116") {
        // PGRST116 means no rows found, which is expected for new users
        console.error("[v0] Error loading profile:", error)
        return
      }

      if (data) {
        setProfile({
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          phoneNumber: data.phone_number || "",
          dateOfBirth: data.date_of_birth || "",
          gender: data.gender || "",
          address: data.address || "",
          medicalHistory: data.medical_history || "",
          bloodType: data.blood_type || "",
        })
      } else {
        setProfile(defaultProfile)
      }
    } catch (err) {
      console.error("[v0] Failed to load profile:", err)
      setProfile(defaultProfile)
    } finally {
      setIsLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user?.id) {
      console.error("[v0] No user authenticated")
      return
    }

    try {
      const updatedProfile = { ...profile, ...updates }
      setProfile(updatedProfile)

      const { error } = await supabase.from("profiles").upsert(
        {
          user_id: user.id,
          first_name: updatedProfile.firstName,
          last_name: updatedProfile.lastName,
          phone_number: updatedProfile.phoneNumber,
          date_of_birth: updatedProfile.dateOfBirth,
          gender: updatedProfile.gender,
          address: updatedProfile.address,
          medical_history: updatedProfile.medicalHistory,
          blood_type: updatedProfile.bloodType,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      )

      if (error) {
        console.error("[v0] Error updating profile:", error)
        throw error
      }
    } catch (err) {
      console.error("[v0] Failed to update profile:", err)
      throw err
    }
  }

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, isLoading }}>{children}</ProfileContext.Provider>
  )
}

export function useProfile() {
  const context = useContext(ProfileContext)
  if (!context) {
    throw new Error("useProfile must be used within ProfileProvider")
  }
  return context
}
