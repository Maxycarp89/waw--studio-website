"use client"

import { motion } from "framer-motion"
import { ComicPanel } from "@/components/comic/comic-panel"
import { Onomatopoeia } from "@/components/comic/onomatopoeia"
import { Zap, Brain, Palette, Rocket } from "lucide-react"

const services = [
  {
    icon: Zap,
    title: "Desarrollo Web Heroico",
    description: "Webs rápidas, modernas y con superpoderes. Next.js, React y todo lo que necesites.",
    color: "yellow" as const,
    sound: "ZAP!",
  },
  {
    icon: Brain,
    title: "Automatizaciones con IA",
    description: "Cerebros robóticos que trabajan 24/7. Chatbots, flujos automáticos y más.",
    color: "violet" as const,
    sound: "PING!",
  },
  {
    icon: Palette,
    title: "Branding & Creatividad",
    description: "Diseño que impacta y cuenta historias. Identidad visual que no se olvida.",
    color: "red" as const,
    sound: "POW!",
  },
  {
    icon: Rocket,
    title: "Lanzamos y Optimizamos",
    description: "Tu proyecto en órbita y mejorando cada día. SEO, analytics y crecimiento.",
    color: "yellow" as const,
    sound: "BOOM!",
  },
]

export function Services() {
  return (
    <section className="py-20 bg-waw-white relative overflow-hidden" id="servicios">
      {/* Halftone background */}
      <div className="absolute inset-0 halftone opacity-5" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-(--font-comic) text-4xl md:text-6xl text-waw-black mb-4">
            NUESTROS <span className="text-waw-violet">SUPER</span>
            <span className="text-waw-yellow bg-waw-black px-3">PODERES</span>
          </h2>
          <p className="text-waw-black/70 text-xl max-w-2xl mx-auto">
            Cada proyecto es una misión. Estos son nuestros poderes para completarla.
          </p>
        </motion.div>

        {/* Services grid - Comic panel layout */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 50, rotate: -2 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="group relative"
            >
              <ComicPanel variant={service.color} className="h-full relative overflow-visible">
                {/* Sound effect on hover */}
                <div className="absolute -top-8 -right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Onomatopoeia text={service.sound} color={service.color} size="sm" />
                </div>

                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <motion.div
                    className={`
                      p-4 rounded-xl border-4 border-waw-black
                      ${service.color === "yellow" ? "bg-waw-white" : "bg-waw-yellow"}
                    `}
                    whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <service.icon className="w-8 h-8 text-waw-black" />
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3
                      className={`
                        font-(--font-comic) text-2xl mb-2
                        ${service.color === "yellow" ? "text-waw-black" : "text-waw-white"}
                      `}
                    >
                      {service.title}
                    </h3>
                    <p
                      className={`
                        ${service.color === "yellow" ? "text-waw-black/80" : "text-waw-white/90"}
                      `}
                    >
                      {service.description}
                    </p>
                  </div>
                </div>

                {/* Decorative corner */}
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-4 border-r-4 border-waw-black opacity-50" />
              </ComicPanel>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
