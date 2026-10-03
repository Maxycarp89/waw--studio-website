/*
  Pieza 3D del hero: el estallido de la marca WAW! extruido en capas.
  Es CSS 3D puro (SVG apilados con translateZ). La capa de movimiento
  escribe --rx, --ry y --explode en .hero-3d según el scroll y el mouse:
  el objeto gira y se "desarma" en sus capas a medida que se scrollea.
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
const DEPTH = 14 // capas de la extrusión violeta

export function HeroArt() {
  return (
    <div className="hero-3d" data-hero-3d aria-hidden="true">
      <div className="hero-3d__scene">
        {/* extrusión: copias del contorno hacia atrás, cada vez más oscuras */}
        {Array.from({ length: DEPTH }, (_, i) => (
          <svg key={i} className="layer" viewBox="0 0 600 600" style={{ ["--z" as string]: -(i + 1) * 4 }}>
            <path d={BURST} fill={`hsl(256 ${78 - i}% ${58 - i * 2.2}%)`} />
          </svg>
        ))}

        {/* cara amarilla */}
        <svg className="layer" viewBox="0 0 600 600" style={{ ["--z" as string]: 0 }}>
          <path d={BURST} fill="#ffd633" stroke="#0b0b0b" strokeWidth="6" strokeLinejoin="round" />
        </svg>

        {/* tramado de puntos, apenas separado de la cara */}
        <svg className="layer" viewBox="0 0 600 600" style={{ ["--z" as string]: 8 }}>
          <defs>
            <pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse">
              <circle cx="11" cy="11" r="5" fill="#f2b705" />
            </pattern>
            <clipPath id="burst-clip"><path d={BURST} /></clipPath>
          </defs>
          <rect width="600" height="600" fill="url(#dots)" clipPath="url(#burst-clip)" />
        </svg>

        {/* acentos coral */}
        <svg className="layer layer--hi" viewBox="0 0 600 600" style={{ ["--z" as string]: 26 }}>
          <path d="M92 120 L150 150 L104 172Z" fill="#ff5a4e" />
          <path d="M478 96 L470 150 L432 118Z" fill="#ff5a4e" />
          <path d="M520 420 L452 430 L488 470Z" fill="#ff5a4e" />
          <path d="M150 470 L196 446 L182 500Z" fill="#ff5a4e" />
        </svg>

        {/* palabra, con su propia sombra para que lea como volumen */}
        <svg className="layer layer--hi" viewBox="0 0 600 600" style={{ ["--z" as string]: 48 }}>
          <g transform="rotate(-8 300 300)">
            <text x="306" y="338" textAnchor="middle" className="hero-3d__word" fontSize="190" fill="#0b0b0b">WAW!</text>
            <text x="300" y="330" textAnchor="middle" className="hero-3d__word" fontSize="190" fill="#fff" stroke="#0b0b0b" strokeWidth="10" paintOrder="stroke" strokeLinejoin="round">WAW!</text>
          </g>
        </svg>
        <svg className="layer layer--hi" viewBox="0 0 600 600" style={{ ["--z" as string]: 58 }}>
          <g transform="rotate(-8 300 300)">
            <text x="396" y="392" textAnchor="middle" className="hero-3d__word" fontSize="46" fill="#fff" stroke="#0b0b0b" strokeWidth="6" paintOrder="stroke" letterSpacing="2">STUDIO</text>
          </g>
        </svg>
      </div>
    </div>
  )
}
