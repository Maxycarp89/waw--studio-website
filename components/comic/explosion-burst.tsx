"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface ExplosionBurstProps {
  children: ReactNode
  className?: string
  color?: "yellow" | "violet" | "red"
  size?: "sm" | "md" | "lg"
}

const colorMap = {
  yellow: "#FFD633",
  violet: "#7B2FF7",
  red: "#FF4F4F",
}

const sizeMap = {
  sm: "w-24 h-24",
  md: "w-40 h-40",
  lg: "w-64 h-64",
}

export function ExplosionBurst({ children, className = "", color = "yellow", size = "md" }: ExplosionBurstProps) {
  return (
    <motion.div
      className={`relative flex items-center justify-center ${sizeMap[size]} ${className}`}
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      <svg
        viewBox="0 0 200 200"
        className="absolute inset-0 w-full h-full"
        style={{ filter: "drop-shadow(4px 4px 0 #000)" }}
      >
        <path
          d="M100,0 L115,70 L185,50 L140,95 L200,130 L130,130 L150,200 L100,150 L50,200 L70,130 L0,130 L60,95 L15,50 L85,70 Z"
          fill={colorMap[color]}
          stroke="#000"
          strokeWidth="4"
        />
      </svg>
      <div className="relative z-10 flex items-center justify-center">{children}</div>
    </motion.div>
  )
}
