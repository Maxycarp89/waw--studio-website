"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { ComicPanel } from "@/components/comic/comic-panel"
import { Onomatopoeia } from "@/components/comic/onomatopoeia"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calculator, DollarSign, Clock, FileText } from "lucide-react"

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0)
  const prevValue = useRef(0)

  useEffect(() => {
    const start = prevValue.current
    const end = value
    const duration = 800
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // easeOutCubic
      setDisplay(Math.floor(start + (end - start) * eased))

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        prevValue.current = end
      }
    }

    requestAnimationFrame(animate)
  }, [value])

  return <>{display.toLocaleString("es-AR")}</>
}

export function ROICalculator() {
  const [invoices, setInvoices] = useState(50)
  const [minutesPerInvoice, setMinutesPerInvoice] = useState(15)
  const [hourlyRate, setHourlyRate] = useState(3500)
  const [showResult, setShowResult] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true })

  // Cálculos
  const hoursLostMonthly = (invoices * minutesPerInvoice) / 60
  const monthlyCost = hoursLostMonthly * hourlyRate
  const yearlyCost = monthlyCost * 12
  const hoursLostYearly = hoursLostMonthly * 12

  const handleCalculate = () => {
    setShowResult(true)
  }

  const scrollToContact = () => {
    const contactSection = document.getElementById("contacto")
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" })
      // Dispatch evento custom para pre-seleccionar "Automatización"
      window.dispatchEvent(new CustomEvent("preselect-project-type", { detail: "automatizacion" }))
    }
  }

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-gradient-to-b from-waw-white to-waw-yellow/10 relative overflow-hidden"
      id="roi-calculator"
    >
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-10 halftone opacity-5 w-96 h-96" />
        <div className="absolute bottom-10 left-10 w-40 h-40 border-4 border-waw-violet/10 rounded-full" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-[var(--font-comic)] text-4xl md:text-6xl text-waw-black mb-4">
            ¿CUÁNTO <span className="text-waw-red">DINERO</span>{" "}
            <span className="text-waw-violet">PERDÉS</span> AL AÑO?
          </h2>
          <p className="text-waw-black/70 text-xl max-w-2xl mx-auto">
            Calculá el costo real de tus procesos manuales y descubrí cuánto podrías ahorrar con automatización.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-8 items-start">
          {/* Calculator inputs */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <ComicPanel variant="yellow" className="p-8 space-y-8">
              {/* Facturas por mes */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-waw-violet border-4 border-waw-black">
                    <FileText className="w-5 h-5 text-waw-white" />
                  </div>
                  <label className="font-[var(--font-comic)] text-xl text-waw-black">
                    Tareas manuales por mes
                  </label>
                </div>
                <input
                  type="range"
                  min={10}
                  max={500}
                  step={10}
                  value={invoices}
                  onChange={(e) => {
                    setInvoices(Number(e.target.value))
                    setShowResult(false)
                  }}
                  className="w-full h-3 bg-waw-black/10 rounded-full appearance-none cursor-pointer accent-waw-violet"
                />
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-waw-black/50">10</span>
                  <span className="font-[var(--font-comic)] text-2xl text-waw-violet">{invoices}</span>
                  <span className="text-sm text-waw-black/50">500</span>
                </div>
              </div>

              {/* Minutos por tarea */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-waw-red border-4 border-waw-black">
                    <Clock className="w-5 h-5 text-waw-white" />
                  </div>
                  <label className="font-[var(--font-comic)] text-xl text-waw-black">
                    Minutos por tarea
                  </label>
                </div>
                <input
                  type="range"
                  min={5}
                  max={60}
                  step={5}
                  value={minutesPerInvoice}
                  onChange={(e) => {
                    setMinutesPerInvoice(Number(e.target.value))
                    setShowResult(false)
                  }}
                  className="w-full h-3 bg-waw-black/10 rounded-full appearance-none cursor-pointer accent-waw-red"
                />
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-waw-black/50">5 min</span>
                  <span className="font-[var(--font-comic)] text-2xl text-waw-red">{minutesPerInvoice} min</span>
                  <span className="text-sm text-waw-black/50">60 min</span>
                </div>
              </div>

              {/* Costo por hora */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-waw-yellow border-4 border-waw-black">
                    <DollarSign className="w-5 h-5 text-waw-black" />
                  </div>
                  <label className="font-[var(--font-comic)] text-xl text-waw-black">
                    Costo hora empleado (ARS)
                  </label>
                </div>
                <input
                  type="number"
                  min={500}
                  max={50000}
                  step={500}
                  value={hourlyRate}
                  onChange={(e) => {
                    setHourlyRate(Number(e.target.value))
                    setShowResult(false)
                  }}
                  className="w-full border-4 border-waw-black p-3 text-lg font-[var(--font-comic)] text-center bg-waw-white"
                />
              </div>

              {/* Calculate button */}
              <Button
                onClick={handleCalculate}
                className="w-full comic-border bg-waw-violet hover:bg-waw-violet/90 text-waw-white font-[var(--font-comic)] text-2xl py-6"
              >
                <Calculator className="mr-2 h-6 w-6" />
                ¡CALCULAR!
              </Button>
            </ComicPanel>
          </motion.div>

          {/* Results panel */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:sticky lg:top-24"
          >
            <AnimatePresence mode="wait">
              {!showResult ? (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="comic-border bg-waw-black p-12 text-center"
                >
                  <motion.div
                    animate={{ rotate: [0, -5, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Calculator className="w-20 h-20 text-waw-yellow mx-auto mb-6" />
                  </motion.div>
                  <p className="font-[var(--font-comic)] text-2xl text-waw-white mb-2">
                    Ajustá los valores
                  </p>
                  <p className="text-waw-white/60">
                    y descubrí cuánto dinero se escapa de tu negocio
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  initial={{ scale: 0.5, opacity: 0, rotate: -5 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  {/* Explosion result */}
                  <div className="relative">
                    <div className="absolute -top-6 -right-4 z-10">
                      <Onomatopoeia text="¡OUCH!" color="red" size="sm" />
                    </div>

                    <div className="shout-bubble p-8 md:p-10 text-center">
                      <p className="font-[var(--font-comic)] text-lg text-waw-black/60 mb-2">
                        ESTÁS PERDIENDO
                      </p>
                      <p className="font-[var(--font-comic)] text-5xl md:text-6xl text-waw-red mb-1">
                        $<AnimatedNumber value={yearlyCost} />
                      </p>
                      <p className="font-[var(--font-comic)] text-xl text-waw-black/80 mb-6">
                        AL AÑO
                      </p>

                      {/* Breakdown */}
                      <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="comic-border bg-waw-white p-4">
                          <p className="font-[var(--font-comic)] text-2xl text-waw-violet">
                            <AnimatedNumber value={Math.round(hoursLostYearly)} />
                          </p>
                          <p className="text-sm text-waw-black/60 font-semibold">Horas perdidas/año</p>
                        </div>
                        <div className="comic-border bg-waw-white p-4">
                          <p className="font-[var(--font-comic)] text-2xl text-waw-red">
                            $<AnimatedNumber value={Math.round(monthlyCost)} />
                          </p>
                          <p className="text-sm text-waw-black/60 font-semibold">Costo mensual</p>
                        </div>
                      </div>

                      <Button
                        onClick={scrollToContact}
                        className="w-full comic-border bg-waw-red hover:bg-waw-red/90 text-waw-white font-[var(--font-comic)] text-xl py-6"
                      >
                        Quiero automatizar esto
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </div>
                  </div>

                  {/* Extra context */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="comic-border bg-waw-violet p-6 mt-6 text-center"
                  >
                    <p className="text-waw-white font-[var(--font-comic)] text-lg">
                      💡 Con automatización, ese tiempo se reduce hasta un{" "}
                      <span className="text-waw-yellow text-2xl">90%</span>
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
