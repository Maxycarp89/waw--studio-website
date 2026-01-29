"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Onomatopoeia } from "@/components/comic/onomatopoeia"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Send, Mail, Phone, MapPin } from "lucide-react"

export function Contact() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSubmitted(true)
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
          <h2 className="font-[var(--font-comic)] text-4xl md:text-6xl text-waw-white mb-4">¡HABLEMOS!</h2>
          <p className="text-waw-white/80 text-xl max-w-2xl mx-auto">
            ¿Listo para tu próxima misión digital? Contanos tu idea
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto items-start">
          {/* Contact form in shout bubble */}
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            {!isSubmitted ? (
              <div className="shout-bubble p-8 md:p-12 relative">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="font-[var(--font-comic)] text-xl text-waw-black block mb-2">Tu nombre</label>
                    <Input
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      placeholder="Batman, Superman, o tu nombre real..."
                      className="border-4 border-waw-black text-lg py-6"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-[var(--font-comic)] text-xl text-waw-black block mb-2">Tu email</label>
                    <Input
                      type="email"
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      placeholder="heroe@ciudadgotica.com"
                      className="border-4 border-waw-black text-lg py-6"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-[var(--font-comic)] text-xl text-waw-black block mb-2">Tu mensaje</label>
                    <Textarea
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      placeholder="Contanos sobre tu misión..."
                      className="border-4 border-waw-black text-lg min-h-32"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full comic-border bg-waw-red hover:bg-waw-red/90 text-waw-white font-[var(--font-comic)] text-2xl py-6"
                  >
                    {isSubmitting ? (
                      "ENVIANDO..."
                    ) : (
                      <>
                        <Send className="mr-2 h-6 w-6" />
                        ¡ENVIAR MENSAJE!
                      </>
                    )}
                  </Button>
                </form>
              </div>
            ) : (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="shout-bubble p-12 text-center">
                <Onomatopoeia text="¡WAW!" color="violet" size="xl" />
                <h3 className="font-[var(--font-comic)] text-3xl text-waw-black mt-6 mb-4">¡MENSAJE RECIBIDO!</h3>
                <p className="text-waw-black/80 text-lg">
                  Nuestro escuadrón revisará tu mensaje y te responderá pronto.
                </p>
              </motion.div>
            )}
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
              { icon: Phone, label: "Teléfono", value: "+54 11 1234-5678", color: "red" },
              { icon: MapPin, label: "Base de operaciones", value: "Buenos Aires, Argentina", color: "yellow" },
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
                  <p className="font-[var(--font-comic)] text-xl text-waw-black">{item.value}</p>
                </div>
              </motion.div>
            ))}

            {/* Social proof */}
            <div className="comic-border bg-waw-black p-6 mt-8">
              <p className="text-waw-yellow font-[var(--font-comic)] text-2xl text-center mb-4">
                +150 MISIONES COMPLETADAS
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
