"use client"

import { useEffect, useState } from "react"
import { MapPin, Navigation } from "lucide-react"

interface AmbulanceLocation {
  lat: number
  lng: number
}

export function AmbulanceMap({
  status,
}: {
  status: "dispatched" | "en-route" | "arriving" | "arrived"
}) {
  const [ambulanceLocation, setAmbulanceLocation] = useState<AmbulanceLocation>({
    lat: 40.3939,
    lng: 49.8671,
  })

  useEffect(() => {
    if (status === "dispatched") {
      // Depot location (starting point)
      setAmbulanceLocation({ lat: 40.3939, lng: 49.8671 })
    } else if (status === "en-route") {
      // Moving towards patient
      setAmbulanceLocation({ lat: 40.4, lng: 49.88 })
    } else if (status === "arriving") {
      // Getting closer
      setAmbulanceLocation({ lat: 40.405, lng: 49.89 })
    } else if (status === "arrived") {
      // Reached destination
      setAmbulanceLocation({ lat: 40.41, lng: 49.9 })
    }
  }, [status])

  return (
    <div className="relative h-64 overflow-hidden rounded-lg bg-gradient-to-b from-blue-50 to-blue-100 border border-blue-200">
      {/* Map background with grid */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="absolute inset-0 opacity-10">
          <svg className="h-full w-full" viewBox="0 0 100 100">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>

        {/* Ambulance marker with pulsing animation */}
        <div className="absolute z-10 transition-all duration-500">
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${((ambulanceLocation.lng - 49.85) / 0.1) * 100}%`,
              top: `${((40.42 - ambulanceLocation.lat) / 0.05) * 100}%`,
            }}
          >
            {/* Pulsing circle */}
            <div className="absolute h-4 w-4 rounded-full bg-red-500 opacity-75 -translate-x-1/2 -translate-y-1/2 animate-pulse" />

            {/* Ambulance icon */}
            <div className="absolute -translate-x-1/2 -translate-y-1/2">
              <div className="h-8 w-8 rounded-full bg-red-600 flex items-center justify-center">
                <Navigation className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Destination marker (fixed) */}
        <div className="absolute z-5 -translate-x-1/2 -translate-y-1/2" style={{ left: "75%", top: "20%" }}>
          <div className="h-4 w-4 rounded-full border-2 border-blue-600 bg-blue-100" />
          <div className="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-blue-600 font-medium bg-white px-2 py-1 rounded border border-blue-200">
            Your Location
          </div>
        </div>
      </div>

      {/* Bottom info overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
        <div className="flex items-center gap-2 text-white">
          <MapPin className="h-4 w-4" />
          <span className="text-xs font-medium">
            Lat: {ambulanceLocation.lat.toFixed(4)}, Lng: {ambulanceLocation.lng.toFixed(4)}
          </span>
        </div>
      </div>
    </div>
  )
}
