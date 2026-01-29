"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface OnomatopoeiaProps {
  text: string
  color?: "yellow" | "violet" | "red" | "white"
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  delay?: number
  trigger?: boolean
}

const colorMap = {
  yellow: "text-waw-yellow",
  violet: "text-waw-violet",
  red: "text-waw-red",
  white: "text-waw-white",
}

const sizeMap = {
  sm: "text-2xl md:text-3xl",
  md: "text-4xl md:text-5xl",
  lg: "text-5xl md:text-7xl",
  xl: "text-6xl md:text-9xl",
}

export function Onomatopoeia({
  text,
  color = "yellow",
  size = "md",
  className = "",
  delay = 0,
  trigger = true,
}: OnomatopoeiaProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (trigger) {
      const timer = setTimeout(() => setShow(true), delay)
      return () => clearTimeout(timer)
    }
  }, [trigger, delay])

  return (
    <AnimatePresence>
      {show && (
        <motion.span
          initial={{ scale: 0, rotate: -20, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 15,
          }}
          className={`
            font-[var(--font-comic)] font-bold inline-block
            ${colorMap[color]} ${sizeMap[size]}
            drop-shadow-[4px_4px_0_#000] 
            ${className}
          `}
          style={{
            WebkitTextStroke: "2px #000",
            paintOrder: "stroke fill",
          }}
        >
          {text}
        </motion.span>
      )}
    </AnimatePresence>
  )
}
