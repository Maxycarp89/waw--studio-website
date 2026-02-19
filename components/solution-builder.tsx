"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ComicPanel } from "@/components/comic/comic-panel"
import { Onomatopoeia } from "@/components/comic/onomatopoeia"
import { Button } from "@/components/ui/button"
import { Globe, Bot, Workflow , ShoppingCart, Palette, Check, Cog, Cpu, ArrowRight } from "lucide-react"

const modules = [
  { id: "web", label: "Desarrollo Web", icon: Globe, color: "yellow" },
  { id: "ia", label: "IA & Chatbots", icon: Bot, color: "violet" },
  { id: "auto", label: "Automatizaciones", icon: Workflow , color: "red" },
  { id: "ecommerce", label: "E-commerce", icon: ShoppingCart, color: "yellow" },
  { id: "branding", label: "Branding", icon: Palette, color: "violet" },
]

export function SolutionBuilder() {
  const [selectedModules, setSelectedModules] = useState<string[]>([])
  const [isBuilding, setIsBuilding] = useState(false)
  const [showResult, setShowResult] = useState(false)

  const toggleModule = (id: string) => {
    setSelectedModules((prev) => (prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]))
  }

  const buildSolution = async () => {
    if (selectedModules.length === 0) return

    setIsBuilding(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsBuilding(false)
    setShowResult(true)
  }

  const reset = () => {
    setSelectedModules([])
    setShowResult(false)
  }

  return (
    <section
      className="py-20 bg-gradient-to-b from-waw-yellow/20 to-waw-white relative overflow-hidden"
      id="constructor"
    >
      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-[var(--font-comic)] text-4xl md:text-6xl text-waw-black mb-4">
            CONSTRUÍ TU <span className="text-waw-violet">SOLUCIÓN</span>
          </h2>
          <p className="text-waw-black/70 text-xl max-w-2xl mx-auto">
            Elegí los módulos que necesitás y armamos tu propuesta personalizada
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div key="builder" exit={{ opacity: 0, scale: 0.9 }} className="max-w-4xl mx-auto">
              {/* Module selector */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                {modules.map((module, index) => (
                  <motion.button
                    key={module.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => toggleModule(module.id)}
                    className={`
                      comic-border p-4 text-center transition-all relative
                      ${
                        selectedModules.includes(module.id)
                          ? module.color === "yellow"
                            ? "bg-waw-yellow"
                            : module.color === "violet"
                              ? "bg-waw-violet text-waw-white"
                              : "bg-waw-red text-waw-white"
                          : "bg-waw-white"
                      }
                    `}
                  >
                    {selectedModules.includes(module.id) && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-waw-black rounded-full flex items-center justify-center"
                      >
                        <Check className="w-4 h-4 text-waw-yellow" />
                      </motion.div>
                    )}
                    <module.icon className="w-8 h-8 mx-auto mb-2" />
                    <span className="font-bold text-sm">{module.label}</span>
                  </motion.button>
                ))}
              </div>

              {/* Build button */}
              <div className="text-center">
                <Button
                  onClick={buildSolution}
                  disabled={selectedModules.length === 0 || isBuilding}
                  className="comic-border bg-waw-black text-waw-yellow hover:bg-waw-black/90 font-[var(--font-comic)] text-2xl px-12 py-6"
                >
                  {isBuilding ? (
                    <motion.span className="flex items-center">
                      <Cog className="w-6 h-6 mr-2 animate-spin" />
                      ENSAMBLANDO...
                    </motion.span>
                  ) : (
                    <span className="flex items-center">
                      <Cpu className="w-6 h-6 mr-2" />
                      CONSTRUIR SOLUCIÓN
                    </span>
                  )}
                </Button>
                {selectedModules.length > 0 && (
                  <p className="mt-4 text-waw-black/60">
                    {selectedModules.length} módulo{selectedModules.length > 1 ? "s" : ""} seleccionado
                    {selectedModules.length > 1 ? "s" : ""}
                  </p>
                )}
              </div>

              {/* Building animation */}
              <AnimatePresence>
                {isBuilding && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-waw-black/90 z-50 flex items-center justify-center"
                  >
                    <div className="text-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className="mb-6"
                      >
                        <Cog className="w-24 h-24 text-waw-yellow" />
                      </motion.div>
                      <p className="font-[var(--font-comic)] text-3xl text-waw-yellow">ENSAMBLANDO TU SOLUCIÓN...</p>
                      <motion.div
                        className="flex justify-center gap-2 mt-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        {selectedModules.map((id, i) => {
                          const module = modules.find((m) => m.id === id)
                          return module ? (
                            <motion.div
                              key={id}
                              initial={{ x: -50, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.3 + i * 0.2 }}
                              className="p-2 bg-waw-yellow border-2 border-waw-black"
                            >
                              <module.icon className="w-6 h-6 text-waw-black" />
                            </motion.div>
                          ) : null
                        })}
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-4xl mx-auto"
            >
              {/* Result */}
              <div className="text-center mb-8">
                <Onomatopoeia text="¡LISTO!" color="yellow" size="xl" />
              </div>

              <ComicPanel variant="default" className="p-8">
                <h3 className="font-[var(--font-comic)] text-3xl text-waw-black mb-6 text-center">
                  TU SOLUCIÓN PERSONALIZADA
                </h3>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {/* Selected modules */}
                  <div>
                    <h4 className="font-bold text-waw-violet mb-4">Módulos incluidos:</h4>
                    <div className="space-y-2">
                      {selectedModules.map((id) => {
                        const module = modules.find((m) => m.id === id)
                        return module ? (
                          <div
                            key={id}
                            className="flex items-center gap-2 p-2 bg-waw-yellow/20 border-2 border-waw-black"
                          >
                            <module.icon className="w-5 h-5" />
                            <span className="font-bold">{module.label}</span>
                          </div>
                        ) : null
                      })}
                    </div>
                  </div>

                  {/* Estimate */}
                  <div>
                    <h4 className="font-bold text-waw-red mb-4">Estimación:</h4>
                    <div className="space-y-4">
                      <div className="p-4 bg-waw-black text-waw-yellow">
                        <p className="font-[var(--font-comic)] text-2xl">
                          {selectedModules.length * 2}-{selectedModules.length * 3} semanas
                        </p>
                        <p className="text-sm opacity-80">Tiempo estimado de desarrollo</p>
                      </div>
                      <div className="p-4 border-4 border-waw-violet">
                        <p className="font-bold text-waw-violet">Stack recomendado:</p>
                        <p className="text-sm text-waw-black/70">
                          Next.js 15 + {selectedModules.includes("ia") ? "AI SDK + " : ""}
                          {selectedModules.includes("ecommerce") ? "Stripe + " : ""}
                          Supabase
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => (window.location.href = "#contacto")}
                    className="comic-border bg-waw-yellow text-waw-black font-[var(--font-comic)] text-xl px-8 py-6"
                  >
                    QUIERO ESTA SOLUCIÓN
                    <ArrowRight className="ml-2" />
                  </Button>
                  <Button onClick={reset} variant="outline" className="comic-border font-bold bg-transparent">
                    Armar otra
                  </Button>
                </div>
              </ComicPanel>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
