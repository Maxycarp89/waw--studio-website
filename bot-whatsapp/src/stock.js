import { readFileSync } from "node:fs"
import { config } from "./config.js"

/*
  Stock de la agencia. En el prototipo es un JSON; en producción se reemplaza
  por una consulta al sistema de la agencia (CRM propio, planilla, etc.).
*/
const sinAcentos = (s) => String(s ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()

export function cargarStock() {
  return JSON.parse(readFileSync(new URL("stock.json", config.dataDir), "utf8"))
}

export function buscarVehiculos(stock, { consulta = "", tipo, precio_max, anio_min, incluir_reservados = false } = {}) {
  const palabras = sinAcentos(consulta).replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter((p) => p.length > 1)
  return stock
    .filter((v) => incluir_reservados || v.estado === "disponible")
    .filter((v) => !tipo || sinAcentos(v.tipo) === sinAcentos(tipo))
    .filter((v) => !precio_max || v.precio_usd <= precio_max)
    .filter((v) => !anio_min || v.anio >= anio_min)
    .map((v) => {
      const texto = sinAcentos(`${v.marca} ${v.modelo} ${v.tipo} ${v.color} ${v.anio} ${v.combustible}`)
      const puntaje = palabras.filter((p) => texto.includes(p)).length
      return { v, puntaje }
    })
    .filter(({ puntaje }) => palabras.length === 0 || puntaje > 0)
    .sort((a, b) => b.puntaje - a.puntaje || a.v.precio_usd - b.v.precio_usd)
    .slice(0, 5)
    .map(({ v }) => v)
}

export const fichaCorta = (v) =>
  `${v.marca} ${v.modelo} ${v.anio} · ${v.km.toLocaleString("es-AR")} km · USD ${v.precio_usd.toLocaleString("es-AR")}`
