export interface Location {
  latitude: number
  longitude: number
  address: string
}

export type UserType = "user" | "driver"

export interface User {
  id: string
  firstName: string
  lastName: string
  phoneNumber: string
  finCode: string
  userType: "user"
}

export interface Driver {
  id: string
  phoneNumber: string
  finCode: string
  userType: "driver"
}

export interface CallNotification {
  id: string
  patientName: string
  patientPhone: string
  reason: string
  location: Location
  timestamp: Date
  status: "pending" | "accepted" | "completed"
  medicalNotes?: string
}
