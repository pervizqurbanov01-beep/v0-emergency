"use client"

import type { Location } from "@/lib/types"
import { MapPin } from "lucide-react"

interface MiniMapPreviewProps {
  location: Location
}

export function MiniMapPreview({ location }: MiniMapPreviewProps) {
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${location.longitude - 0.005},${location.latitude - 0.005},${location.longitude + 0.005},${location.latitude + 0.005}&layer=mapnik&marker=${location.latitude},${location.longitude}`

  return (
    <div className="relative w-full h-[200px] bg-muted rounded-lg overflow-hidden border">
      <iframe src={mapUrl} className="w-full h-full" style={{ border: 0 }} loading="lazy" title="Mini Map Preview" />
      <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded shadow-sm flex items-center gap-1">
        <MapPin className="h-3 w-3 text-red-600" />
        <span className="text-xs font-medium">{location.address}</span>
      </div>
    </div>
  )
}
