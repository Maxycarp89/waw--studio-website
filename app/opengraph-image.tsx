/*
  Imagen de vista previa al compartir el link (WhatsApp, LinkedIn, X…).
  Se genera en el build con el mismo lenguaje visual de la landing.
*/
import { ImageResponse } from "next/og"
import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { BURST } from "@/components/landing/hero-art"

export const alt = "WAW! Studio — Diseñamos lo que tus clientes ven. Construimos lo que tu negocio necesita."
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const TRIANGLES = ["M92 120 L150 150 L104 172Z", "M478 96 L470 150 L432 118Z", "M520 420 L452 430 L488 470Z", "M150 470 L196 446 L182 500Z"]

// el estallido como SVG de paths (sin texto: el texto lo dibuja satori con Anton)
const burstSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-20 -20 660 660">
  <path d="${BURST}" fill="#5b2ee6" transform="translate(22 26)"/>
  <path d="${BURST}" fill="#ffd633" stroke="#0b0b0b" stroke-width="6" stroke-linejoin="round"/>
  ${TRIANGLES.map((d) => `<path d="${d}" fill="#ff5a4e"/>`).join("")}
</svg>`

export default async function Image() {
  const anton = await readFile(join(process.cwd(), "app/_og/Anton-Regular.ttf"))
  const ink = "#0b0b0b"
  // contorno negro alrededor de la palabra, como en el logo
  const outline = [-5, 0, 5].flatMap((x) => [-5, 0, 5].map((y) => `${x}px ${y}px 0 ${ink}`)).join(", ")

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: ink, padding: "64px 72px", position: "relative", fontFamily: "Anton" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 720, height: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, color: "#f4f1ea", fontSize: 26, letterSpacing: 2 }}>
            <div style={{ width: 16, height: 16, background: "#ffd633" }} />
            ESTUDIO CREATIVO
          </div>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 74, lineHeight: 1, color: "#f4f1ea" }}>
            <span>DISEÑAMOS LO QUE</span>
            <span>TUS CLIENTES VEN.</span>
            <span style={{ color: "#ffd633" }}>CONSTRUIMOS LO QUE</span>
            <span style={{ color: "#ffd633" }}>TU NEGOCIO NECESITA.</span>
          </div>
          <div style={{ display: "flex", color: "#8f8b84", fontSize: 24, letterSpacing: 1.5 }}>
            WEBS · AUTOMATIZACIONES CON IA · BRANDING · SISTEMAS A MEDIDA
          </div>
        </div>

        <div style={{ position: "absolute", right: 20, top: 85, width: 480, height: 480, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- satori solo acepta <img> */}
          <img src={`data:image/svg+xml;utf8,${encodeURIComponent(burstSvg)}`} width={480} height={480} alt="" style={{ position: "absolute", left: 0, top: 0 }} />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", transform: "rotate(-8deg)", marginTop: -10 }}>
            <span style={{ fontSize: 150, lineHeight: 1, color: "#fff", textShadow: `${outline}, 12px 14px 0 ${ink}` }}>WAW!</span>
            <span style={{ fontSize: 40, lineHeight: 1, color: "#fff", marginTop: -6, marginRight: -10, textShadow: outline.replace(/5px/g, "3px") }}>STUDIO</span>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Anton", data: anton, style: "normal", weight: 400 }] },
  )
}
