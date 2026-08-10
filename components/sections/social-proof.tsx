"use client"

import { motion } from "framer-motion"
import { Quote, Star } from "lucide-react"

const reviews = [
  {
    name: "María G.",
    role: "Fundadora",
    company: "Northstar",
    quote: "El proceso fue claro, rápido y muy bien guiado. Sentimos que cada paso tenía intención.",
  },
  {
    name: "Tomás R.",
    role: "Director de operaciones",
    company: "Axiom Studio",
    quote: "Pasamos de una idea borrosa a una experiencia digital con estructura y energía.",
  },
  {
    name: "Lucía P.",
    role: "Brand Lead",
    company: "Lume Labs",
    quote: "La combinación de estrategia, diseño y ejecución hizo que todo se sintiera mucho más simple.",
  },
]

export function SocialProof() {
  return (
    <section className="py-20 bg-waw-white relative overflow-hidden" id="testimonios">
      <div className="absolute inset-0 halftone opacity-5" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-sm uppercase tracking-[0.3em] text-waw-violet font-semibold mb-3">
            Confianza y movimiento
          </p>
          <h2 className="font-(--font-comic) text-3xl md:text-5xl text-waw-black mb-4">
            <span className="text-waw-red">Opiniones</span> que hablan por sí solas
          </h2>
          <p className="text-waw-black/70 text-lg max-w-2xl mx-auto">
            Cuando el proyecto necesita claridad, velocidad y una identidad que se sostenga, esta es la energía que llevamos adelante.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {reviews.map((review, index) => (
            <motion.article
              key={review.name}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12 }}
              className="border-4 border-waw-black bg-waw-white p-6 relative"
            >
              <div className="absolute top-3 right-3 text-waw-violet">
                <Quote className="w-6 h-6" />
              </div>

              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <Star key={starIndex} className="w-5 h-5 fill-waw-yellow text-waw-yellow" />
                ))}
              </div>

              <p className="text-waw-black/80 mb-5 leading-relaxed">“{review.quote}”</p>

              <div>
                <p className="font-(--font-comic) text-xl text-waw-black">{review.name}</p>
                <p className="text-sm text-waw-black/60">
                  {review.role} · {review.company}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
