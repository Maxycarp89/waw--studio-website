import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { config } from "./config.js"

/*
  Conversaciones y oportunidades (leads). En el prototipo viven en memoria y
  se guardan en data/runtime/*.json; en producción irían a una base de datos.
*/
const dir = new URL("runtime/", config.dataDir)
const archivo = new URL("estado.json", dir)

let estado = { conversaciones: {}, procesados: [] }
if (existsSync(archivo)) {
  try { estado = JSON.parse(readFileSync(archivo, "utf8")) } catch { /* archivo dañado: se arranca de cero */ }
}

let pendiente = null
function guardar() {
  // agrupa escrituras seguidas en una sola
  clearTimeout(pendiente)
  pendiente = setTimeout(() => {
    mkdirSync(dir, { recursive: true })
    writeFileSync(archivo, JSON.stringify(estado, null, 2))
  }, 100)
}

export function conversacion(telefono) {
  estado.conversaciones[telefono] ??= {
    telefono,
    mensajes: [],
    humano: false,
    lead: { estado: "nuevo", creado: new Date().toISOString() },
  }
  return estado.conversaciones[telefono]
}

export function agregarMensaje(telefono, mensaje) {
  conversacion(telefono).mensajes.push({ ...mensaje, fecha: new Date().toISOString() })
  guardar()
}

export function actualizarLead(telefono, cambios) {
  const c = conversacion(telefono)
  c.lead = { ...c.lead, ...Object.fromEntries(Object.entries(cambios).filter(([, v]) => v !== undefined && v !== "")), actualizado: new Date().toISOString() }
  guardar()
  return c.lead
}

export function pasarAHumano(telefono, vendedor, motivo) {
  const c = conversacion(telefono)
  c.humano = true
  c.lead = { ...c.lead, estado: "derivado", vendedor: vendedor.nombre, motivo_derivacion: motivo, actualizado: new Date().toISOString() }
  guardar()
}

/* Evita procesar dos veces el mismo mensaje si el webhook se reintenta. */
export function yaProcesado(idMensaje) {
  if (!idMensaje) return false
  if (estado.procesados.includes(idMensaje)) return true
  estado.procesados = [...estado.procesados.slice(-500), idMensaje]
  guardar()
  return false
}

export const listarConversaciones = () => Object.values(estado.conversaciones)

export function reiniciar(telefono) {
  if (telefono) delete estado.conversaciones[telefono]
  else estado = { conversaciones: {}, procesados: [] }
  guardar()
}
