/*
  Hero "sticker que se arma": el logo WAW! se construye por capas al cargar
  (contorno → sombra → relleno → tramado → acentos → palabra) y, al scrollear,
  se despega en esas mismas capas. Todo es un único SVG: liviano en mobile.
  La capa de movimiento escribe --p (0 a 1) sobre .hero-logo.
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

export const BURST = burstPath(300, 300, 270)

// cada acento sale despedido hacia su lado al despegarse
const TRIANGLES = [
  { d: "M92 120 L150 150 L104 172Z", tx: -90, ty: -70 },
  { d: "M478 96 L470 150 L432 118Z", tx: 90, ty: -90 },
  { d: "M520 420 L452 430 L488 470Z", tx: 110, ty: 70 },
  { d: "M150 470 L196 446 L182 500Z", tx: -80, ty: 100 },
]

const css = (vars: Record<string, string | number>) => vars as CSSProperties

export function HeroArt() {
  return (
    <div className="hero-logo hero-sticker" data-hero-logo aria-hidden="true">
      <svg viewBox="-20 -20 660 660">
        <defs>
          <pattern id="dots-st" width="22" height="22" patternUnits="userSpaceOnUse">
            <circle cx="11" cy="11" r="5" fill="#f2b705" />
          </pattern>
          <clipPath id="burst-clip-st"><path d={BURST} /></clipPath>
        </defs>

        <g className="st st--shadow"><path d={BURST} fill="#5b2ee6" transform="translate(22 26)" /></g>
        <g className="st st--fill"><path d={BURST} fill="#ffd633" /></g>
        <g className="st st--dots"><rect width="600" height="600" fill="url(#dots-st)" clipPath="url(#burst-clip-st)" /></g>
        <g className="st st--outline">
          <path d={BURST} fill="none" stroke="#0b0b0b" strokeWidth="6" strokeLinejoin="round" pathLength={1} />
        </g>
        {TRIANGLES.map((t, i) => (
          <g key={t.d} className="st st--tri" style={css({ "--tx": t.tx, "--ty": t.ty, "--i": i })}>
            <path d={t.d} fill="#ff5a4e" />
          </g>
        ))}
        <g className="st st--word">
          <g transform="rotate(-8 300 300)">
            <text x="308" y="340" textAnchor="middle" className="hero-art__word" fontSize="190" fill="#0b0b0b">WAW!</text>
            <text x="300" y="330" textAnchor="middle" className="hero-art__word" fontSize="190" fill="#fff" stroke="#0b0b0b" strokeWidth="10" paintOrder="stroke" strokeLinejoin="round">WAW!</text>
          </g>
        </g>
        <g className="st st--studio">
          <g transform="rotate(-8 300 300)">
            <text x="396" y="392" textAnchor="middle" className="hero-art__word" fontSize="46" fill="#fff" stroke="#0b0b0b" strokeWidth="6" paintOrder="stroke" letterSpacing="2">STUDIO</text>
          </g>
        </g>
      </svg>
    </div>
  )
}
