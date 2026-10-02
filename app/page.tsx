import "./landing.css"
import { LandingMotion } from "@/components/landing/motion"
import { Chrome, Hero, Ribbons, Manifesto, Work, Services, Process, Cta, Footer } from "@/components/landing/sections"

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
        <Process />
        <Cta />
      </main>
      <Footer />
      <LandingMotion />
    </>
  )
}
