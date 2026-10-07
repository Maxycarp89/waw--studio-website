/*
  Sticker del CTA final: el mismo estallido del hero, que acá se "estampa"
  cuando entra la sección (cierra la historia: arriba se despega, abajo se
  pega). Gira con el scroll (data-spin) y los acentos saltan al pasar el mouse.
*/

import type { CSSProperties } from "react"
import { BURST } from "./hero-art"

const TRIANGLES = [
  { d: "M60 110 L130 150 L74 178Z", tx: -1, ty: -1 },
  { d: "M520 80 L510 150 L462 112Z", tx: 1, ty: -1 },
  { d: "M560 450 L476 462 L520 512Z", tx: 1, ty: 1 },
  { d: "M110 490 L168 460 L150 528Z", tx: -1, ty: 1 },
]

export function StampArt() {
  return (
    <span className="stamp-art" aria-hidden="true">
      <svg viewBox="-40 -40 700 700" data-spin>
        <defs>
          <pattern id="dots-stamp" width="26" height="26" patternUnits="userSpaceOnUse">
            <circle cx="13" cy="13" r="5" fill="#f2b705" />
          </pattern>
          <clipPath id="burst-clip-stamp"><path d={BURST} /></clipPath>
        </defs>
        <path className="stamp-shadow" d={BURST} fill="#5b2ee6" transform="translate(22 26)" />
        <path className="stamp-fill" d={BURST} />
        <rect width="600" height="600" fill="url(#dots-stamp)" clipPath="url(#burst-clip-stamp)" opacity="0.55" />
        <path d={BURST} fill="none" stroke="#0b0b0b" strokeWidth="8" strokeLinejoin="round" />
        {TRIANGLES.map((t, i) => (
          <path key={t.d} className="stamp-tri" d={t.d} fill="#ff5a4e"
            style={{ "--tx": t.tx, "--ty": t.ty, "--i": i } as CSSProperties} />
        ))}
      </svg>
    </span>
  )
}
