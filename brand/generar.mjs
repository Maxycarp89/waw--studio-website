import { chromium } from 'playwright'
import fs from 'fs'
const [REPO, OUT] = process.argv.slice(2)
const src = fs.readFileSync(`${REPO}/components/landing/logo-paths.ts`, 'utf8')
const WAW = src.match(/WAW_PATH = "([^"]+)"/)[1]
const STUDIO = src.match(/STUDIO_PATH = "([^"]+)"/)[1]
// mismo estallido que components/landing/hero-art.tsx
const OUTER = [1, 0.84, 0.97, 0.8, 0.94, 0.86, 1, 0.82, 0.95, 0.83, 0.98, 0.85, 0.9]
const INNER = [0.6, 0.66, 0.58, 0.64, 0.6, 0.67, 0.57, 0.65, 0.6, 0.63, 0.58, 0.66, 0.61]
const burst = (cx, cy, r) => {
  const n = OUTER.length, pts = []
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2, b = ((i + 0.5) / n) * Math.PI * 2 - Math.PI / 2
    pts.push(`${(cx + Math.cos(a) * r * OUTER[i]).toFixed(1)},${(cy + Math.sin(a) * r * OUTER[i]).toFixed(1)}`)
    pts.push(`${(cx + Math.cos(b) * r * INNER[i]).toFixed(1)},${(cy + Math.sin(b) * r * INNER[i]).toFixed(1)}`)
  }
  return `M${pts.join('L')}Z`
}
const BURST = burst(300, 300, 270)
const TRI = ['M92 120 L150 150 L104 172Z', 'M478 96 L470 150 L432 118Z', 'M520 420 L452 430 L488 470Z', 'M150 470 L196 446 L182 500Z']
const sticker = `
  <defs>
    <pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="11" cy="11" r="5" fill="#f2b705"/></pattern>
    <clipPath id="clip"><path d="${BURST}"/></clipPath>
  </defs>
  <path d="${BURST}" fill="#5b2ee6" transform="translate(22 26)"/>
  <path d="${BURST}" fill="#ffd633"/>
  <rect width="600" height="600" fill="url(#dots)" clip-path="url(#clip)"/>
  <path d="${BURST}" fill="none" stroke="#0b0b0b" stroke-width="6" stroke-linejoin="round"/>
  ${TRI.map(d => `<path d="${d}" fill="#ff5a4e"/>`).join('')}
  <g transform="rotate(-8 300 300)">
    <path d="${WAW}" transform="translate(8 10)" fill="#0b0b0b"/>
    <path d="${WAW}" fill="#fff" stroke="#0b0b0b" stroke-width="10" paint-order="stroke" stroke-linejoin="round"/>
    <path d="${STUDIO}" fill="#fff" stroke="#0b0b0b" stroke-width="6" paint-order="stroke" stroke-linejoin="round"/>
  </g>`
const svg = (vb, body, bg = '') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}">${bg}${body}</svg>`
// el sticker completo (sombra y acentos incluidos) entra en este recuadro
const TIGHT = '-12 -12 646 646'
// foto de perfil: el sticker entra con aire dentro del recorte circular
const PROFILE = '-58 -56 720 720'
const rect = (vb, fill) => { const [x, y, w, h] = vb.split(' ').map(Number); return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/>` }
// firma plana para esquinas de posteos: solo la palabra, sin estallido
const word = (fill, stroke) => `<g transform="rotate(-8 300 300)"><path d="${WAW}" fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="10" paint-order="stroke" stroke-linejoin="round"` : ''}/></g>`
let WORD_VB = '0 0 600 600'

{
  const bb = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
  const pg = await bb.newPage()
  await pg.setContent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600"><g id="w">${word('#000')}</g></svg>`)
  const r = await pg.$eval('#w', (g) => { const b = g.getBBox(); return [b.x, b.y, b.width, b.height] })
  await bb.close()
  const pad = 8
  WORD_VB = [r[0] - pad, r[1] - pad, r[2] + pad * 2, r[3] + pad * 2].map((v) => v.toFixed(1)).join(' ')
  console.log('firma viewBox', WORD_VB)
}
const files = {
  'waw-logo-sticker.svg': svg(TIGHT, sticker),
  'waw-firma-blanca.svg': svg(WORD_VB, word('#f4f1ea')),
  'waw-firma-negra.svg': svg(WORD_VB, word('#0b0b0b')),
}
fs.mkdirSync(OUT, { recursive: true })
for (const [n, s] of Object.entries(files)) fs.writeFileSync(`${OUT}/${n}`, s)

const renders = [
  ['perfil-waw-oscuro.png', svg(PROFILE, sticker, rect(PROFILE, '#0b0b0b')), 1080, 1080, false],
  ['perfil-waw-violeta.png', svg(PROFILE, sticker, rect(PROFILE, '#7b4dff')), 1080, 1080, false],
  ['waw-logo-sticker.png', files['waw-logo-sticker.svg'], 2048, 2048, true],
  ['waw-logo-sticker-chico.png', files['waw-logo-sticker.svg'], 400, 400, true],
  ['waw-firma-blanca.png', files['waw-firma-blanca.svg'], 1600, Math.round(1600 * WORD_VB.split(' ')[3] / WORD_VB.split(' ')[2]), true],
  ['waw-firma-negra.png', files['waw-firma-negra.svg'], 1600, Math.round(1600 * WORD_VB.split(' ')[3] / WORD_VB.split(' ')[2]), true],
]
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
const p = await b.newPage()
for (const [name, s, w, h, transparent] of renders) {
  await p.setViewportSize({ width: w, height: h })
  await p.setContent(`<html><body style="margin:0;background:transparent">${s.replace('<svg ', `<svg width="${w}" height="${h}" `)}</body></html>`)
  await p.screenshot({ path: `${OUT}/${name}`, omitBackground: transparent, clip: { x: 0, y: 0, width: w, height: h } })
}
await b.close()
console.log(fs.readdirSync(OUT).join('\n'))
