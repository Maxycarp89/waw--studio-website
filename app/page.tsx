import "./landing.css"
import { LandingMotion } from "@/components/landing/motion"
import { BotDemo } from "@/components/landing/bot-demo"
import { Calculator } from "@/components/landing/calculator"
import { Chrome, Hero, Ribbons, Manifesto, Work, Services, Process, Cta, Footer } from "@/components/landing/sections"

const WHATSAPP_BOT = `https://wa.me/5493816262536?text=${encodeURIComponent("Hola WAW! Quiero un bot que atienda a mis clientes 🤖")}`

export default function Home() {
  return (
    <>
      <Chrome />
      <main className="waw-main">
        <Hero />
        <Ribbons />
        <Manifesto />
        <Work />
        <Services />
        <BotDemo whatsapp={WHATSAPP_BOT} />
        <Process />
        <Calculator />
        <Cta />
      </main>
      <Footer />
      <LandingMotion />
    </>
  )
}
