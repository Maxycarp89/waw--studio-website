/*
  Hero "pantalla partida": la misma composición en dos estados, separados por
  una diagonal. A un lado, lo que ve el cliente (logo a color + proyecto real);
  al otro, el wireframe y el código que lo sostienen. La capa de movimiento
  escribe --cut (posición de la diagonal, en %) y --p (scroll) en .hero-logo:
  el mouse la mueve en desktop, en mobile se mece sola, y al scrollear gana
  el diseño terminado. Todo se mide en cqw para escalar con el contenedor.
*/

import Image from "next/image"

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
const TRIANGLES = ["M92 120 L150 150 L104 172Z", "M478 96 L470 150 L432 118Z", "M520 420 L452 430 L488 470Z", "M150 470 L196 446 L182 500Z"]

function Logo({ wire }: { wire?: boolean }) {
  if (wire) {
    return (
      <svg className="split-burst" viewBox="-20 -20 660 660">
        <rect x="20" y="20" width="560" height="560" className="wf-box" />
        <path d={BURST} className="wf-line" />
        <g transform="rotate(-8 300 300)">
          <text x="300" y="330" textAnchor="middle" className="hero-art__word wf-text" fontSize="190">WAW!</text>
        </g>
        {TRIANGLES.map((d) => <path key={d} d={d} className="wf-line" />)}
        <text x="24" y="10" className="wf-label">burst · 560 × 560</text>
        <text x="24" y="600" className="wf-label">#FFD633 · #5B2EE6 · #FF5A4E</text>
      </svg>
    )
  }
  return (
    <svg className="split-burst" viewBox="-20 -20 660 660">
      <defs>
        <pattern id="dots-split" width="22" height="22" patternUnits="userSpaceOnUse">
          <circle cx="11" cy="11" r="5" fill="#f2b705" />
        </pattern>
        <clipPath id="burst-clip-split"><path d={BURST} /></clipPath>
      </defs>
      <path d={BURST} fill="#5b2ee6" transform="translate(22 26)" />
      <path d={BURST} fill="#ffd633" stroke="#0b0b0b" strokeWidth="6" strokeLinejoin="round" />
      <rect width="600" height="600" fill="url(#dots-split)" clipPath="url(#burst-clip-split)" />
      <g fill="#ff5a4e">{TRIANGLES.map((d) => <path key={d} d={d} />)}</g>
      <g transform="rotate(-8 300 300)">
        <text x="308" y="340" textAnchor="middle" className="hero-art__word" fontSize="190" fill="#0b0b0b">WAW!</text>
        <text x="300" y="330" textAnchor="middle" className="hero-art__word" fontSize="190" fill="#fff" stroke="#0b0b0b" strokeWidth="10" paintOrder="stroke" strokeLinejoin="round">WAW!</text>
      </g>
    </svg>
  )
}

export function HeroArt() {
  return (
    <div className="hero-logo hero-split" data-hero-logo aria-hidden="true">
      {/* lo que ve el cliente */}
      <div className="split-layer split-final">
        <Logo />
        <figure className="split-card">
          <Image src="/work/amartin-auto.webp" alt="" width={480} height={360} />
          <figcaption><b>A.MARTIN</b><span>Sistema comercial + web</span></figcaption>
        </figure>
      </div>

      {/* lo que hay detrás: wireframe + código */}
      <div className="split-layer split-wire">
        <Logo wire />
        <div className="split-card split-card--wire">
          <svg viewBox="0 0 100 75" preserveAspectRatio="none"><path d="M0 0 L100 75 M100 0 L0 75" /></svg>
          <span className="wf-bar" />
          <span className="wf-bar wf-bar--short" />
        </div>
        <pre className="split-code">{`<Hero>
  <Logo marca="WAW!" />
  <Card cliente="A.MARTIN"
        tipo="sistema" />
</Hero>`}</pre>
      </div>

      <div className="split-line"><span>código</span><span>diseño</span></div>
    </div>
  )
}
