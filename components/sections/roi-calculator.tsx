"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { motion, useInView } from "framer-motion"
import { ComicPanel } from "@/components/comic/comic-panel"
import { Button } from "@/components/ui/button"
import { ArrowRight, DollarSign, Clock, FileText, MessageCircle } from "lucide-react"

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0)
  const prevValue = useRef(0)

  useEffect(() => {
    const start = prevValue.current
    const end = value
    const duration = 600
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
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

function getAmountColor(yearly: number): string {
  if (yearly < 500_000) return "text-waw-yellow"
  if (yearly < 2_000_000) return "text-orange-400"
  return "text-waw-red"
}

function getIntensity(yearly: number): number {
  // 0-100 barra de "dolor"
  return Math.min(Math.round((yearly / 10_000_000) * 100), 100)
}

export function ROICalculator() {
  const [invoices, setInvoices] = useState(70)
  const [minutesPerInvoice, setMinutesPerInvoice] = useState(15)
  const [hourlyRate, setHourlyRate] = useState(3500)
  const sectionRef = useRef<HTMLElement>(null)

  // Cálculos en tiempo real
  const hoursLostMonthly = (invoices * minutesPerInvoice) / 60
  const monthlyCost = hoursLostMonthly * hourlyRate
  const yearlyCost = monthlyCost * 12
  const dailyTasks = Math.round((invoices / 22) * 10) / 10  // 22 días hábiles

  const intensity = getIntensity(yearlyCost)
  const amountColor = getAmountColor(yearlyCost)

  const whatsappNumber = "5493816262536"
  const whatsappText = useMemo(() => {
    return encodeURIComponent(
      `Hola WAW! Studio 👋\nSegún la calculadora pierdo $${yearlyCost.toLocaleString("es-AR")} al año en tareas manuales.\nQuiero que me ayuden a automatizarlo y dejar de perder plata.`
    )
  }, [yearlyCost])

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-linear-to-b from-waw-white to-waw-yellow/10 relative overflow-hidden"
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
          <h2 className="font-(--font-comic) text-4xl md:text-6xl text-waw-black mb-4">
            ¿CUÁNTO <span className="text-waw-red">DINERO</span>{" "}
            <span className="text-waw-violet">SE TE ESCAPA</span> TODOS LOS MESES?
          </h2>
          <p className="text-waw-black/70 text-xl max-w-2xl mx-auto">
            Mové los sliders y descubrí en tiempo real cuánto te cuestan los procesos manuales.
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
              {/* Tareas por mes */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-waw-violet border-4 border-waw-black">
                    <FileText className="w-5 h-5 text-waw-white" />
                  </div>
                  <label className="font-(--font-comic) text-xl text-waw-black">
                    Tareas manuales por mes
                  </label>
                </div>
                <input
                  type="range"
                  min={10}
                  max={500}
                  step={10}
                  value={invoices}
                  onChange={(e) => setInvoices(Number(e.target.value))}
                  className="w-full h-3 bg-waw-black/10 rounded-full appearance-none cursor-pointer accent-waw-violet"
                />
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-waw-black/50">10</span>
                  <span className="font-(--font-comic) text-2xl text-waw-violet">{invoices}</span>
                  <span className="text-sm text-waw-black/50">500</span>
                </div>
                <p className="text-sm text-waw-black/40 mt-1 text-center italic">
                  {invoices} tareas/mes = ~{dailyTasks} tareas por día hábil
                </p>
              </div>

              {/* Minutos por tarea */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-waw-red border-4 border-waw-black">
                    <Clock className="w-5 h-5 text-waw-white" />
                  </div>
                  <label className="font-(--font-comic) text-xl text-waw-black">
                    Minutos por tarea
                  </label>
                </div>
                <input
                  type="range"
                  min={5}
                  max={60}
                  step={5}
                  value={minutesPerInvoice}
                  onChange={(e) => setMinutesPerInvoice(Number(e.target.value))}
                  className="w-full h-3 bg-waw-black/10 rounded-full appearance-none cursor-pointer accent-waw-red"
                />
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-waw-black/50">5 min</span>
                  <span className="font-(--font-comic) text-2xl text-waw-red">{minutesPerInvoice} min</span>
                  <span className="text-sm text-waw-black/50">60 min</span>
                </div>
                <p className="text-sm text-waw-black/40 mt-1 text-center italic">
                  {minutesPerInvoice} min × {invoices} tareas = {Math.round(hoursLostMonthly * 10) / 10} hs perdidas/mes
                </p>
              </div>

              {/* Costo por hora */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-waw-yellow border-4 border-waw-black">
                    <DollarSign className="w-5 h-5 text-waw-black" />
                  </div>
                  <label className="font-(--font-comic) text-xl text-waw-black">
                    Costo hora empleado (ARS)
                  </label>
                </div>
                <input
                  type="number"
                  min={500}
                  max={50000}
                  step={500}
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="w-full border-4 border-waw-black p-3 text-lg font-(--font-comic) text-center bg-waw-white"
                />
              </div>
            </ComicPanel>
          </motion.div>

          {/* Result panel — SIEMPRE VISIBLE, tiempo real */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:sticky lg:top-24 space-y-6"
          >
            {/* Resultado principal */}
            <div className="comic-border-thick bg-waw-black p-8 md:p-10 text-center border-waw-yellow">
              <p className="font-(--font-comic) text-lg text-waw-white/60 mb-3 tracking-wider uppercase">
                Estás perdiendo
              </p>
              <motion.p
                className={`font-(--font-comic) text-5xl md:text-7xl ${amountColor} mb-2 leading-none`}
                key={yearlyCost}
                initial={{ scale: 1.05 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                $<AnimatedNumber value={yearlyCost} />
              </motion.p>
              <p className="font-(--font-comic) text-xl text-waw-white/80 mb-6">
                por año en tareas manuales
              </p>

              {/* Detalle en texto */}
              <p className="text-waw-white/50 text-sm mb-6 max-w-xs mx-auto leading-relaxed">
                Esto equivale a <span className="text-waw-yellow font-bold">{Math.round(hoursLostMonthly)} horas perdidas al mes</span> que
                podrías estar usando para vender más.
              </p>

              {/* Barra de dolor */}
              <div className="mb-2">
                <div className="flex justify-between text-xs text-waw-white/40 mb-1">
                  <span>0% automatizado</span>
                  <span>100% automatizado</span>
                </div>
                <div className="w-full h-3 bg-waw-white/10 rounded-full overflow-hidden border border-waw-white/20">
                  <motion.div
                    className="h-full bg-linear-to-r from-waw-red via-orange-400 to-waw-yellow rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: `${intensity}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
                <p className="text-xs text-waw-white/30 mt-1 text-center">
                  Cuanto más rojo, más urgente es automatizar
                </p>
              </div>
            </div>

            {/* CTA principal — WhatsApp con monto dinámico */}
            <a
              href={`https://wa.me/${whatsappNumber}?text=${whatsappText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button
                className="w-full comic-border-thick bg-waw-yellow hover:bg-waw-yellow/90 text-waw-black font-(--font-comic) text-xl md:text-2xl py-7 transform hover:scale-[1.03] transition-transform"
              >
                <MessageCircle className="mr-2 h-6 w-6" />
                ¡Recuperar estos ${yearlyCost.toLocaleString("es-AR")}/año!
              </Button>
            </a>

            {/* Extra context */}
            <div className="comic-border bg-waw-violet p-5 text-center">
              <p className="text-waw-white font-(--font-comic) text-lg">
                💡 Con automatización, ese tiempo se reduce hasta un{" "}
                <span className="text-waw-yellow text-2xl">90%</span>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
