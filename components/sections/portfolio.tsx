"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ExternalLink } from "lucide-react"

const projects = [
  {
    id: 1,
    title: "E-Commerce Heroico",
    category: "Web Development",
    image: "/modern-ecommerce-purple.png",
    badge: "¡MISIÓN COMPLETADA!",
    color: "yellow" as const,
  },
  {
    id: 2,
    title: "App de Fitness IA",
    category: "AI + Mobile",
    image: "/fitness-app-dashboard-modern.jpg",
    badge: "RESULTADO HEROICO",
    color: "violet" as const,
  },
  {
    id: 3,
    title: "Dashboard Analítico",
    category: "Web App",
    image: "/analytics-dashboard-dark-theme.png",
    badge: "ANTES / DESPUÉS",
    color: "red" as const,
  },
  {
    id: 4,
    title: "Plataforma Educativa",
    category: "SaaS",
    image: "/education-platform-colorful.jpg",
    badge: "¡WAW!",
    color: "yellow" as const,
  },
  {
    id: 5,
    title: "Bot de Atención 24/7",
    category: "AI Automation",
    image: "/chatbot-interface-modern.jpg",
    badge: "MISIÓN COMPLETADA!",
    color: "violet" as const,
  },
  {
    id: 6,
    title: "Landing Viral",
    category: "Marketing",
    image: "/viral-landing-page-startup.jpg",
    badge: "BOOM!",
    color: "red" as const,
  },
]

export function Portfolio() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  return (
    <section className="py-20 bg-waw-black relative overflow-hidden" id="portfolio">
      {/* Halftone overlay */}
      <div className="absolute inset-0 halftone-violet opacity-10" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-[var(--font-comic)] text-4xl md:text-6xl text-waw-white mb-4">
            MISIONES <span className="text-waw-yellow">COMPLETADAS</span>
          </h2>
          <p className="text-waw-white/70 text-xl max-w-2xl mx-auto">Proyectos que nos hicieron decir WAW!</p>
        </motion.div>

        {/* Portfolio grid - Comic grid style */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.8, rotate: -3 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="comic-border-thick bg-waw-white overflow-hidden relative aspect-[4/3]">
                {/* Image */}
                <img
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Overlay on hover */}
                <motion.div
                  className="absolute inset-0 bg-waw-black/80 flex flex-col items-center justify-center p-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredId === project.id ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Badge */}
                  <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{
                      scale: hoveredId === project.id ? 1 : 0,
                      rotate: hoveredId === project.id ? 0 : -20,
                    }}
                    transition={{ type: "spring", stiffness: 400, delay: 0.1 }}
                    className={`
                      px-4 py-2 mb-4 font-[var(--font-comic)] text-lg
                      ${
                        project.color === "yellow"
                          ? "bg-waw-yellow text-waw-black"
                          : project.color === "violet"
                            ? "bg-waw-violet text-waw-white"
                            : "bg-waw-red text-waw-white"
                      }
                      border-4 border-waw-black transform -rotate-3
                    `}
                  >
                    {project.badge}
                  </motion.div>

                  <h3 className="font-[var(--font-comic)] text-2xl text-waw-white text-center mb-2">{project.title}</h3>
                  <p className="text-waw-yellow mb-4">{project.category}</p>

                  <motion.button
                    className="flex items-center gap-2 px-4 py-2 bg-waw-yellow text-waw-black font-bold border-4 border-waw-black"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Ver proyecto <ExternalLink className="w-4 h-4" />
                  </motion.button>
                </motion.div>

                {/* Category tag */}
                <div className="absolute top-3 left-3 bg-waw-black text-waw-yellow px-3 py-1 text-sm font-bold border-2 border-waw-yellow">
                  {project.category}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
