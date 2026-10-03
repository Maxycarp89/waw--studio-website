/*
  Logo de fondo del hero: el estallido WAW! en un único SVG plano.
  La capa de movimiento solo le cambia transform (y el ancho cuando el
  scroll se detiene, para redibujarlo nítido): liviano en cualquier celular.
*/

// Estallido de 13 puntas con radios irregulares, como el logo de cómic.
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

export function HeroArt() {
  return (
    <div className="hero-logo" data-hero-logo aria-hidden="true">
      <svg viewBox="-20 -20 660 660">
        <defs>
          <pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse">
            <circle cx="11" cy="11" r="5" fill="#f2b705" />
          </pattern>
          <clipPath id="burst-clip"><path d={BURST} /></clipPath>
        </defs>

        {/* sombra violeta desplazada: da volumen sin 3D */}
        <path d={BURST} fill="#5b2ee6" transform="translate(22 26)" />
        <path d={BURST} fill="#ffd633" stroke="#0b0b0b" strokeWidth="6" strokeLinejoin="round" />
        <rect width="600" height="600" fill="url(#dots)" clipPath="url(#burst-clip)" />

        <g fill="#ff5a4e">
          <path d="M92 120 L150 150 L104 172Z" />
          <path d="M478 96 L470 150 L432 118Z" />
          <path d="M520 420 L452 430 L488 470Z" />
          <path d="M150 470 L196 446 L182 500Z" />
        </g>

        <g transform="rotate(-8 300 300)">
          <text x="308" y="340" textAnchor="middle" className="hero-logo__word" fontSize="190" fill="#0b0b0b">WAW!</text>
          <text x="300" y="330" textAnchor="middle" className="hero-logo__word" fontSize="190" fill="#fff" stroke="#0b0b0b" strokeWidth="10" paintOrder="stroke" strokeLinejoin="round">WAW!</text>
          <text x="396" y="392" textAnchor="middle" className="hero-logo__word" fontSize="46" fill="#fff" stroke="#0b0b0b" strokeWidth="6" paintOrder="stroke" letterSpacing="2">STUDIO</text>
        </g>
      </svg>
    </div>
  )
}
