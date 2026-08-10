"use client"

import { motion } from "framer-motion"

const logos = [
  { label: "NOVA", src: "/log1.jpg" },
  { label: "AURORA", src: "/log2.jpg" },
  { label: "LUME", src: "/log3.jpg" },
  { label: "KITE", src: "/log4.jpg" },
  { label: "RHYTHM", src: "/log5.jpg" },
  { label: "INVITA", src: "/log6.jpeg" },
]

export function MarqueeSection() {
  return (
    <section className="py-20 bg-waw-black text-waw-white relative overflow-hidden">
      <div className="absolute inset-0 halftone-yellow opacity-8" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="text-sm uppercase tracking-[0.3em] text-waw-yellow/80 font-semibold mb-3">
            Confianza en movimiento
          </p>
          <h2 className="font-(--font-comic) text-3xl md:text-5xl text-waw-white">
            <span className="text-waw-yellow">Marcas</span> que ya están avanzando
          </h2>
          <p className="mt-4 text-waw-white/70 text-lg max-w-2xl mx-auto">
            Cuando el proyecto necesita claridad, velocidad y una identidad que se sostenga, esta es la energía que llevamos adelante.
          </p>
        </motion.div>

        <div className="space-y-8">
          <div className="overflow-hidden">
            <motion.div
              animate={{ x: ["0%", "-25%"] }}
              transition={{ repeat: Infinity, duration: 16, ease: "linear", repeatType: "loop", repeatDelay: 0 }}
              className="flex flex-nowrap w-max gap-6 py-2 max-w-full md:max-w-none"
            >
              {[...logos, ...logos, ...logos, ...logos].map((logo, index) => (
                <div
                  key={`${logo.label}-${index}`}
                  className="h-28 min-w-44 md:w-44 rounded-3xl shadow-[0_0_28px_rgba(212,175,55,0.22)] overflow-hidden"
                  style={{
                    clipPath: 'polygon(8% 0, 92% 0, 100% 14%, 100% 86%, 92% 100%, 8% 100%, 0 86%, 0 14%)',
                    border: '1px solid transparent',
                    background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #fffdf4 0%, #fff8e2 50%, #f9efc2 100%) border-box',
                    backgroundClip: 'padding-box, border-box',
                  }}
                >
                  <div className="h-full w-full flex items-center justify-center p-3">
                    <img
                      src={logo.src}
                      alt={logo.label}
                      className="h-full w-full object-contain rounded-[1.25rem]"
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="overflow-hidden">
            <motion.div
              animate={{ x: ["0%", "25%"] }}
              transition={{ repeat: Infinity, duration: 16, ease: "linear", repeatType: "loop", repeatDelay: 0 }}
              className="flex flex-nowrap w-max gap-6 py-2 max-w-full md:max-w-none"
            >
              {[...logos.slice().reverse(), ...logos.slice().reverse(), ...logos.slice().reverse(), ...logos.slice().reverse()].map((logo, index) => (
                <div
                  key={`${logo.label}-${index}-reverse`}
                  className="h-28 min-w-44 md:w-44 rounded-3xl shadow-[0_0_28px_rgba(212,175,55,0.18)] overflow-hidden"
                  style={{
                    clipPath: 'polygon(8% 0, 92% 0, 100% 14%, 100% 86%, 92% 100%, 8% 100%, 0 86%, 0 14%)',
                    border: '1px solid transparent',
                    background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #fffdf4 0%, #fff8e2 50%, #f9efc2 100%) border-box',
                    backgroundClip: 'padding-box, border-box',
                  }}
                >
                  <div className="h-full w-full flex items-center justify-center p-3">
                    <img
                      src={logo.src}
                      alt={logo.label}
                      className="h-full w-full object-contain rounded-[1.25rem]"
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
