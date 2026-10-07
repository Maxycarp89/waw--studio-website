/*
  Plantillas de posteo de Instagram (1080×1350) con la estética del sitio.
  El contenido se edita en posteos.json; este script arma cada posteo en HTML
  y lo exporta a PNG con Playwright (Chromium).

  Uso, desde la raíz del repo:
    node brand/plantillas/generar.mjs
  Salida: brand/plantillas/ejemplos/<archivo>.png

  Marcas en los textos:  *palabra*  → amarilla   ·   línea que empieza con ~ → hueca (solo contorno)
*/

import { chromium } from "playwright"
import fs from "fs"
import path from "path"
import { pathToFileURL } from "url"

const ROOT = process.cwd()
const DIR = path.join(ROOT, "brand/plantillas")
const OUT = path.join(DIR, "ejemplos")
const W = 1080
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
// *palabra* en amarillo; ~ al inicio de línea = texto hueco
const rich = (s = "") =>
  s
    .split("\n")
    .map((l) => {
      const hollow = l.startsWith("~")
      const t = esc(hollow ? l.slice(1) : l).replace(/\*(.+?)\*/g, '<em>$1</em>')
      return `<span class="ln${hollow ? " hollow" : ""}">${t}</span>`
    })
    .join("")

// estallido de la marca con texto adentro (botones, reacciones)
const stamp = (text, { fill = "#ffd633", ink = "#0b0b0b", size = 300, rot = -8, shadow = "#5b2ee6" } = {}) => `
  <div class="stamp" style="width:${size}px;height:${size}px;rotate:${rot}deg;color:${ink}">
    <svg viewBox="-20 -20 660 660">
      ${shadow ? `<path d="${BURST}" fill="${shadow}" transform="translate(22 26)"/>` : ""}
      <path d="${BURST}" fill="${fill}" stroke="#0b0b0b" stroke-width="8" stroke-linejoin="round"/>
    </svg>
    <b data-fit="80"><span class="ln">${esc(text)}</span></b>
  </div>`

const logo = (size, extra = "") => `<img class="logo" src="${url("brand/waw-logo-sticker.svg")}" style="width:${size}px;${extra}" alt="">`
const firma = (color) => `<img class="firma" src="${url(`brand/waw-firma-${color}.svg`)}" alt="">`
const pie = (txt, dark = true) => `<footer class="pie" style="color:${dark ? "rgba(244,241,234,.7)" : "rgba(11,11,11,.75)"}">${esc(txt)}</footer>`

const PLANTILLAS = {
  // frase grande sobre negro, con la grilla del sitio y el sticker en la esquina
  frase: (p, d) => `
    <section class="post dark grid">
      <span class="eyebrow"><i></i>${esc(p.etiqueta)}</span>
      <h1 class="display xl" data-fit="150">${rich(p.texto)}</h1>
      ${logo(250, "position:absolute;right:56px;bottom:110px;rotate:6deg")}
      ${pie(d.pie)}
    </section>`,

  // servicio sobre amarillo: número, título, bajada y lista
  servicio: (p, d) => `
    <section class="post yellow">
      <span class="num">/${esc(p.numero)}</span>
      <h1 class="display lg" data-fit="130">${rich(p.titulo)}</h1>
      <p class="lead">${esc(p.texto)}</p>
      <ul class="list">${(p.puntos || []).map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
      <div class="sign">${firma("negra")}</div>
      ${pie(d.pie, false)}
    </section>`,

  // trabajo: foto a sangre, degradado y datos del proyecto
  trabajo: (p, d) => `
    <section class="post photo" style="background-image:url('${url(p.foto)}')">
      <div class="shade"></div>
      ${logo(190, "position:absolute;right:56px;top:56px;rotate:8deg")}
      <div class="work">
        <span class="eyebrow light"><i></i>Trabajo real</span>
        <h1 class="display lg" data-fit="150"><span class="ln">${esc(p.cliente)}</span></h1>
        <p class="lead light">${esc(p.texto)}</p>
        <div class="tags">${(p.etiquetas || []).map((t) => `<i>${esc(t)}</i>`).join("")}</div>
      </div>
      ${pie(d.pie)}
    </section>`,

  // dato: un número grande sobre violeta con una reacción
  dato: (p, d) => `
    <section class="post violet">
      <span class="eyebrow light"><i></i>${esc(p.etiqueta)}</span>
      <div class="big" data-fit="200"><span class="ln">${esc(p.numero)}</span></div>
      <p class="lead light wide">${esc(p.texto)}</p>
      <div style="position:absolute;right:60px;top:170px">${stamp(p.reaccion, { fill: "#ff5a4e", size: 330, rot: 10, shadow: "#0b0b0b" })}</div>
      <div class="sign">${firma("blanca")}</div>
      ${pie(d.pie)}
    </section>`,

  // contacto: la pregunta del sitio y el sticker "Escribinos"
  contacto: (p, d) => `
    <section class="post dark grid center">
      <h1 class="display lg" data-fit="140">${rich(p.titulo)}</h1>
      <div class="cta">${stamp(p.boton, { size: 420 })}</div>
      <p class="contact">${esc(p.contacto)}</p>
      ${pie(d.pie)}
    </section>`,
}

const CSS = `
@font-face { font-family: Anton; src: url('${url("app/_og/Anton-Regular.ttf")}'); }
* { box-sizing: border-box; }
html, body { margin: 0; }
.post { position: relative; width: ${W}px; height: ${H}px; overflow: hidden; padding: 96px 80px; display: flex; flex-direction: column;
  font-family: Inter, "Helvetica Neue", Arial, sans-serif; background-size: cover; background-position: center; }
.dark { background: #0b0b0b; color: #f4f1ea; }
.yellow { background: #ffd633; color: #0b0b0b; }
.violet { background: #7b4dff; color: #fff; }
.photo { color: #f4f1ea; justify-content: flex-end; }
.center { align-items: center; text-align: center; justify-content: center; }
.grid::before { content: ""; position: absolute; inset: 0 80px; background:
  linear-gradient(90deg, rgba(244,241,234,.08) 1px, transparent 1px) 0 0 / calc((100% - 1px) / 3) 100%; border-right: 1px solid rgba(244,241,234,.08); pointer-events: none; }
.display { width: 100%; font-family: Anton, Impact, sans-serif; font-weight: 400; text-transform: uppercase; line-height: .92; letter-spacing: -.01em; margin: 0; position: relative; }
.xl { margin: auto 0 330px; }
.ln { display: block; white-space: nowrap; }
.display em { font-style: normal; color: #ffd633; }
.hollow { color: transparent; -webkit-text-stroke: 3px currentColor; }
.dark .hollow, .photo .hollow { -webkit-text-stroke-color: #f4f1ea; }
.eyebrow { display: inline-flex; align-items: center; gap: 18px; font-family: Anton, sans-serif; text-transform: uppercase; font-size: 30px; letter-spacing: .04em; position: relative; }
.eyebrow::before { content: ""; width: 70px; height: 2px; background: currentColor; opacity: .6; }
.eyebrow i { width: 14px; height: 14px; background: #ffd633; display: inline-block; }
.eyebrow.light i { background: #ffd633; }
.num { font-family: Anton, sans-serif; font-size: 44px; opacity: .6; margin-bottom: 70px; }
.lead { font-size: 36px; line-height: 1.4; margin: 44px 0 0; max-width: 30ch; }
.lead.light { color: rgba(244,241,234,.88); }
.violet .lead.light { color: rgba(255,255,255,.9); }
.lead.wide { max-width: 26ch; }
.list { list-style: none; padding: 0; margin: 44px 0 0; display: grid; gap: 16px; font-size: 32px; font-weight: 600; }
.list li::before { content: "✦  "; }
.sign { position: absolute; left: 80px; bottom: 120px; }
.firma { width: 230px; display: block; }
.pie { position: absolute; left: 80px; right: 80px; bottom: 52px; font-size: 24px; letter-spacing: .02em; font-weight: 500; }
.logo { display: block; filter: drop-shadow(0 10px 24px rgba(0,0,0,.35)); }
.shade { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(11,11,11,0) 25%, rgba(11,11,11,.55) 55%, rgba(11,11,11,.96) 85%); }
.work { position: relative; margin-bottom: 70px; }
.work h1 { margin-top: 26px; }
.tags { display: flex; gap: 12px; margin-top: 34px; }
.tags i { font-style: normal; font-size: 24px; border: 2px solid rgba(244,241,234,.35); border-radius: 999px; padding: 10px 24px; }
.big { font-family: Anton, sans-serif; width: 100%; line-height: .9; margin-top: 340px; letter-spacing: -.01em; }
.stamp { position: relative; display: grid; place-items: center; }
.stamp svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
.stamp b { position: relative; font-family: Anton, sans-serif; font-weight: 400; text-transform: uppercase; line-height: .95; width: 50%; text-align: center; }
.cta { margin-top: 60px; }
.contact { font-family: Anton, sans-serif; font-size: 44px; letter-spacing: .03em; margin: 40px 0 0; position: relative; }
`

const data = JSON.parse(fs.readFileSync(path.join(DIR, "posteos.json"), "utf8"))
fs.mkdirSync(OUT, { recursive: true })
const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {})
const page = await browser.newPage({ viewport: { width: W, height: H } })
for (const p of data.posteos) {
  const tpl = PLANTILLAS[p.plantilla]
  if (!tpl) throw new Error(`Plantilla desconocida: ${p.plantilla} (hay: ${Object.keys(PLANTILLAS).join(", ")})`)
  // se abre como archivo (no setContent) para que Chromium cargue fuente, logo y fotos locales
  const tmp = path.join(OUT, `.${p.archivo}.html`)
  fs.writeFileSync(tmp, `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>${tpl(p, data)}</body></html>`)
  await page.goto(pathToFileURL(tmp).href, { waitUntil: "load" })
  await page.evaluate(() => document.fonts.ready)
  // ajuste: cada [data-fit] arranca en su tamaño máximo y baja hasta que ninguna línea desborde
  await page.evaluate(() => {
    for (const el of document.querySelectorAll("[data-fit]")) {
      let size = Number(el.dataset.fit)
      const lines = [...el.querySelectorAll(".ln")]
      const over = () => lines.some((l) => l.scrollWidth > el.clientWidth + 1)
      el.style.fontSize = `${size}px`
      while (size > 20 && over()) el.style.fontSize = `${(size -= 2)}px`
    }
  })
  await page.screenshot({ path: path.join(OUT, `${p.archivo}.png`), clip: { x: 0, y: 0, width: W, height: H } })
  fs.rmSync(tmp)
  console.log("✓", `${p.archivo}.png`)
}
await browser.close()
