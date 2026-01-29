"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ComicPanel } from "@/components/comic/comic-panel"
import { SpeechBubble } from "@/components/comic/speech-bubble"
import { Onomatopoeia } from "@/components/comic/onomatopoeia"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Cog, Zap, Cpu, Sparkles, Loader2 } from "lucide-react"

interface Solution {
  ideas: string[]
  automation: string
  technical: string
}

export function IdeasMachine() {
  const [problem, setProblem] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [solution, setSolution] = useState<Solution | null>(null)
  const [showResult, setShowResult] = useState(false)

  const generateSolution = async () => {
    if (!problem.trim()) return

    setIsProcessing(true)
    setShowResult(false)

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 2500))

    // Mock AI response - in production this would call the AI API
    const mockSolution: Solution = {
      ideas: [
        "💡 Landing page interactiva con animaciones y formulario de captación",
        "🤖 Chatbot inteligente 24/7 para atender consultas automáticamente",
        "📊 Dashboard en tiempo real para monitorear métricas clave",
      ],
      automation:
        "Flujo automático: Captación de leads → Segmentación con IA → Email marketing personalizado → Seguimiento CRM → Análisis de conversión",
      technical:
        "Stack recomendado: Next.js 15 + Supabase + AI SDK con modelos de OpenAI para el chatbot. Estimación: 3-4 semanas de desarrollo.",
    }

    setSolution(mockSolution)
    setIsProcessing(false)
    setShowResult(true)
  }

  return (
    <section className="py-20 bg-waw-black relative overflow-hidden" id="maquina">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-40 h-40 border-4 border-waw-yellow rounded-full" />
        <div className="absolute bottom-20 right-20 w-60 h-60 border-4 border-waw-violet" />
        <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-waw-red transform rotate-45" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-(--font-comic) text-4xl md:text-6xl text-waw-yellow mb-4">LA MÁQUINA DE IDEAS</h2>
          <p className="text-waw-white/80 text-xl max-w-2xl mx-auto">
            Transforma tus problemas en soluciones digitales épicas
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Input side - The Machine */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Machine frame */}
            <ComicPanel variant="default" className="relative">
              {/* Decorative gears */}
              <div className="absolute -top-6 -right-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <Cog className="w-12 h-12 text-waw-violet" />
                </motion.div>
              </div>
              <div className="absolute -bottom-4 -left-4">
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <Cog className="w-8 h-8 text-waw-yellow" />
                </motion.div>
              </div>

              <SpeechBubble className="mb-6">
                <p className="font-(--font-comic) text-xl text-waw-black">¿Qué problema querés resolver?</p>
              </SpeechBubble>

              <Textarea
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="Ejemplo: Necesito más clientes para mi negocio de coaching..."
                className="min-h-32 border-4 border-waw-black text-lg mb-6 focus:ring-waw-violet"
              />

              <Button
                onClick={generateSolution}
                disabled={isProcessing || !problem.trim()}
                className="w-full comic-border bg-waw-red hover:bg-waw-red/90 text-waw-white font-(--font-comic) text-2xl py-6"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    PROCESANDO...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-6 w-6" />
                    PROBAR LA MÁQUINA
                  </>
                )}
              </Button>

              {/* Processing animation */}
              <AnimatePresence>
                {isProcessing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-waw-black/80 flex items-center justify-center rounded-lg"
                  >
                    <div className="text-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className="mb-4"
                      >
                        <Cpu className="w-16 h-16 text-waw-yellow" />
                      </motion.div>
                      <p className="font-(--font-comic) text-2xl text-waw-yellow">ANALIZANDO...</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </ComicPanel>
          </motion.div>

          {/* Output side - Results */}
          <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <AnimatePresence mode="wait">
              {!showResult ? (
                <motion.div
                  key="placeholder"
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="h-full flex items-center justify-center"
                >
                  <ComicPanel variant="violet" className="text-center p-12">
                    <Sparkles className="w-16 h-16 mx-auto mb-4 text-waw-yellow" />
                    <p className="font-(--font-comic) text-2xl text-waw-white">Tus soluciones aparecerán aquí</p>
                    <p className="text-waw-white/70 mt-2">Ingresa tu problema y activa la máquina</p>
                  </ComicPanel>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  {/* WAW! Burst */}
                  <div className="text-center mb-4">
                    <Onomatopoeia text="¡WAW!" color="yellow" size="lg" />
                  </div>

                  {/* Ideas */}
                  <ComicPanel variant="yellow">
                    <h3 className="font-(--font-comic) text-2xl text-waw-black mb-4">💥 3 IDEAS CREATIVAS</h3>
                    <ul className="space-y-3">
                      {solution?.ideas.map((idea, i) => (
                        <motion.li
                          key={i}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: i * 0.2 }}
                          className="text-waw-black font-medium"
                        >
                          {idea}
                        </motion.li>
                      ))}
                    </ul>
                  </ComicPanel>

                  {/* Automation flow */}
                  <ComicPanel variant="violet">
                    <h3 className="font-(--font-comic) text-2xl text-waw-white mb-4">
                      ⚡ FLUJO DE AUTOMATIZACIÓN
                    </h3>
                    <p className="text-waw-white/90">{solution?.automation}</p>
                  </ComicPanel>

                  {/* Technical proposal */}
                  <ComicPanel variant="default">
                    <h3 className="font-(--font-comic) text-2xl text-waw-black mb-4">🛠️ PROPUESTA TÉCNICA</h3>
                    <p className="text-waw-black/80">{solution?.technical}</p>
                  </ComicPanel>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
