"use client"

import { motion } from "framer-motion"
import { ComicPanel } from "@/components/comic/comic-panel"

const team = [
  {
    name: "Maximiliano Costilla",
    role: "Tech Lead",
    image: "/avatar-max.png",
    power: "Arquitectura Imposible",
    languages: ["TypeScript", "Python", "Go"],
    missions: 127,
    color: "violet",
  },
  {
    name: "Luna Vega",
    role: "Creative Director",
    image: "/professional-woman-designer-comic-style-portrait.jpg",
    power: "Diseño Épico",
    languages: ["Figma", "After Effects", "Blender"],
    missions: 98,
    color: "red",
  },
  {
    name: "Max Thunder",
    role: "AI Engineer",
    image: "/professional-man-ai-engineer-comic-style-portrait.jpg",
    power: "Automatización Total",
    languages: ["Python", "TensorFlow", "LangChain"],
    missions: 84,
    color: "yellow",
  },
  {
    name: "Nina Blaze",
    role: "Full Stack Dev",
    image: "/professional-woman-developer-comic-style-portrait.jpg",
    power: "Código Relampagueante",
    languages: ["React", "Node.js", "PostgreSQL"],
    missions: 156,
    color: "violet",
  },
]

export function Team() {
  return (
    <section className="py-20 bg-waw-white relative overflow-hidden" id="equipo">
      {/* Background */}
      <div className="absolute inset-0 halftone opacity-5" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-[var(--font-comic)] text-4xl md:text-6xl text-waw-black mb-4">
            EL <span className="text-waw-red">ESCUADRÓN</span> <span className="text-waw-violet">WAW!</span>
          </h2>
          <p className="text-waw-black/70 text-xl max-w-2xl mx-auto">
            Conocé a los superhéroes detrás de cada proyecto
          </p>
        </motion.div>

        {/* Team grid - Superhero cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 50, rotate: index % 2 === 0 ? -3 : 3 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="group"
            >
              <ComicPanel className="relative overflow-visible h-full">
                {/* Photo with comic effect */}
                <div className="relative mb-4 -mt-2 -mx-2">
                  <div className="comic-border overflow-hidden">
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="w-full aspect-square object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                  </div>
                  {/* Role badge */}
                  <div
                    className={`
                      absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 font-bold text-sm
                      border-3 border-waw-black whitespace-nowrap
                      ${
                        member.color === "violet"
                          ? "bg-waw-violet text-waw-white"
                          : member.color === "red"
                            ? "bg-waw-red text-waw-white"
                            : "bg-waw-yellow text-waw-black"
                      }
                    `}
                  >
                    {member.role}
                  </div>
                </div>

                {/* Name */}
                <h3 className="font-[var(--font-comic)] text-2xl text-waw-black text-center mt-6 mb-4">
                  {member.name}
                </h3>

                {/* Stats */}
                <div className="space-y-3 text-sm">
                  {/* Power */}
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-waw-violet">⚡ PODER:</span>
                    <span className="text-waw-black">{member.power}</span>
                  </div>

                  {/* Languages */}
                  <div>
                    <span className="font-bold text-waw-red">💻 DOMINA:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {member.languages.map((lang) => (
                        <span key={lang} className="px-2 py-0.5 bg-waw-black text-waw-yellow text-xs font-mono">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Missions */}
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-waw-yellow" style={{ WebkitTextStroke: "0.5px #000" }}>
                      🎯 MISIONES:
                    </span>
                    <span className="font-[var(--font-comic)] text-xl text-waw-black">{member.missions}</span>
                  </div>
                </div>

                {/* Decorative corner */}
                <div className="absolute top-2 right-2 w-6 h-6">
                  <div className="w-full h-full border-t-4 border-r-4 border-waw-black opacity-30" />
                </div>
              </ComicPanel>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
