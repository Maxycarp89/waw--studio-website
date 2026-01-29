"use client"

import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Onomatopoeia } from "@/components/comic/onomatopoeia"

export function EasterEggs() {
  const [showWaw, setShowWaw] = useState(false)
  const [showBoom, setShowBoom] = useState(false)
  const [typedKeys, setTypedKeys] = useState("")

  // Double click easter egg
  const handleDoubleClick = useCallback(() => {
    setShowWaw(true)
    setTimeout(() => setShowWaw(false), 2000)
  }, [])

  // Keyboard easter egg - type "boom"
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const newTyped = (typedKeys + e.key).slice(-4)
      setTypedKeys(newTyped)

      if (newTyped.toLowerCase() === "boom") {
        setShowBoom(true)
        setTimeout(() => setShowBoom(false), 3000)
        setTypedKeys("")
      }
    }

    window.addEventListener("keypress", handleKeyPress)
    return () => window.removeEventListener("keypress", handleKeyPress)
  }, [typedKeys])

  useEffect(() => {
    window.addEventListener("dblclick", handleDoubleClick)
    return () => window.removeEventListener("dblclick", handleDoubleClick)
  }, [handleDoubleClick])

  return (
    <>
      {/* Double click WAW! */}
      <AnimatePresence>
        {showWaw && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 45 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <Onomatopoeia text="¡WAW!" color="yellow" size="xl" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BOOM explosion */}
      <AnimatePresence>
        {showBoom && (
          <motion.div
            className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Multiple explosions */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  top: `${20 + Math.random() * 60}%`,
                  left: `${10 + Math.random() * 80}%`,
                }}
                initial={{ scale: 0, rotate: Math.random() * 360 }}
                animate={{ scale: [0, 1.5, 1], rotate: Math.random() * 360 }}
                exit={{ scale: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Onomatopoeia
                  text={["BOOM!", "POW!", "ZAP!", "CRASH!", "BANG!"][i]}
                  color={["yellow", "red", "violet", "yellow", "red"][i] as "yellow" | "red" | "violet"}
                  size="lg"
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
