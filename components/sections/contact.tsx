"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Onomatopoeia } from "@/components/comic/onomatopoeia"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Send, Mail, Phone, MapPin, ArrowLeft, ArrowRight, MessageCircle } from "lucide-react"

const projectTypes = [
  { id: "web", label: "🌐 Desarrollo Web", value: "web" },
  { id: "automatizacion", label: "⚡ Automatización", value: "automatizacion" },
  { id: "branding", label: "🎨 Branding", value: "branding" },
  { id: "nosesabe", label: "🤔 No sé todavía", value: "nosesabe" },
]

const budgetRanges = [
  { label: "Menos de $500 USD", value: "< 500" },
  { label: "$500 - $2.000 USD", value: "500-2000" },
  { label: "$2.000 - $5.000 USD", value: "2000-5000" },
  { label: "Más de $5.000 USD", value: "> 5000" },
  { label: "No tengo claro", value: "indefinido" },
]

const sourceOptions = [
  "Google", "Instagram", "Recomendación", "LinkedIn", "Otro"
]

export function Contact() {
  const [step, setStep] = useState(1)
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    projectType: "",
    budget: "",
    source: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [step1Error, setStep1Error] = useState("")

  // Escuchar evento de preselección desde la calculadora ROI
  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<string>
      if (customEvent.detail) {
        setFormState((prev) => ({ ...prev, projectType: customEvent.detail }))
      }
    }
    window.addEventListener("preselect-project-type", handler)
    return () => window.removeEventListener("preselect-project-type", handler)
  }, [])

  const goToStep2 = () => {
    if (!formState.name.trim() || !formState.email.trim() || !formState.projectType) {
      setStep1Error("Completá todos los campos para continuar")
      return
    }
    // Validación básica de email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
      setStep1Error("Ingresá un email válido")
      return
    }
    setStep1Error("")
    setStep(2)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission — reemplazar con webhook de n8n
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const whatsappNumber = "5493816262536"
  const whatsappMessage = encodeURIComponent(
    `¡Hola WAW! Soy ${formState.name || "[nombre]"}. Me interesa un proyecto de ${formState.projectType || "desarrollo"} 🚀`
  )
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

  const slideVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction > 0 ? -300 : 300, opacity: 0 }),
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
            ¿Listo para tu próxima misión digital? Completá en 2 pasos rápidos
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto items-start">
          {/* Contact form — Progressive Profiling */}
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            {!isSubmitted ? (
              <div className="shout-bubble p-8 md:p-12 relative">
                {/* Progress bar */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-[var(--font-comic)] text-sm text-waw-black/60">
                      Paso {step} de 2
                    </span>
                    <span className="font-[var(--font-comic)] text-sm text-waw-black/60">
                      {step === 1 ? "Tu info" : "Tu proyecto"}
                    </span>
                  </div>
                  <div className="w-full h-3 bg-waw-black/10 border-2 border-waw-black overflow-hidden">
                    <motion.div
                      className="h-full bg-waw-violet"
                      initial={{ width: "50%" }}
                      animate={{ width: step === 1 ? "50%" : "100%" }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  <AnimatePresence mode="wait" custom={step}>
                    {step === 1 && (
                      <motion.div
                        key="step1"
                        custom={1}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.3 }}
                        className="space-y-5"
                      >
                        <div>
                          <label className="font-[var(--font-comic)] text-xl text-waw-black block mb-2">
                            Tu nombre
                          </label>
                          <Input
                            value={formState.name}
                            onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                            placeholder="Batman, Superman, o tu nombre real..."
                            className="border-4 border-waw-black text-lg py-6"
                          />
                        </div>

                        <div>
                          <label className="font-[var(--font-comic)] text-xl text-waw-black block mb-2">
                            Tu email
                          </label>
                          <Input
                            type="email"
                            value={formState.email}
                            onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                            placeholder="heroe@ciudadgotica.com"
                            className="border-4 border-waw-black text-lg py-6"
                          />
                        </div>

                        <div>
                          <label className="font-[var(--font-comic)] text-xl text-waw-black block mb-2">
                            ¿Qué necesitás?
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            {projectTypes.map((type) => (
                              <button
                                key={type.id}
                                type="button"
                                onClick={() => setFormState({ ...formState, projectType: type.value })}
                                className={`p-3 border-4 border-waw-black text-left font-semibold transition-all text-sm
                                  ${
                                    formState.projectType === type.value
                                      ? "bg-waw-violet text-waw-white scale-105"
                                      : "bg-waw-white text-waw-black hover:bg-waw-violet/10"
                                  }`}
                              >
                                {type.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {step1Error && (
                          <p className="text-waw-red font-bold text-sm">{step1Error}</p>
                        )}

                        <Button
                          type="button"
                          onClick={goToStep2}
                          className="w-full comic-border bg-waw-violet hover:bg-waw-violet/90 text-waw-white font-[var(--font-comic)] text-2xl py-6"
                        >
                          Siguiente
                          <ArrowRight className="ml-2 h-6 w-6" />
                        </Button>
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div
                        key="step2"
                        custom={2}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.3 }}
                        className="space-y-5"
                      >
                        <div>
                          <label className="font-[var(--font-comic)] text-xl text-waw-black block mb-2">
                            Presupuesto estimado
                          </label>
                          <div className="space-y-2">
                            {budgetRanges.map((range) => (
                              <button
                                key={range.value}
                                type="button"
                                onClick={() => setFormState({ ...formState, budget: range.value })}
                                className={`w-full p-3 border-4 border-waw-black text-left font-semibold transition-all text-sm
                                  ${
                                    formState.budget === range.value
                                      ? "bg-waw-yellow text-waw-black"
                                      : "bg-waw-white text-waw-black hover:bg-waw-yellow/20"
                                  }`}
                              >
                                {range.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="font-[var(--font-comic)] text-xl text-waw-black block mb-2">
                            ¿Cómo nos encontraste?
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {sourceOptions.map((src) => (
                              <button
                                key={src}
                                type="button"
                                onClick={() => setFormState({ ...formState, source: src })}
                                className={`px-4 py-2 border-3 border-waw-black font-semibold text-sm transition-all
                                  ${
                                    formState.source === src
                                      ? "bg-waw-violet text-waw-white"
                                      : "bg-waw-white text-waw-black hover:bg-waw-violet/10"
                                  }`}
                              >
                                {src}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="font-[var(--font-comic)] text-xl text-waw-black block mb-2">
                            Mensaje <span className="text-waw-black/40 text-base">(opcional)</span>
                          </label>
                          <Textarea
                            value={formState.message}
                            onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                            placeholder="Contanos brevemente tu idea..."
                            className="border-4 border-waw-black text-lg min-h-24"
                          />
                        </div>

                        <div className="flex gap-3">
                          <Button
                            type="button"
                            onClick={() => setStep(1)}
                            variant="outline"
                            className="comic-border border-waw-black bg-waw-white text-waw-black font-[var(--font-comic)] text-lg py-6 px-6"
                          >
                            <ArrowLeft className="mr-1 h-5 w-5" />
                            Atrás
                          </Button>
                          <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 comic-border bg-waw-red hover:bg-waw-red/90 text-waw-white font-[var(--font-comic)] text-2xl py-6"
                          >
                            {isSubmitting ? (
                              "ENVIANDO..."
                            ) : (
                              <>
                                <Send className="mr-2 h-6 w-6" />
                                ¡ENVIAR!
                              </>
                            )}
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </div>
            ) : (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="shout-bubble p-12 text-center">
                <Onomatopoeia text="¡WAW!" color="violet" size="xl" />
                <h3 className="font-[var(--font-comic)] text-3xl text-waw-black mt-6 mb-4">¡MENSAJE RECIBIDO!</h3>
                <p className="text-waw-black/80 text-lg">
                  Nuestro escuadrón revisará tu mensaje y te responderá en menos de 24 hs.
                </p>
              </motion.div>
            )}

            {/* WhatsApp CTA */}
            {!isSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="mt-6 text-center"
              >
                <p className="text-waw-white/60 text-sm mb-3">¿Preferís algo más directo?</p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 comic-border bg-[#25D366] hover:bg-[#20bd5a] text-waw-white font-[var(--font-comic)] text-lg px-6 py-3 transition-transform hover:scale-105"
                >
                  <MessageCircle className="h-5 w-5" />
                  Hablemos por WhatsApp
                </a>
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
                  <p className="font-[var(--font-comic)] text-xl text-waw-black">{item.value}</p>
                </div>
              </motion.div>
            ))}

            {/* Social proof */}
            <div className="comic-border bg-waw-black p-6 mt-8">
              <p className="text-waw-yellow font-[var(--font-comic)] text-2xl text-center mb-4">
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
