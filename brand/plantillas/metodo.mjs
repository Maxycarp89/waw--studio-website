/*
  Carrusel "Cómo trabajamos" (método WAW!): versión editorial y sobria de la
  marca. Mucho aire, grilla asimétrica, metadatos en versalitas espaciadas,
  filetes finos, numerales gigantes en contorno y grano de película.
  Se renderiza como una sola tira (8 × 1080 por 1350) y se corta en slides:
  el filete de arriba y la línea de progreso de abajo corren continuos y en
  cada slide se ilumina la fase actual.

  Uso, desde la raíz del repo:
    node brand/plantillas/metodo.mjs
  Contenido: brand/plantillas/metodo.json
  Salida: brand/plantillas/carruseles/carrusel-metodo/01.png … 08.png
*/

import { chromium } from "playwright"
import fs from "fs"
import path from "path"
import { pathToFileURL } from "url"

const ROOT = process.cwd()
const DIR = path.join(ROOT, "brand/plantillas")
const S = 1080
const H = 1350
const P = 88 // margen
const url = (p) => pathToFileURL(path.join(ROOT, p)).href

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
const nn = (n) => String(n).padStart(2, "0")

const d = JSON.parse(fs.readFileSync(path.join(DIR, "metodo.json"), "utf8"))
const fases = d.fases
const N = fases.length + 2
const W = N * S

// slide i ocupa [i*S, (i+1)*S)
const slide = (i, body, cls = "") => `<section class="sl ${cls}" style="left:${i * S}px">${body}</section>`

const meta = (left, right) => `<div class="meta"><span>${esc(left)}</span><span>${esc(right)}</span></div>`

// línea de progreso: tramo de esta slide en amarillo, el resto queda en el filete continuo
const progress = (i, label, next) => `
  <div class="prog"><i style="width:${((i / (N - 1)) * 100).toFixed(2)}%"></i>${Array.from({ length: N }, (_, k) =>
    `<b class="${k <= i ? "on" : ""}" style="left:${((k / (N - 1)) * 100).toFixed(2)}%"></b>`).join("")}</div>
  <div class="prog-lbl"><span>${esc(label)}</span><span>${next ? "Deslizá&nbsp;&nbsp;→" : ""}</span></div>`

const portada = slide(
  0,
  `${meta("WAW! Studio — Método", `${nn(fases.length)} fases`)}
  <div class="glow" style="left:380px;top:120px"></div>
  <span class="kicker"><i></i>${esc(d.portada.etiqueta)}</span>
  <h1 class="display" data-fit="290" style="top:330px">${rich(d.portada.titulo)}</h1>
  <p class="lede" style="top:770px">${esc(d.portada.bajada)}</p>
  <ol class="index">${fases
    .map((f, i) => `<li><b>${nn(i + 1)}</b><span>${esc(f.nombre)}</span><small>${esc(f.cuando)}</small></li>`)
    .join("")}</ol>
  ${progress(0, "Índice", true)}`,
  "cover",
)

const pasos = fases
  .map((f, k) =>
    slide(
      k + 1,
      `${meta("WAW! Studio — Método", `Fase ${nn(k + 1)} / ${nn(fases.length)}`)}
      <div class="glow"></div>
      <span class="numeral">${nn(k + 1)}</span>
      <span class="kicker"><i></i>${esc(f.cuando)}</span>
      <h2 class="display" data-fit="168" data-group="fase" style="top:500px">${rich(f.nombre)}</h2>
      <p class="lede" style="top:690px">${esc(f.bajada)}</p>
      <div class="detail">
        <div>
          <h4>Qué hacemos</h4>
          <ul>${f.hacemos.map((h, j) => `<li><b>${String.fromCharCode(97 + j)}</b>${esc(h)}</li>`).join("")}</ul>
        </div>
        <div>
          <h4>Entregable</h4>
          <p class="deliver">${esc(f.entregable)}</p>
          <h4 style="margin-top:34px">Tu parte</h4>
          <p class="yours">${esc(f.tu_parte)}</p>
        </div>
      </div>
      ${progress(k + 1, `${nn(k + 1)} — ${f.nombre}`, true)}`,
    ),
  )
  .join("")

const cierre = slide(
  N - 1,
  `${meta("WAW! Studio — Método", "Contacto")}
  <div class="glow" style="left:120px;top:260px"></div>
  <span class="kicker"><i></i>Siguiente paso</span>
  <h2 class="display" data-fit="150" style="top:470px">${rich(d.cierre.titulo)}</h2>
  <p class="action" style="top:800px">${esc(d.cierre.accion)}<span>→</span></p>
  <dl class="contact">
    <div><dt>WhatsApp</dt><dd>${esc(d.cierre.contacto)}</dd></div>
    <div><dt>Mail</dt><dd>${esc(d.cierre.mail)}</dd></div>
  </dl>
  <img class="sticker" src="${url("brand/waw-logo-sticker.svg")}" alt="">
  ${progress(N - 1, "Fin del recorrido", false)}`,
)

// grano de película (SVG fractal noise)
const GRAIN = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>`,
).replace(/%2523/g, "%23")}")`

const CSS = `
@font-face { font-family: Anton; src: url('${url("app/_og/Anton-Regular.ttf")}'); }
* { box-sizing: border-box; }
html, body { margin: 0; }
.stage { position: relative; width: ${W}px; height: ${H}px; overflow: hidden; background: #0a0a0a; color: #f4f1ea;
  font-family: Inter, "Helvetica Neue", Arial, sans-serif; font-feature-settings: "tnum" 1, "ss01" 1; }
.stage::after { content: ""; position: absolute; inset: 0; background-image: ${GRAIN}; opacity: .07; mix-blend-mode: overlay; pointer-events: none; }
/* filete superior continuo, cruza todas las slides */
.rule { position: absolute; left: ${P}px; right: ${P}px; top: 128px; height: 1px; background: rgba(244,241,234,.16); }
.sl { position: absolute; top: 0; width: ${S}px; height: ${H}px; }
.glow { position: absolute; left: 300px; top: 40px; width: 900px; height: 900px; border-radius: 50%;
  background: radial-gradient(circle, rgba(255,214,51,.075), rgba(255,214,51,0) 62%); pointer-events: none; }
.meta { position: absolute; left: ${P}px; right: ${P}px; top: 78px; display: flex; justify-content: space-between;
  font-size: 17px; font-weight: 600; letter-spacing: .24em; text-transform: uppercase; color: rgba(244,241,234,.5); }
.kicker { position: absolute; left: ${P}px; top: 440px; display: flex; align-items: center; gap: 16px;
  font-size: 19px; font-weight: 600; letter-spacing: .24em; text-transform: uppercase; color: #ffd633; }
.kicker i { width: 10px; height: 10px; background: #ffd633; }
.cover .kicker { top: 270px; }
.display { position: absolute; left: ${P}px; width: ${S - P * 2}px; margin: 0; font-family: Anton, Impact, sans-serif;
  font-weight: 400; text-transform: uppercase; line-height: .9; letter-spacing: -.012em; }
.ln { display: block; white-space: nowrap; }
.display em { font-style: normal; color: #ffd633; }
.hollow { color: transparent; -webkit-text-stroke: 2px #f4f1ea; }
.lede { position: absolute; left: ${P}px; width: 760px; margin: 0; font-size: 36px; line-height: 1.38; font-weight: 400;
  color: rgba(244,241,234,.78); letter-spacing: -.01em; text-wrap: pretty; }
.numeral { position: absolute; right: 20px; top: 70px; font-family: Anton, sans-serif; font-size: 760px; line-height: .8;
  color: transparent; -webkit-text-stroke: 1.5px rgba(244,241,234,.13); letter-spacing: -.03em; }
.detail { position: absolute; left: ${P}px; right: ${P}px; top: 905px; padding-top: 34px; border-top: 1px solid rgba(244,241,234,.16);
  display: grid; grid-template-columns: 1.25fr 1fr; gap: 56px; }
.detail h4 { margin: 0 0 18px; font-size: 16px; font-weight: 600; letter-spacing: .24em; text-transform: uppercase; color: rgba(244,241,234,.45); }
.detail ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 14px; }
.detail li { text-wrap: pretty; display: grid; grid-template-columns: 34px 1fr; font-size: 25px; line-height: 1.3; color: rgba(244,241,234,.88); }
.detail li b { font-weight: 600; color: #ffd633; font-size: 21px; padding-top: 2px; }
.deliver { text-wrap: balance; margin: 0; font-family: Anton, sans-serif; font-size: 36px; line-height: 1.05; text-transform: uppercase; letter-spacing: .005em; }
.yours { margin: 0; font-size: 25px; color: rgba(244,241,234,.88); }
/* progreso: filete continuo + tramo amarillo de la slide */
.base { position: absolute; left: ${P}px; right: ${P}px; top: 1232px; height: 1px; background: rgba(244,241,234,.16); }
.prog { position: absolute; left: ${P}px; right: ${P}px; top: 1231px; height: 3px; }
.prog i { position: absolute; left: 0; top: 0; bottom: 0; background: #ffd633; }
.prog b { position: absolute; top: -4px; width: 11px; height: 11px; margin-left: -5px; border-radius: 50%; background: #0a0a0a; border: 1.5px solid rgba(244,241,234,.35); }
.prog b.on { background: #ffd633; border-color: #ffd633; }
.prog-lbl { position: absolute; left: ${P}px; right: ${P}px; top: 1258px; display: flex; justify-content: space-between;
  font-size: 16px; font-weight: 600; letter-spacing: .22em; text-transform: uppercase; color: rgba(244,241,234,.5); }
.index { position: absolute; left: ${P}px; right: ${P}px; top: 960px; margin: 0; padding: 0; list-style: none;
  display: grid; grid-template-columns: 1fr 1fr; column-gap: 56px; }
.index li { display: grid; grid-template-columns: 52px 1fr auto; align-items: baseline; padding: 15px 0;
  border-top: 1px solid rgba(244,241,234,.14); font-size: 24px; }
.index b { color: #ffd633; font-weight: 600; font-size: 19px; letter-spacing: .08em; }
.index small { font-size: 15px; font-weight: 600; letter-spacing: .18em; text-transform: uppercase; color: rgba(244,241,234,.45); }
.action { position: absolute; left: ${P}px; margin: 0; font-family: Anton, sans-serif; font-size: 92px; line-height: 1; text-transform: uppercase;
  padding-bottom: 14px; border-bottom: 4px solid #ffd633; display: flex; gap: 28px; align-items: baseline; }
.action span { color: #ffd633; font-family: Inter, sans-serif; font-weight: 300; font-size: 80px; }
.contact { position: absolute; left: ${P}px; top: 990px; margin: 0; display: grid; gap: 22px; }
.contact div { display: grid; grid-template-columns: 170px 1fr; align-items: baseline; }
.contact dt { font-size: 16px; font-weight: 600; letter-spacing: .24em; text-transform: uppercase; color: rgba(244,241,234,.45); }
.contact dd { margin: 0; font-size: 30px; }
.sticker { position: absolute; right: 70px; top: 880px; width: 270px; rotate: 9deg; filter: drop-shadow(0 18px 36px rgba(0,0,0,.5)); }
`

const html = `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>
<div class="stage"><div class="rule"></div><div class="base"></div>${portada}${pasos}${cierre}</div></body></html>`

const out = path.join(DIR, "carruseles", d.archivo)
fs.rmSync(out, { recursive: true, force: true })
fs.mkdirSync(out, { recursive: true })
const tmp = path.join(out, ".tmp.html")
fs.writeFileSync(tmp, html)
const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {})
const page = await browser.newPage({ viewport: { width: W, height: H } })
await page.goto(pathToFileURL(tmp).href, { waitUntil: "load" })
await page.evaluate(() => document.fonts.ready)
await page.evaluate(() => {
  for (const el of document.querySelectorAll("[data-fit]")) {
    let size = Number(el.dataset.fit)
    const lines = [...el.querySelectorAll(".ln")]
    const tooWide = () => lines.some((l) => l.scrollWidth > el.clientWidth + 1)
    el.style.fontSize = `${size}px`
    while (size > 20 && tooWide()) el.style.fontSize = `${(size -= 2)}px`
  }
  const group = [...document.querySelectorAll('[data-group="fase"]')]
  const min = Math.min(...group.map((el) => parseFloat(el.style.fontSize)))
  group.forEach((el) => (el.style.fontSize = `${min}px`))
})
await page.screenshot({ path: path.join(DIR, "carruseles", `${d.archivo}-completo.png`), clip: { x: 0, y: 0, width: W, height: H } })
for (let i = 0; i < N; i++) {
  await page.screenshot({ path: path.join(out, `${nn(i + 1)}.png`), clip: { x: i * S, y: 0, width: S, height: H } })
}
fs.rmSync(tmp)
await browser.close()
console.log(`✓ ${d.archivo}: ${N} slides`)
