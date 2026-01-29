import { Navbar } from "@/components/sections/navbar"
import { Hero } from "@/components/sections/hero"
import { IdeasMachine } from "@/components/sections/ideas-machine"
import { Services } from "@/components/sections/services"
import { HowWeWork } from "@/components/sections/how-we-work"
import { SolutionBuilder } from "@/components/solution-builder"
import { Portfolio } from "@/components/sections/portfolio"
import { Team } from "@/components/sections/team"
import { Contact } from "@/components/sections/contact"
import { Footer } from "@/components/sections/footer"
import { EasterEggs } from "@/components/easter-eggs"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <IdeasMachine />
      <Services />
      <HowWeWork />
      <SolutionBuilder />
      <Portfolio />
      <Team />
      <Contact />
      <Footer />
      <EasterEggs />
    </main>
  )
}
