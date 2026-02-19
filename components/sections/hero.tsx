"use client";

import { motion } from "framer-motion";
import { HalftoneBg } from "@/components/comic/halftone-bg";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calculator, CheckCircle, Users, MapPin } from "lucide-react";

export function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { x: -100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 100, damping: 15 },
    },
  };

  const stats = [
    { icon: CheckCircle, label: "+50 proyectos entregados" },
    { icon: Users, label: "98% clientes satisfechos" },
    { icon: MapPin, label: "Tucumán, Argentina" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-waw-white">
      <HalftoneBg />

      <motion.div
        className="relative z-10 container mx-auto px-4 py-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
          {/* Logo */}
          <motion.div variants={itemVariants} className="mb-8">
            <img src="/logo-waw.png" alt="WAW Studio logo" />
          </motion.div>

          {/* Main headline — resultado, no proceso */}
          <motion.h2
            variants={itemVariants}
            className="font-[var(--font-comic)] text-3xl md:text-5xl lg:text-6xl text-waw-black mb-6 leading-tight"
            style={{ WebkitTextStroke: "1px #000" }}
          >
            Creamos experiencias digitales
            <br />
            <span className="text-waw-violet">que te hacen decir</span>{" "}
            <span className="text-waw-yellow bg-waw-black px-4 py-1 inline-block transform -rotate-2">
              WAW!
            </span>
          </motion.h2>

          {/* Subtitle — stack concreto */}
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-waw-black/80 mb-4 max-w-3xl font-medium"
          >
            Webs, automatizaciones con IA y software creativo hecho a medida.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button
              size="lg"
              className="comic-border bg-waw-yellow text-waw-black hover:bg-waw-yellow/90 font-[var(--font-comic)] text-xl px-8 py-6 transform hover:scale-105 transition-transform"
              onClick={() =>
                document
                  .getElementById("contacto")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Quiero mi solución
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="comic-border bg-waw-white text-waw-black hover:bg-waw-violet hover:text-waw-white font-[var(--font-comic)] text-xl px-8 py-6 transform hover:scale-105 transition-transform"
              onClick={() =>
                document
                  .getElementById("roi-calculator")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <Calculator className="mr-2 h-5 w-5" />
              Calcular mi ahorro
            </Button>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            <div className="w-8 h-12 border-4 border-waw-black rounded-full flex justify-center pt-2">
              <motion.div
                className="w-2 h-2 bg-waw-black rounded-full"
                animate={{ y: [0, 16, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
