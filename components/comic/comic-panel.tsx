"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface ComicPanelProps {
  children: ReactNode
  className?: string
  variant?: "default" | "yellow" | "violet" | "red"
  hover?: boolean
}

const variantStyles = {
  default: "bg-waw-white",
  yellow: "bg-waw-yellow",
  violet: "bg-waw-violet text-waw-white",
  red: "bg-waw-red text-waw-white",
}

export function ComicPanel({ children, className = "", variant = "default", hover = true }: ComicPanelProps) {
  return (
    <motion.div
      className={`
        comic-border rounded-lg p-6 relative overflow-hidden
        ${variantStyles[variant]}
        ${className}
      `}
      whileHover={
        hover
          ? {
              scale: 1.02,
              rotate: 0.5,
              boxShadow: "10px 10px 0 #000",
            }
          : {}
      }
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.div>
  )
}
