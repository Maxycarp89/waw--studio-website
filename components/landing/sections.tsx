import Image from "next/image"
import { HeroArt } from "./hero-art"
import { StampArt } from "./stamp"

const WHATSAPP = "https://wa.me/5493816262536"
const WHATSAPP_IDEA = `${WHATSAPP}?text=${encodeURIComponent("Hola WAW! Quiero ordenar y automatizar mi agencia 🚗")}`

const NAV = [
  { label: "Qué resolvemos", href: "#servicios" },
  { label: "Para quién", href: "#para-quien" },
  { label: "Trabajo", href: "#trabajo" },
  { label: "Proceso", href: "#proceso" },
  { label: "Contacto", href: "#contacto" },
]

/* Texto que se ilumina palabra por palabra; `hl` marca las palabras en acento. */
function Words({ parts }: { parts: { text?: string; hl?: boolean; br?: boolean }[] }) {
  return (
    <p data-words>
      {parts.flatMap((part, i) =>
        part.br ? [<br key={i} />, <br key={`${i}b`} />] : (part.text ?? "").split(/\s+/).filter(Boolean).map((w, j) => (
          <span key={`${i}-${j}`}>
            <span className={part.hl ? "w hl" : "w"}>{w}</span>{" "}
          </span>
        )),
      )}
    </p>
  )
}

export function Chrome() {
  return (
    <>
      <div className="intro" data-intro aria-hidden="true">
        <b>WAW!</b>
        <span data-intro-count>000</span>
      </div>
      <div className="progress" data-progress />
      <div className="cursor" data-cursor-dot />
      <div className="gridlines" aria-hidden="true"><span /><span /><span /><span /></div>

      <header className="nav" data-nav>
        <a className="logo" href="#top">WAW<em>!</em></a>
        <nav className="nav-links" aria-label="Principal">
          {NAV.map((n) => <a key={n.href} href={n.href}>{n.label}</a>)}
        </nav>
        <a className="btn" href={WHATSAPP} target="_blank" rel="noopener noreferrer" data-magnetic data-track="menu">Hablemos</a>
        <button className="burger" data-burger aria-label="Abrir menú">Menú</button>
      </header>
      <div className="menu" data-menu>
        {NAV.map((n) => <a key={n.href} href={n.href}>{n.label}</a>)}
      </div>
      <div className="hover-preview" data-preview aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element -- el src lo cambia la capa de movimiento */}
        <img alt="" src="/work/amartin-auto.webp" />
      </div>
    </>
  )
}

export function Hero() {
  return (
    <section className="hero-pin" id="top" data-hero-pin>
      <div className="hero-stage">
        <HeroArt />
        <div className="scroll-hint" data-hint="hero" aria-hidden="true"><span className="scroll-hint__icon"><i /></span>Deslizá</div>
        <div className="shell hero" data-hero-copy>
          <div>
            <span className="eyebrow"><i />Software · Automatización · IA</span>
            <h1 className="display">
              <span className="line"><span>Sistemas y</span></span>
              <span className="line"><span style={{ ["--d" as string]: "80ms" }}>automatización</span></span>
              <span className="line"><span className="hollow" style={{ ["--d" as string]: "160ms" }}>para el negocio</span></span>
              <span className="line"><span className="hollow" style={{ ["--d" as string]: "240ms" }}>automotor.</span></span>
            </h1>
            <div className="hero-foot">
              <p>Ayudamos a agencias de autos usados y concesionarias a digitalizar sus operaciones, automatizar procesos y tener control sobre sus clientes, vehículos y gestión comercial con software a medida e inteligencia artificial.</p>
              <p className="hero-tag">Menos trabajo manual. Más control. Mejores decisiones.</p>
              <div className="hero-ctas">
                <a className="btn" href="#contacto" data-magnetic data-track="hero">Contanos cómo trabajás</a>
                <a className="btn btn--ghost" href="#servicios">Ver qué resolvemos</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const RIBBON_A = ["Menos trabajo manual", "Más control", "Mejores decisiones", "Ninguna consulta perdida"]
const RIBBON_B = ["CRM", "Stock", "WhatsApp", "Dashboards", "IA", "Integraciones"]

export function Ribbons() {
  // el contenido va duplicado para que el loop del marquee no tenga saltos
  return (
    <div className="ribbons" aria-hidden="true">
      <div className="ribbon ribbon--a" data-marquee="1" data-speed=".7">
        <div className="ribbon-track">{[...RIBBON_A, ...RIBBON_A].map((t, i) => <span key={i}>{t}</span>)}</div>
      </div>
      <div className="ribbon ribbon--b" data-marquee="-1" data-speed=".5">
        <div className="ribbon-track">{[...RIBBON_B, ...RIBBON_B].map((t, i) => <span key={i}>{t}</span>)}</div>
      </div>
    </div>
  )
}

export function Manifesto() {
  return (
    <section className="shell sec">
      <div className="manifesto">
        <span className="eyebrow"><i />Lo que hacemos (y lo que no)</span>
        <Words
          parts={[
            { text: "No vendemos publicidad para conseguir consultas." },
            { text: "Construimos sistemas para aprovechar las que ya recibís.", hl: true },
            { br: true },
            { text: "No publicamos tus autos en redes." },
            { text: "Desarrollamos herramientas para gestionar el stock y la operación.", hl: true },
            { br: true },
            { text: "Nada de chatbots genéricos." },
            { text: "Automatizamos procesos reales del negocio.", hl: true },
          ]}
        />
      </div>
    </section>
  )
}

type Tile = { src: string; alt: string; client: string; what: string; variant?: "logo" | "dark" }

const ROW_A: Tile[] = [
  { src: "/work/amartin-auto.webp", alt: "Auto en estudio oscuro para A.MARTIN", client: "A.MARTIN", what: "Sistema comercial + catálogo", variant: "dark" },
  { src: "/work/invita-portada.webp", alt: "Pareja en sesión editorial para Invita", client: "Invita", what: "Plataforma SaaS" },
  { src: "/work/marypoppins-logo.webp", alt: "Logo de Mary Poppins, tienda de moda", client: "Mary Poppins", what: "CRM de gestión operativa", variant: "logo" },
  { src: "/work/invita-fiesta.webp", alt: "Plantilla de fiesta de Invita", client: "Invita", what: "Plantillas de eventos" },
]
const ROW_B: Tile[] = [
  { src: "/work/invita-casamiento.webp", alt: "Colección casamiento de Invita", client: "Invita", what: "Colección casamiento" },
  { src: "/work/amartin-branding.webp", alt: "Identidad visual nocturna de A.MARTIN", client: "A.MARTIN", what: "Agencia de usados", variant: "dark" },
  { src: "/work/invita-quince.webp", alt: "Colección 15 años de Invita", client: "Invita", what: "Colección 15 años" },
  { src: "/work/amartin-moto.webp", alt: "Moto para A.MARTIN", client: "A.MARTIN", what: "Motos en cuotas", variant: "dark" },
]

const CASES = [
  { n: "01", client: "A.MARTIN", logo: "/work/logo-amartin.svg", logoBg: "#000", img: "/work/amartin-auto.webp", text: "Agencia de usados. Sistema comercial con catálogo de autos y motos, fichas listas para compartir por WhatsApp y la financiación explicada en una sola pantalla.", tags: ["Automotor", "Catálogo", "Sistema comercial"] },
  { n: "02", client: "Invita", logo: "/work/logo-invita.webp", logoBg: "#ede6da", img: "/work/invita-casamiento.webp", text: "Plataforma para crear invitaciones digitales: colecciones para casamientos, quinces y eventos corporativos, lista para escalar.", tags: ["SaaS", "Producto", "Plataforma"] },
  { n: "03", client: "Mary Poppins", logo: "/work/logo-marypoppins.webp", logoBg: "#fff", img: "/work/marypoppins-logo.webp", text: "CRM de gestión operativa a medida para una tienda de moda: el día a día del negocio ordenado en un solo lugar.", tags: ["Moda", "CRM", "Gestión operativa"] },
]

function TileCard({ t }: { t: Tile }) {
  return (
    <figure className={`tile${t.variant ? ` tile--${t.variant}` : ""}`} data-cursor="Ver">
      {t.variant === "logo"
        ? <Image src={t.src} alt={t.alt} width={480} height={480} loading="lazy" />
        : <Image src={t.src} alt={t.alt} fill sizes="(max-width: 900px) 70vw, 30vw" loading="lazy" />}
      <figcaption><b>{t.client}</b><small>{t.what}</small></figcaption>
    </figure>
  )
}

export function Work() {
  return (
    <section className="sec work" id="trabajo">
      <div className="shell head" data-reveal>
        <div>
          <span className="eyebrow ru"><i />Trabajo real</span>
          <h2 className="display">
            <span className="rm"><span>Cosas que ya</span></span>
            <span className="rm"><span className="hollow">construimos</span></span>
          </h2>
        </div>
        <p className="ru">Sistemas comerciales, CRMs y plataformas SaaS. En el rubro automotor y en otros: la misma forma de resolver problemas con tecnología.</p>
      </div>

      <div className="rows">
        {/* fotos duplicadas: la fila es más ancha que la pantalla en todo su recorrido */}
        <div className="row" data-drift="-1">{[...ROW_A, ...ROW_A].map((t, i) => <TileCard key={i} t={t} />)}</div>
        <div className="row" data-drift="1" style={{ marginLeft: "-12vw" }}>{[...ROW_B, ...ROW_B].map((t, i) => <TileCard key={i} t={t} />)}</div>
        <div className="badge" aria-hidden="true">
          <svg viewBox="0 0 200 200" data-spin>
            <defs><path id="badge-circle" d="M100,100 m-82,0 a82,82 0 1,1 164,0 a82,82 0 1,1 -164,0" /></defs>
            <text style={{ fontFamily: "var(--display)" }} fontSize="17" letterSpacing="5">
              <textPath href="#badge-circle">PROYECTOS REALES ✦ SOFTWARE + IA ✦</textPath>
            </text>
          </svg>
          <b>WAW<em>!</em></b>
        </div>
      </div>

      <div className="shell cases">
        {CASES.map((c) => (
          <a key={c.n} className="case" href="#contacto" data-img={c.img} data-track={`caso-${c.client}`}>
            <span>{c.n}</span>
            <div className="case-name">
              <span className="case-logo" style={{ background: c.logoBg }}>
                <Image src={c.logo} alt={`Logo de ${c.client}`} width={120} height={120} />
              </span>
              <h3>{c.client}</h3>
            </div>
            <p>{c.text}</p>
            <div className="tags">{c.tags.map((t) => <i key={t}>{t}</i>)}</div>
          </a>
        ))}
      </div>
    </section>
  )
}

/* Lo que vendemos son resultados operativos, no tecnologías: cada tarjeta
   abre con el resultado y debajo lista lo que construimos para lograrlo. */
const SERVICES = [
  {
    tag: "CRM", title: "Centralizá clientes y oportunidades",
    text: "Que ninguna oportunidad quede perdida entre conversaciones.",
    items: ["Registro de interesados e historial", "Asignación a vendedores", "Embudo y estado de cada operación", "Alertas de clientes sin contactar"],
  },
  {
    tag: "Stock", title: "Controlá cada unidad del stock",
    text: "Sabé qué tenés, cuánto te costó y hace cuánto está parado.",
    items: ["Alta, estado y disponibilidad", "Costos, gastos y precios", "Permutas y datos de compra", "Alertas de unidades sin movimiento"],
  },
  {
    tag: "WhatsApp", title: "Que ninguna consulta quede olvidada",
    text: "Automatizamos la atención y el seguimiento comercial.",
    items: ["Recepción automática de consultas", "Detecta el vehículo y califica al comprador", "Deriva al vendedor que corresponde", "Seguimientos y recuperación de oportunidades"],
  },
  {
    tag: "Dashboards", title: "Sabé qué se vende y qué está parado",
    text: "Los números del negocio, claros y al día para el dueño.",
    items: ["Ventas por vendedor", "Rentabilidad por vehículo", "Stock y rotación", "Gastos, ingresos y rendimiento comercial"],
  },
  {
    tag: "IA", title: "Preguntale a tu negocio",
    text: "Reducí tareas manuales y consultá la información de tu agencia fácilmente.",
    items: ["Asistentes para vendedores y administración", "Consulta de stock en lenguaje natural", "Reportes generados solos", "Tareas repetitivas automatizadas"],
  },
  {
    tag: "A medida", title: "Cargá los datos una sola vez",
    text: "Conectamos tus herramientas y adaptamos el sistema a la forma en que trabaja tu agencia.",
    items: ["Integraciones entre sistemas", "Sincronización con plataformas externas", "Aplicaciones web administrativas", "Portales y plataformas propias"],
  },
]

export function Services() {
  return (
    <section className="shell sec" id="servicios">
      <div className="head" data-reveal>
        <div>
          <span className="eyebrow ru"><i />Qué resolvemos</span>
          <h2 className="display">
            <span className="rm"><span>Menos planillas.</span></span>
            <span className="rm"><span className="hollow">Más control.</span></span>
          </h2>
        </div>
        <p className="ru">Seis frentes donde la tecnología ordena una agencia. No hace falta resolver todo junto: empezamos por el que más duele y construimos sobre esa base.</p>
      </div>
      <div className="services" data-cards>
        {SERVICES.map((s, i) => (
          <article key={s.title} className="service" data-card>
            <span className="n">/0{i + 1} · {s.tag}</span>
            <div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              <ul>{s.items.map((it) => <li key={it}>{it}</li>)}</ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

/* Cliente ideal: negocios con problemas de gestión, no "agencias que necesitan más clientes". */
const FIT = [
  { who: "Agencia con varios vendedores", need: "CRM y seguimiento comercial" },
  { who: "Agencia con mucho stock", need: "Sistema de inventario" },
  { who: "Concesionaria multimarca", need: "Plataforma centralizada" },
  { who: "Agencia con varias sucursales", need: "Gestión unificada y reportes" },
  { who: "Dueño saturado de tareas", need: "Automatización e IA" },
  { who: "Agencia que vive en planillas", need: "Digitalización e integración" },
  { who: "Sistemas que no se hablan", need: "Integraciones y sincronización" },
]

export function ForWhom() {
  return (
    <section className="shell sec" id="para-quien">
      <div className="head" data-reveal>
        <div>
          <span className="eyebrow ru"><i />Para quién</span>
          <h2 className="display">
            <span className="rm"><span>¿Tu agencia</span></span>
            <span className="rm"><span className="hollow">está acá?</span></span>
          </h2>
        </div>
        <p className="ru">Trabajamos con negocios que tienen procesos manuales, información dispersa y poco control. Desde una agencia que necesita ordenar sus consultas hasta una concesionaria que quiere centralizar varias sucursales.</p>
      </div>
      <div className="fit" data-reveal>
        {FIT.map((f, i) => (
          <div key={f.who} className="fit-row ru" style={{ ["--d" as string]: `${i * 60}ms` }}>
            <span>0{i + 1}</span>
            <h3>{f.who}</h3>
            <i aria-hidden="true">→</i>
            <p>{f.need}</p>
          </div>
        ))}
      </div>
      <div className="fit-notes" data-reveal>
        <article className="ru">
          <h3>No hace falta tener los seis problemas</h3>
          <p>Entramos resolviendo uno concreto y, sobre la misma base, seguimos sumando soluciones a medida que la agencia crece.</p>
        </article>
        <article className="ru" style={{ ["--d" as string]: "120ms" }}>
          <h3>¿Tenés web? La potenciamos</h3>
          <p>Si ya tenés sitio, lo optimizamos y lo conectamos a tu sistema. Si no tenés, lo creamos junto a tu CRM para que cada consulta entre ordenada.</p>
        </article>
      </div>
    </section>
  )
}

const STEPS = [
  { title: "Entendemos la operación", text: "Nos contás cómo trabaja tu agencia: consultas, stock, vendedores y planillas. Sin formularios eternos: una charla.", items: ["Diagnóstico de procesos y herramientas", "Qué tareas se pueden automatizar"] },
  { title: "Elegimos por dónde empezar", text: "Antes de diseñar una pantalla, definimos qué problema conviene resolver primero y cómo medirlo.", items: ["Prioridades y alcance", "Mapa del flujo y de los datos"] },
  { title: "Construimos el sistema", text: "Software, automatizaciones e integraciones adaptados a tu forma de trabajar, con avances que ves cada semana.", items: ["Si tenés web, la conectamos; si no, la creamos", "Revisiones cortas y frecuentes"] },
  { title: "Medimos y seguimos sumando", text: "Salimos al aire, medimos con datos reales y sumamos nuevas soluciones sobre la misma base.", items: ["Indicadores y mejoras", "Soporte y nuevos módulos"] },
]

export function Process() {
  return (
    <section className="shell sec" id="proceso" data-theme-light>
      <div className="process" data-steps>
        <aside className="process-aside">
          <span className="eyebrow"><i />Cómo trabajamos</span>
          <div className="counter"><div><small>Paso</small><b><span data-step-current>1</span> / {STEPS.length}</b></div></div>
        </aside>
        <div className="steps">
          <span className="steps-line" data-step-line />
          {STEPS.map((s) => (
            <div key={s.title} className="step" data-step>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              <ul>{s.items.map((it) => <li key={it}>{it}</li>)}</ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Cta() {
  return (
    <section className="shell sec cta" id="contacto" data-reveal>
      <span className="eyebrow ru"><i />¿Arrancamos?</span>
      <h2 className="display">
        <span className="rm"><span>¿Qué parte de</span></span>
        <span className="rm"><span>tu agencia</span></span>
        <span className="rm"><span className="hollow">automatizamos primero?</span></span>
      </h2>
      <a className="round stamp" href={WHATSAPP_IDEA} target="_blank" rel="noopener noreferrer" data-magnetic data-track="cta-final" data-cursor="¡Dale!">
        <StampArt />
        <span className="stamp-label">Escri&shy;binos</span>
      </a>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="waw-footer">
      <div className="shell">
        <div className="foot">
          <div>
            <a className="logo" href="#top">WAW<em>!</em> Studio</a>
            <p>Desarrollo de software, automatización e inteligencia artificial. Especializados en el negocio automotor.</p>
          </div>
          <div><h3>Contacto</h3><a href={WHATSAPP} data-track="footer">+54 381 626 2536</a><a href="mailto:waw.studio.agency@gmail.com" data-track="footer">waw.studio.agency@gmail.com</a></div>
          <div><h3>Seguinos</h3><a href="#">Instagram</a><a href="#">LinkedIn</a></div>
        </div>
        {/* cada letra sube por separado con el scroll; el ! cae último y rebota */}
        <div className="giant" aria-hidden="true" data-giant>
          {["W", "A", "W", "!"].map((l, i) => <span key={i} className={l === "!" ? "gl gl--bang" : "gl"}>{l}</span>)}
        </div>
        <div className="legal"><span>© {new Date().getFullYear()} WAW! Studio</span><span>Software, automatización e IA</span></div>
      </div>
    </footer>
  )
}
