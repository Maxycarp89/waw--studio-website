"use client"

import { motion } from "framer-motion"
import { Instagram, Twitter, Linkedin, Github } from "lucide-react"

const socialLinks = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Github, href: "#", label: "GitHub" },
]

export function Footer() {
  return (
    <footer className="bg-waw-black py-12 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 halftone-yellow opacity-5" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span
              className="font-(--font-comic) text-4xl text-waw-yellow"
              style={{ WebkitTextStroke: "2px #FFD633" }}
            >
              WAW!
            </span>
            <span className="text-waw-white/60">Studio</span>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                className="w-12 h-12 bg-waw-white/10 border-2 border-waw-yellow flex items-center justify-center hover:bg-waw-yellow transition-colors group"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <social.icon className="w-5 h-5 text-waw-yellow group-hover:text-waw-black" />
              </motion.a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-waw-white/60 text-sm">© 2025 WAW! Studio. Todos los superpoderes reservados.</p>
        </div>

        {/* Bottom decoration */}
        <div className="mt-8 pt-8 border-t border-waw-white/10 text-center">
          <p className="text-waw-yellow font-(--font-comic) text-lg">
            Hecho con 💛 y muchos <span className="text-waw-red">¡BOOM!</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
