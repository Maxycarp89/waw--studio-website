"use client"

import { motion } from "framer-motion"
import { ComicPanel } from "@/components/comic/comic-panel"
import { Brain, Code2, Palette, Sparkles } from "lucide-react"

const strengths = [
  {
    title: "Estrategia",
    subtitle: "La idea bien clavada",
    description: "Convertimos problemas vagos en planes claros, con foco y dirección real.",
    bullets: ["Diagnóstico", "Roadmap", "Priorización"],
    icon: Brain,
    variant: "violet" as const,
    badge: "bg-waw-yellow text-waw-black",
  },
  {
    title: "Diseño",
    subtitle: "Se ve bien y funciona",
    description: "Diseñamos experiencias que transmiten confianza, claridad y energía desde el primer clic.",
    bullets: ["UX", "Branding", "Interfaces"],
    icon: Palette,
    variant: "red" as const,
    badge: "bg-waw-white text-waw-black",
  },
  {
    title: "Desarrollo",
    subtitle: "Código que no se cae",
    description: "Construimos productos sólidos, rápidos y listos para crecer sin dolor de cabeza.",
    bullets: ["Web", "Automatizaciones", "Escalabilidad"],
    icon: Code2,
    variant: "yellow" as const,
    badge: "bg-waw-black text-waw-yellow",
  },
  {
    title: "IA & Crecimiento",
    subtitle: "Potencia cada etapa",
    description: "Sumamos automatización, contenido y procesos inteligentes para mover resultados.",
    bullets: ["Workflows", "IA", "Optimización"],
    icon: Sparkles,
    variant: "default" as const,
    badge: "bg-waw-violet text-waw-white",
  },
]

export function Team() {
  return (
    <section className="py-20 bg-waw-white relative overflow-hidden" id="equipo">
      <div className="absolute inset-0 halftone opacity-5" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-(--font-comic) text-4xl md:text-6xl text-waw-black mb-4">
            <span className="text-waw-red">LAS FUERZAS</span> <span className="text-waw-violet">QUE HACEN DESPEGAR</span> EL PROYECTO
          </h2>
          <p className="text-waw-black/70 text-xl max-w-2xl mx-auto">
            No vendemos perfiles. Vendemos claridad, creatividad y resultados con una forma distinta de trabajar.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {strengths.map((item, index) => {
            const Icon = item.icon

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 50, rotate: index % 2 === 0 ? -3 : 3 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="group"
              >
                <ComicPanel className="relative overflow-visible h-full" variant={item.variant}>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-14 h-14 rounded-full border-4 border-waw-black bg-waw-white flex items-center justify-center">
                      <Icon className="w-7 h-7 text-waw-black" />
                    </div>
                    <div className={`px-3 py-1 border-3 border-waw-black text-xs font-bold uppercase ${item.badge}`}>
                      {item.subtitle}
                    </div>
                  </div>

                  <h3 className="font-(--font-comic) text-2xl text-waw-black mb-3">
                    {item.title}
                  </h3>

                  <p className="text-sm leading-relaxed text-waw-black/80">
                    {item.description}
                  </p>

                  <ul className="mt-4 space-y-2">
                    {item.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-center gap-2 text-sm font-semibold">
                        <span className="w-2 h-2 bg-waw-black rounded-full" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="absolute top-2 right-2 w-6 h-6">
                    <div className="w-full h-full border-t-4 border-r-4 border-waw-black opacity-30" />
                  </div>
                </ComicPanel>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
