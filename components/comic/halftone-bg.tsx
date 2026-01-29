"use client"

import { useEffect, useRef } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

interface HalftoneBgProps {
  className?: string
}

export function HalftoneBg({ className = "" }: HalftoneBgProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width - 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5
        mouseX.set(x * 50)
        mouseY.set(y * 50)
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <div ref={containerRef} className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-waw-yellow via-waw-white to-waw-violet opacity-30" />

      {/* Animated halftone layers */}
      <motion.div className="absolute inset-0 halftone-yellow opacity-40" style={{ x: springX, y: springY }} />
      <motion.div
        className="absolute inset-0 halftone-violet opacity-20"
        style={{ x: springX, y: springY, scale: 1.1 }}
      />

      {/* Decorative elements */}
      <motion.div
        className="absolute top-10 right-10 w-32 h-32 rounded-full bg-waw-red opacity-20"
        animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
        transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-20 left-20 w-48 h-48 rounded-full bg-waw-violet opacity-15"
        animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
        transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />
    </div>
  )
}
