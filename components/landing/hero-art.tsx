/*
  Hero "sistema en vivo": tarjetas de interfaz reales (chat, aviso de cliente,
  consultas, cuotas, stock, formulario → CRM) flotan alrededor del logo WAW!,
  unidas por líneas que "transportan" datos. Al scrollear convergen al logo.
  La capa de movimiento escribe --p (scroll) y --mx/--my (mouse) en .hero-logo.
*/

import type { CSSProperties } from "react"

const OUTER = [1, 0.84, 0.97, 0.8, 0.94, 0.86, 1, 0.82, 0.95, 0.83, 0.98, 0.85, 0.9]
const INNER = [0.6, 0.66, 0.58, 0.64, 0.6, 0.67, 0.57, 0.65, 0.6, 0.63, 0.58, 0.66, 0.61]

function burstPath(cx: number, cy: number, r: number) {
  const n = OUTER.length
  const pts: string[] = []
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2
    const b = ((i + 0.5) / n) * Math.PI * 2 - Math.PI / 2
    pts.push(`${(cx + Math.cos(a) * r * OUTER[i]).toFixed(1)},${(cy + Math.sin(a) * r * OUTER[i]).toFixed(1)}`)
    pts.push(`${(cx + Math.cos(b) * r * INNER[i]).toFixed(1)},${(cy + Math.sin(b) * r * INNER[i]).toFixed(1)}`)
  }
  return `M${pts.join("L")}Z`
}

const BURST = burstPath(300, 300, 270)
const css = (vars: Record<string, string | number>) => vars as CSSProperties

// posición de cada tarjeta respecto del centro, en % del contenedor; d = profundidad
const CARDS = [
  { id: "chat", x: -40, y: -34, d: 1.2, desk: false },
  { id: "lead", x: 38, y: -40, d: 0.8, desk: false },
  { id: "count", x: 44, y: 6, d: 1.4, desk: false },
  { id: "chart", x: -44, y: 22, d: 0.9, desk: false },
  { id: "stock", x: 30, y: 42, d: 1.1, desk: true },
  { id: "form", x: -12, y: 46, d: 0.7, desk: true },
] as const

function Card({ id }: { id: (typeof CARDS)[number]["id"] }) {
  switch (id) {
    case "chat":
      return (
        <>
          <small>WhatsApp</small>
          <p className="sys-msg sys-msg--in">¿La tienen en cuotas?</p>
          <p className="sys-msg sys-msg--out">¡Sí! Te paso opciones 👇</p>
        </>
      )
    case "lead":
      return (
        <>
          <small>Nuevo cliente</small>
          <b>Lucas · Moto 2023</b>
          <span className="sys-tag">Asignado a ventas</span>
        </>
      )
    case "count":
      return (
        <>
          <small>Consultas hoy</small>
          <b className="sys-big" data-tick="48">48</b>
          <span className="sys-up">▲ 12% vs ayer</span>
        </>
      )
    case "chart":
      return (
        <>
          <small>Cuotas cobradas</small>
          <div className="sys-bars">{[38, 62, 48, 80, 70, 92].map((h, i) => <i key={i} style={css({ "--h": `${h}%`, "--i": i })} />)}</div>
        </>
      )
    case "stock":
      return (
        <>
          <small>Stock</small>
          <b>12 unidades</b>
          <div className="sys-meter"><i /></div>
        </>
      )
    case "form":
      return (
        <>
          <small>Formulario</small>
          <b>→ CRM <span className="sys-ok">✓</span></b>
        </>
      )
  }
}

export function HeroArt() {
  return (
    <div className="hero-logo hero-system" data-hero-logo aria-hidden="true">
      {/* líneas del centro a cada tarjeta, con datos viajando */}
      <svg className="sys-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
        {CARDS.map((c) => (
          <line key={c.id} className={c.desk ? "sys-desk" : undefined} x1="50" y1="50" x2={50 + c.x} y2={50 + c.y} />
        ))}
      </svg>

      <div className="sys-core">
        <svg viewBox="-20 -20 660 660">
          <defs>
            <pattern id="dots-sys" width="22" height="22" patternUnits="userSpaceOnUse">
              <circle cx="11" cy="11" r="5" fill="#f2b705" />
            </pattern>
            <clipPath id="burst-clip-sys"><path d={BURST} /></clipPath>
          </defs>
          <path d={BURST} fill="#5b2ee6" transform="translate(22 26)" />
          <path d={BURST} fill="#ffd633" stroke="#0b0b0b" strokeWidth="8" strokeLinejoin="round" />
          <rect width="600" height="600" fill="url(#dots-sys)" clipPath="url(#burst-clip-sys)" />
          <g transform="rotate(-8 300 300)">
            <text x="308" y="350" textAnchor="middle" className="hero-art__word" fontSize="200" fill="#0b0b0b">WAW!</text>
            <text x="300" y="340" textAnchor="middle" className="hero-art__word" fontSize="200" fill="#fff" stroke="#0b0b0b" strokeWidth="12" paintOrder="stroke" strokeLinejoin="round">WAW!</text>
          </g>
        </svg>
      </div>

      {CARDS.map((c, i) => (
        <div
          key={c.id}
          className={`sys-card sys-card--${c.id}${c.desk ? " sys-desk" : ""}`}
          style={css({ "--x": c.x, "--y": c.y, "--d": c.d, "--i": i })}
        >
          <Card id={c.id} />
        </div>
      ))}
    </div>
  )
}
