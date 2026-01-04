"use client"

import { useEffect, useRef } from "react"

export function CardiogramCircle() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let progress = 0

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      ctx.strokeStyle = "white"
      ctx.lineWidth = 2
      ctx.beginPath()

      const centerY = canvas.height / 2
      const drawWidth = progress % (canvas.width + 60)

      for (let x = 0; x < canvas.width; x++) {
        let y = centerY
        const position = x % 60

        // P wave (small bump before QRS)
        if (position >= 3 && position < 8) {
          y = centerY - 6 * Math.sin(((position - 3) / 5) * Math.PI)
        }
        // Q wave (small downward)
        else if (position >= 12 && position < 14) {
          y = centerY + 8
        }
        // R wave (tall spike upward) - significantly increased
        else if (position >= 14 && position < 17) {
          const p = (position - 14) / 3
          y = centerY - 24 * Math.sin(p * Math.PI)
        }
        // S wave (sharp downward) - increased
        else if (position >= 17 && position < 20) {
          const p = (position - 17) / 3
          y = centerY + 12 * Math.sin(p * Math.PI)
        }
        // T wave (rounded bump after QRS)
        else if (position >= 24 && position < 32) {
          y = centerY - 8 * Math.sin(((position - 24) / 8) * Math.PI)
        }

        // Only draw up to the progress point
        if (x < drawWidth) {
          if (x === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }
      }

      ctx.stroke()

      // Draw a moving vertical line at the drawing point (like a recording cursor)
      if (drawWidth < canvas.width) {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.5)"
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(drawWidth, 0)
        ctx.lineTo(drawWidth, canvas.height)
        ctx.stroke()
      }

      progress += 1
      const animationId = requestAnimationFrame(animate)

      return () => {
        cancelAnimationFrame(animationId)
      }
    }

    const animationId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <div className="relative">
      <div className="flex h-32 w-32 items-center justify-center rounded-full bg-red-400 shadow-lg">
        <canvas ref={canvasRef} width={110} height={48} className="rounded-full" />
      </div>
    </div>
  )
}
