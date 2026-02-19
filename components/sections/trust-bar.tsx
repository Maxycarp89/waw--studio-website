"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { Zap, Globe, BarChart3, Bot, Link } from "lucide-react"

const capabilities = [
  { icon: Zap, label: "Automatización 24/7", description: "Tus procesos trabajan solos, incluso cuando dormís" },
  { icon: Globe, label: "Webs ultra rápidas", description: "Carga en menos de 1 segundo, en cualquier dispositivo" },
  { icon: BarChart3, label: "Dashboards en tiempo real", description: "Toda tu data en un solo lugar, siempre actualizada" },
  { icon: Bot, label: "Chatbots inteligentes", description: "Atención automática que responde como un humano" },
  { icon: Zap, label: "Agentes IA", description: "Inteligencia artificial que optimiza tus procesos" },
  { icon: Link, label: "Integración total", description: "Conectamos tus sistemas para que hablen entre sí" },
]

const metrics = [
  { value: 50, suffix: "+", label: "Proyectos entregados" },
  { value: 10, suffix: "hs", label: "Ahorradas por semana" },
  { value: 98, suffix: "%", label: "Clientes satisfechos" },
]

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return
    let start = 0
    const duration = 1500
    const increment = value / (duration / 16)

    const timer = setInterval(() => {
      start += increment
      if (start >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [isInView, value])

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  )
}

export function TrustBar() {
  return (
    <section className="py-12 bg-waw-black relative overflow-hidden">
      {/* Halftone subtle bg */}
      <div className="absolute inset-0 halftone-yellow opacity-5" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Metrics row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="text-center"
            >
              <p className="font-[var(--font-comic)] text-4xl md:text-5xl text-waw-yellow mb-1">
                <AnimatedCounter value={metric.value} suffix={metric.suffix} />
              </p>
              <p className="text-waw-white/70 text-sm md:text-base font-medium">
                {metric.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Capabilities row */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-center text-waw-white/40 text-sm font-semibold uppercase tracking-widest mb-8">
            Lo que hacemos por tu negocio
          </p>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 md:gap-6">
            {capabilities.map((cap, index) => (
              <motion.div
                key={cap.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -4 }}
                className="flex flex-col items-center text-center gap-2 group cursor-default p-4 border-2 border-waw-white/10 hover:border-waw-yellow/40 transition-all duration-300 rounded-lg"
              >
                <div className="p-3 bg-waw-yellow/10 group-hover:bg-waw-yellow/20 rounded-xl transition-colors duration-300">
                  <cap.icon className="w-7 h-7 text-waw-yellow" />
                </div>
                <span className="text-waw-white font-semibold text-sm leading-tight">
                  {cap.label}
                </span>
                <span className="text-waw-white/40 text-xs leading-tight hidden md:block">
                  {cap.description}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
