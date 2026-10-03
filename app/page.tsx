import "./landing.css"
import { LandingMotion } from "@/components/landing/motion"
import { BotDemo } from "@/components/landing/bot-demo"
import { Calculator } from "@/components/landing/calculator"
import { CONTACT, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "./site"
import { Chrome, Hero, Ribbons, Manifesto, Work, Services, Process, Cta, Footer } from "@/components/landing/sections"

const WHATSAPP_BOT = `https://wa.me/5493816262536?text=${encodeURIComponent("Hola WAW! Quiero un bot que atienda a mis clientes 🤖")}`

// datos estructurados: le dicen a Google qué es WAW! y cómo contactarlo
const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo-waw.png`,
  image: `${SITE_URL}/opengraph-image`,
  description: SITE_DESCRIPTION,
  email: CONTACT.email,
  telephone: CONTACT.phone,
  knowsAbout: ["Desarrollo web", "Automatizaciones con IA", "Chatbots de WhatsApp", "Branding", "Sistemas a medida"],
}

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
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
