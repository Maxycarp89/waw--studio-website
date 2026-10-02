import Image from "next/image"
import { HeroArt } from "./hero-art"

const WHATSAPP = "https://wa.me/5493816262536"
const WHATSAPP_IDEA = `${WHATSAPP}?text=${encodeURIComponent("Hola WAW! Tengo una idea 🚀")}`

const NAV = [
  { label: "Trabajo", href: "#trabajo" },
  { label: "Servicios", href: "#servicios" },
  { label: "Proceso", href: "#proceso" },
  { label: "Contacto", href: "#contacto" },
]

/* Texto que se ilumina palabra por palabra; `hl` marca las palabras en acento. */
function Words({ parts }: { parts: { text: string; hl?: boolean }[] }) {
  return (
    <p data-words>
      {parts.flatMap((part, i) =>
        part.text.split(/\s+/).filter(Boolean).map((w, j) => (
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
        <a className="btn" href={WHATSAPP} target="_blank" rel="noopener noreferrer" data-magnetic>Hablemos</a>
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
    <section className="shell hero" id="top">
      <div>
        <span className="eyebrow"><i />Estudio creativo · Tucumán</span>
        <h1 className="display">
          <span className="line"><span>Hacemos que</span></span>
          <span className="line"><span className="hollow" style={{ ["--d" as string]: "120ms" }}>tu marca</span></span>
          <span className="line"><span style={{ ["--d" as string]: "240ms" }}>diga <span className="sticker">WAW!</span></span></span>
        </h1>
        <div className="hero-foot">
          <p>Webs, identidades y automatizaciones con IA para negocios que quieren dejar de parecerse a su competencia. Primero la idea, después el código.</p>
          <div className="hero-ctas">
            <a className="btn" href="#contacto" data-magnetic>Contanos tu idea</a>
            <a className="btn btn--ghost" href="#trabajo">Ver trabajos</a>
          </div>
        </div>
      </div>
      <HeroArt />
    </section>
  )
}

const RIBBON_A = ["Webs que venden", "Automatizaciones con IA", "Branding con carácter", "Plataformas a medida"]
const RIBBON_B = ["Diseño", "Código", "Estrategia", "Movimiento", "Ideas"]

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
        <span className="eyebrow"><i />Manifiesto</span>
        <Words
          parts={[
            { text: "Hay marcas que se ven bien y marcas que se recuerdan. Nosotros hacemos las segundas: cada web, cada sistema y cada automatización arranca con una idea" },
            { text: "que hace que tu cliente diga WAW!", hl: true },
            { text: "antes de decir quiero." },
          ]}
        />
      </div>
    </section>
  )
}

type Tile = { src: string; alt: string; client: string; what: string; variant?: "logo" | "dark" }

const ROW_A: Tile[] = [
  { src: "/work/amartin-auto.webp", alt: "Auto en estudio oscuro para A.MARTIN", client: "A.MARTIN", what: "Web + catálogo", variant: "dark" },
  { src: "/work/invita-portada.webp", alt: "Pareja en sesión editorial para Invita", client: "Invita", what: "Plataforma SaaS" },
  { src: "/work/marypoppins-logo.webp", alt: "Logo de Mary Poppins, tienda de moda", client: "Mary Poppins", what: "Tienda de moda", variant: "logo" },
  { src: "/work/invita-fiesta.webp", alt: "Plantilla de fiesta de Invita", client: "Invita", what: "Plantillas de eventos" },
]
const ROW_B: Tile[] = [
  { src: "/work/invita-casamiento.webp", alt: "Colección casamiento de Invita", client: "Invita", what: "Colección casamiento" },
  { src: "/work/amartin-branding.webp", alt: "Identidad visual nocturna de A.MARTIN", client: "A.MARTIN", what: "Identidad visual", variant: "dark" },
  { src: "/work/invita-quince.webp", alt: "Colección 15 años de Invita", client: "Invita", what: "Colección 15 años" },
  { src: "/work/amartin-moto.webp", alt: "Moto para A.MARTIN", client: "A.MARTIN", what: "Motos en cuotas", variant: "dark" },
]

const CASES = [
  { n: "01", client: "A.MARTIN", img: "/work/amartin-auto.webp", text: "Usados seleccionados. Sitio premium con catálogo de autos y motos, fichas que se comparten por WhatsApp y panel para cargar stock.", tags: ["Web", "Catálogo", "Panel admin"] },
  { n: "02", client: "Invita", img: "/work/invita-casamiento.webp", text: "Plataforma para crear invitaciones digitales: colecciones para casamientos, quinces y eventos corporativos, lista para escalar.", tags: ["SaaS", "Producto", "Diseño"] },
  { n: "03", client: "Mary Poppins", img: "/work/marypoppins-logo.webp", text: "Tienda de moda que quería verse tan bien online como en su vidriera.", tags: ["Moda", "Presencia digital"] },
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
            <span className="rm"><span>Proyectos</span></span>
            <span className="rm"><span className="hollow">con firma propia</span></span>
          </h2>
        </div>
        <p className="ru">Concesionarias, tiendas de moda y plataformas de eventos. Distintos rubros, la misma obsesión: que se note.</p>
      </div>

      <div className="rows">
        <div className="row" data-drift="-1">{ROW_A.map((t) => <TileCard key={t.src} t={t} />)}</div>
        <div className="row" data-drift="1" style={{ marginLeft: "-30vw" }}>{ROW_B.map((t) => <TileCard key={t.src} t={t} />)}</div>
        <div className="badge" aria-hidden="true">
          <svg viewBox="0 0 200 200" data-spin>
            <defs><path id="badge-circle" d="M100,100 m-82,0 a82,82 0 1,1 164,0 a82,82 0 1,1 -164,0" /></defs>
            <text style={{ fontFamily: "var(--display)" }} fontSize="17" letterSpacing="5">
              <textPath href="#badge-circle">PROYECTOS REALES ✦ HECHOS EN TUCUMÁN ✦</textPath>
            </text>
          </svg>
          <b>WAW<em>!</em></b>
        </div>
      </div>

      <div className="shell cases">
        {CASES.map((c) => (
          <a key={c.n} className="case" href="#contacto" data-img={c.img}>
            <span>{c.n}</span>
            <h3>{c.client}</h3>
            <p>{c.text}</p>
            <div className="tags">{c.tags.map((t) => <i key={t}>{t}</i>)}</div>
          </a>
        ))}
      </div>
    </section>
  )
}

const SERVICES = [
  { title: "Webs que venden", text: "Sitios rápidos, con identidad propia y pensados para convertir visitas en consultas." },
  { title: "Automatizaciones con IA", text: "Chatbots, flujos y agentes que responden, cargan y avisan solos. Vos te ocupás de vender." },
  { title: "Branding con carácter", text: "Identidades que se reconocen de lejos: logo, tono, sistema visual y todo lo que los une." },
  { title: "Plataformas a medida", text: "Catálogos, paneles y productos SaaS hechos para tu operación, no para la de cualquiera." },
]

export function Services() {
  return (
    <section className="shell sec" id="servicios">
      <div className="head" data-reveal>
        <div>
          <span className="eyebrow ru"><i />Qué hacemos</span>
          <h2 className="display">
            <span className="rm"><span>Cuatro formas</span></span>
            <span className="rm"><span className="hollow">de destacarte</span></span>
          </h2>
        </div>
        <p className="ru">No vendemos paquetes cerrados. Combinamos lo que tu negocio necesita para crecer.</p>
      </div>
      <div className="services" data-reveal>
        {SERVICES.map((s, i) => (
          <article key={s.title} className="service ru">
            <span className="n">/0{i + 1}</span>
            <div><h3>{s.title}</h3><p>{s.text}</p></div>
          </article>
        ))}
      </div>
    </section>
  )
}

const STEPS = [
  { title: "Escuchamos", text: "Nos contás tu negocio, tu cliente y lo que te frena. Sin formularios eternos: una charla.", items: ["Diagnóstico de tu presencia actual", "Qué tareas se pueden automatizar"] },
  { title: "Buscamos la idea", text: "Antes de diseñar una pantalla, encontramos el concepto que te diferencia.", items: ["Concepto creativo", "Mapa del sitio o del flujo"] },
  { title: "Lo construimos", text: "Diseño y desarrollo en paralelo, con avances que ves cada semana.", items: ["Diseño, código e integraciones", "Revisiones cortas y frecuentes"] },
  { title: "Lanzamos y medimos", text: "Salimos al aire y seguimos ajustando con datos reales, no con suposiciones.", items: ["Analítica y mejoras", "Soporte después del lanzamiento"] },
]

export function Process() {
  return (
    <section className="shell sec" id="proceso">
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
        <span className="rm"><span>¿Hacemos</span></span>
        <span className="rm"><span className="hollow">algo WAW!?</span></span>
      </h2>
      <a className="round" href={WHATSAPP_IDEA} target="_blank" rel="noopener noreferrer" data-magnetic>Escri&shy;binos</a>
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
            <p>Estudio creativo de webs, marcas y automatizaciones. Desde Tucumán, para negocios de todo el país.</p>
          </div>
          <div><h4>Contacto</h4><a href={WHATSAPP}>+54 381 626 2536</a><a href="mailto:hola@wawstudio.com">hola@wawstudio.com</a></div>
          <div><h4>Seguinos</h4><a href="#">Instagram</a><a href="#">LinkedIn</a></div>
        </div>
        <div className="giant" aria-hidden="true">WAW!</div>
        <div className="legal"><span>© {new Date().getFullYear()} WAW! Studio</span><span>Hecho en Tucumán, Argentina</span></div>
      </div>
    </footer>
  )
}
