"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface SpeechBubbleProps {
  children: ReactNode
  className?: string
  variant?: "speech" | "shout" | "thought"
  direction?: "left" | "right" | "bottom"
}

export function SpeechBubble({
  children,
  className = "",
  variant = "speech",
  direction = "bottom",
}: SpeechBubbleProps) {
  if (variant === "shout") {
    return (
      <motion.div
        className={`shout-bubble p-6 md:p-8 ${className}`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <motion.div
      className={`speech-bubble p-4 md:p-6 ${className}`}
      initial={{ scale: 0, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
    >
      {children}
    </motion.div>
  )
}
