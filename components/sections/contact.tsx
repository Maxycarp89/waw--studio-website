"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Onomatopoeia } from "@/components/comic/onomatopoeia"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react"

export function Contact() {
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")
  const [roiAmount, setRoiAmount] = useState<number | null>(null)

  // Escuchar el monto de la calculadora ROI
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<number>).detail
      if (detail) setRoiAmount(detail)
    }
    window.addEventListener("roi-calculated", handler)
    return () => window.removeEventListener("roi-calculated", handler)
  }, [])

  const whatsappNumber = "5493816262536"

  const getWhatsAppUrl = () => {
    const name = email.split("@")[0] || ""
    const message = roiAmount
      ? `Hola WAW! Studio 👋\nSoy ${name}.\nSegún la calculadora pierdo $${roiAmount.toLocaleString("es-AR")}/año en tareas manuales.\nQuiero que me ayuden a automatizarlo 🚀\nMi email: ${email}`
      : `Hola WAW! Studio 👋\nSoy ${name}.\nQuiero hablar sobre mi proyecto 🚀\nMi email: ${email}`
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      setEmailError("Ingresá tu email para continuar")
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Ingresá un email válido")
      return
    }
    setEmailError("")
    window.open(getWhatsAppUrl(), "_blank")
  }

  return (
    <section className="py-20 bg-waw-violet relative overflow-hidden" id="contacto">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 border-4 border-waw-yellow/20 rounded-full" />
        <div className="absolute bottom-10 right-20 w-48 h-48 border-4 border-waw-red/20 transform rotate-45" />
        <div className="absolute top-1/2 left-1/3 halftone-yellow opacity-10 w-64 h-64" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-(--font-comic) text-4xl md:text-6xl text-waw-white mb-4">¡HABLEMOS!</h2>
          <p className="text-waw-white/80 text-xl max-w-2xl mx-auto">
            Dejá tu email, abrimos WhatsApp y arrancamos tu proyecto en minutos
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto items-start">
          {/* Formulario simplificado: email + WhatsApp */}
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="shout-bubble p-8 md:p-12 relative">
              {/* Indicador de monto desde calculadora */}
              {roiAmount && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-waw-red/10 border-4 border-waw-red/30 text-center"
                >
                  <p className="text-sm text-waw-black/60 mb-1">
                    Según la calculadora, estás perdiendo
                  </p>
                  <p className="font-(--font-comic) text-2xl text-waw-red">
                    ${roiAmount.toLocaleString("es-AR")}/año
                  </p>
                  <p className="text-xs text-waw-black/40 mt-1">
                    Este monto se incluirá en tu mensaje de WhatsApp
                  </p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="font-(--font-comic) text-xl text-waw-black block mb-2">
                    Tu email
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (emailError) setEmailError("")
                    }}
                    placeholder="heroe@ciudadgotica.com"
                    className="border-4 border-waw-black text-lg py-6"
                  />
                  {emailError && (
                    <p className="text-waw-red font-bold text-sm mt-2">{emailError}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full comic-border-thick bg-[#25D366] hover:bg-[#20bd5a] text-waw-white font-(--font-comic) text-2xl py-7 shadow-[4px_4px_0_rgba(0,0,0,1)] hover:shadow-[2px_2px_0_rgba(0,0,0,1)] transition-all"
                >
                  <MessageCircle className="mr-3 h-7 w-7" />
                  Abrir WhatsApp
                </Button>

                <p className="text-center text-waw-black/40 text-sm">
                  Te respondemos en menos de 2 horas 🚀
                </p>
              </form>
            </div>
          </motion.div>

          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Contact cards */}
            {[
              { icon: Mail, label: "Email", value: "hola@wawstudio.com", color: "yellow" },
              { icon: Phone, label: "Teléfono", value: "+54 381 626 2536", color: "red" },
              { icon: MapPin, label: "Base de operaciones", value: "Tucumán, Argentina", color: "yellow" },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="comic-border bg-waw-white p-6 flex items-center gap-4 group hover:translate-x-2 transition-transform"
              >
                <div
                  className={`p-3 ${item.color === "yellow" ? "bg-waw-yellow" : "bg-waw-red"} border-4 border-waw-black`}
                >
                  <item.icon className={`w-6 h-6 ${item.color === "yellow" ? "text-waw-black" : "text-waw-white"}`} />
                </div>
                <div>
                  <p className="font-bold text-waw-black/60 text-sm">{item.label}</p>
                  <p className="font-(--font-comic) text-xl text-waw-black">{item.value}</p>
                </div>
              </motion.div>
            ))}

            {/* Social proof */}
            <div className="comic-border bg-waw-black p-6 mt-8">
              <p className="text-waw-yellow font-(--font-comic) text-2xl text-center mb-4">
                +50 MISIONES COMPLETADAS
              </p>
              <div className="flex justify-center gap-4">
                {["⭐", "⭐", "⭐", "⭐", "⭐"].map((star, i) => (
                  <motion.span
                    key={i}
                    className="text-3xl"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    {star}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
