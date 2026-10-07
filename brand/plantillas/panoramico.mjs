/*
  Carruseles panorámicos (estilo SCRL): cada carrusel se diseña como UNA sola
  imagen ancha (N × 1080 por 1350) y se corta en slides exactas de 1080×1350.
  Lo que cruza un corte (sticker, cinta, fotos) continúa en la slide siguiente
  al deslizar, sin saltos, porque todas las slides salen del mismo render.

  Uso, desde la raíz del repo:
    node brand/plantillas/panoramico.mjs
  Textos y fotos: brand/plantillas/carruseles.json
  Salida: brand/plantillas/carruseles/<archivo>/01.png … y <archivo>-completo.png

  Reglas que respeta el diseño: ningún texto sobre un corte, la slide 1 se
  entiende sola (es la que se ve en el perfil) y el texto importante queda lejos
  del borde de arriba y de abajo, donde Instagram superpone su interfaz.
*/

import { chromium } from "playwright"
import fs from "fs"
import path from "path"
import { pathToFileURL } from "url"

const ROOT = process.cwd()
const DIR = path.join(ROOT, "brand/plantillas")
const OUT = path.join(DIR, "carruseles")
const S = 1080 // ancho de cada slide
const H = 1350
const url = (p) => pathToFileURL(path.join(ROOT, p)).href

// mismo estallido que components/landing/hero-art.tsx
const OUTER = [1, 0.84, 0.97, 0.8, 0.94, 0.86, 1, 0.82, 0.95, 0.83, 0.98, 0.85, 0.9]
const INNER = [0.6, 0.66, 0.58, 0.64, 0.6, 0.67, 0.57, 0.65, 0.6, 0.63, 0.58, 0.66, 0.61]
function burst(cx, cy, r) {
  const n = OUTER.length
  const pts = []
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2
    const b = ((i + 0.5) / n) * Math.PI * 2 - Math.PI / 2
    pts.push(`${(cx + Math.cos(a) * r * OUTER[i]).toFixed(1)},${(cy + Math.sin(a) * r * OUTER[i]).toFixed(1)}`)
    pts.push(`${(cx + Math.cos(b) * r * INNER[i]).toFixed(1)},${(cy + Math.sin(b) * r * INNER[i]).toFixed(1)}`)
  }
  return `M${pts.join("L")}Z`
}
const BURST = burst(300, 300, 270)

const esc = (s = "") => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
const rich = (s = "") =>
  s
    .split("\n")
    .map((l) => {
      const hollow = l.startsWith("~")
      const t = esc(hollow ? l.slice(1) : l).replace(/\*(.+?)\*/g, "<em>$1</em>")
      return `<span class="ln${hollow ? " hollow" : ""}">${t}</span>`
    })
    .join("")

const box = (x, y, w, h, rot = 0) => `left:${x}px;top:${y}px;width:${w}px;${h ? `height:${h}px;` : ""}rotate:${rot}deg`
const stamp = (text, x, y, size, { fill = "#ffd633", rot = -8, shadow = "#5b2ee6" } = {}) => `
  <div class="stamp" style="${box(x, y, size, size, rot)}">
    <svg viewBox="-20 -20 660 660">
      ${shadow ? `<path d="${BURST}" fill="${shadow}" transform="translate(22 26)"/>` : ""}
      <path d="${BURST}" fill="${fill}" stroke="#0b0b0b" stroke-width="8" stroke-linejoin="round"/>
    </svg>
    <b data-fit="90"><span class="ln">${esc(text)}</span></b>
  </div>`
const logo = (x, y, size, rot) => `<img class="abs logo" src="${url("brand/waw-logo-sticker.svg")}" style="${box(x, y, size, 0, rot)}" alt="">`
const polaroid = (src, x, y, w, h, rot) =>
  `<figure class="abs polaroid" style="${box(x, y, w, h, rot)}"><span style="background-image:url('${url(src)}')"></span></figure>`

const CARRUSELES = {
  servicios: (d) => {
    const n = 6
    const colors = [
      ["#ffd633", "#0b0b0b"],
      ["#7b4dff", "#fff"],
      ["#ff5a4e", "#0b0b0b"],
      ["#f4f1ea", "#0b0b0b"],
    ]
    const tape = Array(6).fill(d.cinta).flat().map((t) => `<span>${esc(t)}</span>`).join("")
    return {
      n,
      bg: "#0b0b0b",
      html: `
        <div class="grid dark"></div>
        <svg class="abs" style="left:0;top:0" width="${n * S}" height="${H}">
          <path d="M-20 1080 C 500 880, 900 1260, 1620 1120 S 2700 920, 3240 1100 S 4400 1270, 4860 1060 S 5900 900, ${n * S + 20} 1010"
            fill="none" stroke="#ffd633" stroke-width="6" stroke-dasharray="4 22" stroke-linecap="round" opacity=".7"/>
        </svg>
        <div class="abs tape" style="left:-200px;top:200px;width:${n * S + 400}px;rotate:-2deg">${tape}</div>

        <span class="abs eyebrow" style="left:80px;top:430px">${esc(d.portada.etiqueta)}</span>
        <h1 class="abs display" data-fit="170" style="${box(80, 490, 920)}">${rich(d.portada.titulo)}</h1>
        ${logo(850, 860, 460, 10)}

        ${d.tarjetas
          .map((c, i) => {
            const x0 = (i + 1) * S
            const left = i === 0 ? 260 : 150
            const [bg, ink] = colors[i % colors.length]
            return `
            <article class="abs card" style="${box(x0 + left, 400, 760, 600, i % 2 ? 3 : -3)};background:${bg};color:${ink}">
              <span class="cn">/0${i + 1}</span>
              <div><h2 data-fit="96">${esc(c.titulo)}</h2><p>${esc(c.texto)}</p></div>
            </article>`
          })
          .join("")}

        ${d.fotos.map((f, i) => polaroid(f, (i + 2) * S - 180, 930, 360, 380, [-6, 5, -4][i % 3])).join("")}

        <h1 class="abs display" data-fit="190" style="${box(5 * S + 80, 380, 920)}">${rich(d.cierre.titulo)}</h1>
        ${stamp(d.cierre.boton, 5 * S + 330, 650, 440)}
        <p class="abs contact" style="${box(5 * S + 80, 1140, 920)}">${esc(d.cierre.contacto)}</p>
`,
    }
  },

  trabajos: (d) => {
    const n = 5
    // posición de cada foto y de su etiqueta (las etiquetas nunca pisan un corte)
    const L = [
      { f: [190, 640, 640, 470, -5], c: [220, 1130] },
      { f: [1270, 520, 470, 600, 4], c: [1300, 1150] },
      { f: [1900, 880, 540, 400, -3], c: [2210, 790] },
      { f: [2660, 470, 480, 620, 5], c: [2690, 1120] },
      { f: [3360, 620, 500, 500, -4], c: [3390, 1150] },
      { f: [4080, 470, 470, 600, 3], c: [3920, 440] },
    ]
    return {
      n,
      bg: "#f4f1ea",
      html: `
        <div class="grid light"></div>
        <h1 class="abs display ink" data-fit="330" style="${box(80, 110, 920)}">${rich(d.titulo)}</h1>
        <h1 class="abs giant">${esc(d.gigante)}</h1>
        ${d.proyectos
          .slice(0, L.length)
          .map((p, i) => {
            const [x, y, w, h, r] = L[i].f
            const [cx, cy] = L[i].c
            return `${polaroid(p.foto, x, y, w, h, r)}
              <div class="abs tag" style="left:${cx}px;top:${cy}px;rotate:${r > 0 ? -2 : 2}deg"><b>${esc(p.cliente)}</b>${esc(p.que)}</div>`
          })
          .join("")}
        <h1 class="abs display ink" data-fit="150" style="${box(4 * S + 300, 420, 700)}">${rich(d.cierre.titulo)}</h1>
        ${stamp(d.cierre.boton, 4 * S + 470, 780, 400, { fill: "#0b0b0b", shadow: "#ffd633" }).replace('class="stamp"', 'class="stamp inv"')}
        ${logo(4 * S + 820, 1080, 200, 8)}
`,
    }
  },
}

const CSS = `
@font-face { font-family: Anton; src: url('${url("app/_og/Anton-Regular.ttf")}'); }
* { box-sizing: border-box; }
html, body { margin: 0; }
.stage { position: relative; height: ${H}px; overflow: hidden; font-family: Inter, "Helvetica Neue", Arial, sans-serif; color: #f4f1ea; }
.abs { position: absolute; margin: 0; }
.grid { position: absolute; inset: 0; background: linear-gradient(90deg, var(--g) 1px, transparent 1px) 0 0 / 360px 100%; }
.grid.dark { --g: rgba(244,241,234,.07); }
.grid.light { --g: rgba(11,11,11,.07); }
.display { font-family: Anton, Impact, sans-serif; font-weight: 400; text-transform: uppercase; line-height: .92; letter-spacing: -.01em; }
.display.ink { color: #0b0b0b; }
.ln { display: block; white-space: nowrap; }
.display em { font-style: normal; color: #ffd633; }
.hollow { color: transparent; -webkit-text-stroke: 3px #f4f1ea; }
.ink .hollow { -webkit-text-stroke-color: #0b0b0b; }
.eyebrow { font-family: Anton, sans-serif; text-transform: uppercase; font-size: 34px; letter-spacing: .06em; color: #ffd633; }
.tape { display: flex; gap: 0; padding: 22px 0; background: #ffd633; color: #0b0b0b; white-space: nowrap; box-shadow: 0 14px 0 #0b0b0b; }
.tape span { font-family: Anton, sans-serif; text-transform: uppercase; font-size: 60px; line-height: 1; padding: 0 34px; }
.tape span::after { content: "✦"; margin-left: 68px; font-size: .6em; vertical-align: middle; }
.logo { filter: drop-shadow(0 14px 30px rgba(0,0,0,.45)); }
.card { border-radius: 28px; padding: 56px 60px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 14px 16px 0 #0b0b0b; border: 3px solid #0b0b0b; }
.card .cn { font-family: Anton, sans-serif; font-size: 40px; opacity: .65; }
.card h2 { font-family: Anton, sans-serif; font-weight: 400; text-transform: uppercase; line-height: .95; margin: 0 0 22px; }
.card h2 .ln { white-space: normal; }
.card p { font-size: 34px; line-height: 1.35; margin: 0; opacity: .85; }
.polaroid { background: #fff; padding: 16px 16px 56px; box-shadow: 0 24px 50px rgba(0,0,0,.4); }
.polaroid span { display: block; width: 100%; height: 100%; background-size: cover; background-position: center; }
.stamp { position: absolute; display: grid; place-items: center; color: #0b0b0b; }
.stamp.inv { color: #ffd633; }
.stamp svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
.stamp b { position: relative; font-family: Anton, sans-serif; font-weight: 400; text-transform: uppercase; line-height: .95; width: 50%; text-align: center; }
.contact { font-family: Anton, sans-serif; font-size: 52px; letter-spacing: .03em; text-align: center; }
.giant { left: 1560px; top: 40px; font-family: Anton, sans-serif; font-weight: 400; text-transform: uppercase; font-size: 520px; line-height: .9; white-space: nowrap; color: transparent; -webkit-text-stroke: 4px #0b0b0b; letter-spacing: -.01em; }
.tag { background: #0b0b0b; color: #f4f1ea; padding: 18px 26px; border-radius: 16px; font-size: 26px; display: flex; flex-direction: column; gap: 4px; box-shadow: 8px 8px 0 #ffd633; }
.tag b { font-family: Anton, sans-serif; font-weight: 400; font-size: 44px; text-transform: uppercase; line-height: 1; }
`

const data = JSON.parse(fs.readFileSync(path.join(DIR, "carruseles.json"), "utf8"))
const only = process.argv[2]
const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {})
for (const [key, build] of Object.entries(CARRUSELES)) {
  if (only && only !== key) continue
  const d = data[key]
  if (!d) continue
  const { n, bg, html } = build(d)
  const W = n * S
  const out = path.join(OUT, d.archivo)
  fs.rmSync(out, { recursive: true, force: true })
  fs.mkdirSync(out, { recursive: true })
  const page = await browser.newPage({ viewport: { width: W, height: H } })
  const tmp = path.join(out, ".tmp.html")
  fs.writeFileSync(tmp, `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body><div class="stage" style="width:${W}px;background:${bg}">${html}</div></body></html>`)
  await page.goto(pathToFileURL(tmp).href, { waitUntil: "load" })
  await page.evaluate(() => document.fonts.ready)
  await page.evaluate(() => {
    for (const el of document.querySelectorAll("[data-fit]")) {
      let size = Number(el.dataset.fit)
      const lines = [...el.querySelectorAll(".ln")]
      const tooWide = () => lines.some((l) => l.scrollWidth > el.clientWidth + 1) || el.scrollWidth > el.clientWidth + 1
      el.style.fontSize = `${size}px`
      while (size > 20 && tooWide()) el.style.fontSize = `${(size -= 2)}px`
    }
  })
  // todas las slides salen del mismo render: los cortes calzan al píxel
  await page.screenshot({ path: path.join(OUT, `${d.archivo}-completo.png`), clip: { x: 0, y: 0, width: W, height: H } })
  for (let i = 0; i < n; i++) {
    await page.screenshot({ path: path.join(out, `${String(i + 1).padStart(2, "0")}.png`), clip: { x: i * S, y: 0, width: S, height: H } })
  }
  fs.rmSync(tmp)
  await page.close()
  console.log(`✓ ${d.archivo}: ${n} slides`)
}
await browser.close()
