"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

const navItems = [
  { label: "Servicios", href: "#servicios" },
  { label: "Proceso", href: "#proceso" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Equipo", href: "#equipo" },
  { label: "Contacto", href: "#contacto" },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-waw-white/95 backdrop-blur-sm shadow-lg" : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-2">
              <span
                className={`font-[var(--font-comic)] text-4xl transition-colors ${
                  isScrolled ? "text-waw-yellow" : "text-waw-white"
                }`}
                style={{ 
                  WebkitTextStroke: isScrolled ? "2px #FFD633" : "2px #fff"
                }}
              >
                WAW!
              </span>
              <span className={`transition-colors ${
                isScrolled ? "text-waw-black" : "text-waw-black/90"
              }`}>
                Studio
              </span>
            </div>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={`font-bold transition-colors hover:text-waw-violet ${
                    isScrolled ? "text-waw-black" : "text-waw-black"
                  }`}
                >
                  {item.label}
                </a>
              ))}
              <Button className="comic-border bg-waw-yellow text-waw-black hover:bg-waw-yellow/90 font-[var(--font-comic)] text-lg">
                ¡Hablemos!
              </Button>
            </div>

            {/* Mobile menu button */}
            <button className="md:hidden p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? (
                <X className="w-8 h-8 text-waw-black" />
              ) : (
                <Menu className="w-8 h-8 text-waw-black" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-waw-yellow pt-24"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="container mx-auto px-4">
              <div className="flex flex-col gap-6">
                {navItems.map((item, index) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    className="font-[var(--font-comic)] text-3xl text-waw-black border-b-4 border-waw-black pb-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </motion.a>
                ))}
                <Button className="comic-border bg-waw-red text-waw-white font-[var(--font-comic)] text-2xl py-6 mt-4">
                  ¡Hablemos!
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
