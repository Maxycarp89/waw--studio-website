import "./landing.css"
import { LandingMotion } from "@/components/landing/motion"
import { BotDemo } from "@/components/landing/bot-demo"
import { Calculator } from "@/components/landing/calculator"
import { CONTACT, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "./site"
import { Chrome, Hero, Ribbons, Manifesto, Work, Services, ForWhom, Process, Cta, Footer } from "@/components/landing/sections"

const WHATSAPP_BOT = `https://wa.me/5493816262536?text=${encodeURIComponent("Hola WAW! Quiero automatizar las consultas de mi agencia 🚗")}`

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
  slogan: "Menos trabajo manual. Más control. Mejores decisiones.",
  knowsAbout: [
    "Desarrollo de software a medida",
    "Automatización de procesos",
    "Inteligencia artificial aplicada",
    "CRM para agencias de autos",
    "Gestión de stock de vehículos",
    "Automatización de WhatsApp",
    "Dashboards e inteligencia de negocio",
    "Integraciones entre sistemas",
  ],
  audience: { "@type": "BusinessAudience", audienceType: "Agencias de autos usados y concesionarias" },
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
        <Services />
        <BotDemo whatsapp={WHATSAPP_BOT} />
        <ForWhom />
        <Work />
        <Process />
        <Calculator />
        <Cta />
      </main>
      <Footer />
      <LandingMotion />
    </>
  )
}
