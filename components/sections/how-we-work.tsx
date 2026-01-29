"use client"

import { motion } from "framer-motion"
import { Onomatopoeia } from "@/components/comic/onomatopoeia"
import { MessageCircle, Target, Wrench, Rocket } from "lucide-react"

const steps = [
  {
    number: "01",
    title: "Conversamos",
    description: "Nos contás tu idea, problema o sueño. Escuchamos con atención heroica.",
    icon: MessageCircle,
    sound: "POP!",
    color: "bg-waw-yellow",
  },
  {
    number: "02",
    title: "Diseñamos la estrategia",
    description: "Armamos el plan de batalla perfecto para tu proyecto.",
    icon: Target,
    sound: "ZAP!",
    color: "bg-waw-violet",
  },
  {
    number: "03",
    title: "Creamos tu solución",
    description: "Ponemos manos a la obra con código, diseño y mucha creatividad.",
    icon: Wrench,
    sound: "WOW!",
    color: "bg-waw-red",
  },
  {
    number: "04",
    title: "Lanzamos y optimizamos",
    description: "Tu proyecto despega y lo seguimos mejorando día a día.",
    icon: Rocket,
    sound: "GO!",
    color: "bg-waw-yellow",
  },
]

export function HowWeWork() {
  return (
    <section className="py-20 bg-gradient-to-b from-waw-white to-waw-yellow/20 relative overflow-hidden" id="proceso">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-1/3 h-1 bg-waw-black opacity-10" />
        <div className="absolute top-1/2 right-0 w-1/4 h-1 bg-waw-black opacity-10" />
        <div className="absolute bottom-1/4 left-1/4 w-1/2 h-1 bg-waw-black opacity-10" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-[var(--font-comic)] text-4xl md:text-6xl text-waw-black mb-4">
            CÓMO{" "}
            <span className="text-waw-white bg-waw-violet px-4 py-1 inline-block transform rotate-1">TRABAJAMOS</span>
          </h2>
          <p className="text-waw-black/70 text-xl max-w-2xl mx-auto">Nuestro proceso en 4 viñetas épicas</p>
        </motion.div>

        {/* Steps - Comic strip style */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative"
            >
              {/* Comic panel */}
              <div className="comic-border bg-waw-white p-6 relative h-full">
                {/* Step number */}
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-waw-black text-waw-yellow font-[var(--font-comic)] text-2xl flex items-center justify-center border-4 border-waw-yellow">
                  {step.number}
                </div>

                {/* Sound effect */}
                <motion.div
                  className="absolute -top-8 right-0"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 + 0.5 }}
                >
                  <Onomatopoeia
                    text={step.sound}
                    color={step.color === "bg-waw-violet" ? "violet" : step.color === "bg-waw-red" ? "red" : "yellow"}
                    size="sm"
                  />
                </motion.div>

                {/* Icon */}
                <motion.div
                  className={`${step.color} w-16 h-16 rounded-full border-4 border-waw-black flex items-center justify-center mb-4 mt-4`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <step.icon
                    className={`w-8 h-8 ${step.color === "bg-waw-violet" || step.color === "bg-waw-red" ? "text-waw-white" : "text-waw-black"}`}
                  />
                </motion.div>

                {/* Content */}
                <h3 className="font-[var(--font-comic)] text-xl text-waw-black mb-2">{step.title}</h3>
                <p className="text-waw-black/70 text-sm">{step.description}</p>

                {/* Panel corner */}
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-waw-black/30" />
              </div>

              {/* Connector arrow (except last) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                  <div className="w-6 h-6 bg-waw-black transform rotate-45" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
