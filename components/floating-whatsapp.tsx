"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X } from "lucide-react"

export function FloatingWhatsApp() {
  const [roiAmount, setRoiAmount] = useState<number | null>(null)
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  // Escuchar el monto dinámico de la calculadora ROI
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<number>).detail
      if (detail) setRoiAmount(detail)
    }
    window.addEventListener("roi-calculated", handler)
    return () => window.removeEventListener("roi-calculated", handler)
  }, [])

  // Mostrar el botón después de un breve scroll (300px)
  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 300)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const whatsappNumber = "5493816262536"
  const whatsappMessage = roiAmount
    ? encodeURIComponent(
        `Hola WAW! Studio 👋\nEstuve viendo la calculadora y pierdo $${roiAmount.toLocaleString("es-AR")} al año en tareas manuales.\nQuiero hablar con un héroe para solucionarlo 🚀`
      )
    : encodeURIComponent(
        `Hola WAW! Studio 👋\nQuiero hablar con un héroe sobre mi proyecto 🚀`
      )
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

  if (dismissed) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="fixed bottom-6 right-6 z-50 flex items-end gap-3"
        >
          {/* Pill label */}
          <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 comic-border bg-[#25D366] hover:bg-[#20bd5a] text-waw-white px-5 py-3.5 shadow-[4px_4px_0_rgba(0,0,0,1)] hover:shadow-[2px_2px_0_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <MessageCircle className="h-6 w-6 shrink-0" />
            <span className="font-(--font-comic) text-lg md:text-xl whitespace-nowrap">
              Hablar con un héroe ahora →
            </span>
          </motion.a>

          {/* Dismiss button */}
          <button
            onClick={() => setDismissed(true)}
            className="p-1.5 bg-waw-black/70 hover:bg-waw-black text-waw-white rounded-full border-2 border-waw-black transition-colors shrink-0"
            aria-label="Cerrar"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
