import { config } from "./config.js"
import { ejecutar } from "./herramientas.js"
import { buscarVehiculos, cargarStock, fichaCorta } from "./stock.js"
import { conversacion } from "./store.js"

/*
  Modo demo: reglas simples, SIN inteligencia artificial. Sirve para mostrar el
  flujo (stock → calificación → CRM → derivación) cuando no hay OPENAI_API_KEY.
  No entiende frases complejas: es solo para presentar el recorrido.
*/
const n = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()

export async function responderDemo({ telefono, historial }) {
  const texto = n(historial.at(-1)?.texto ?? "")
  const { lead } = conversacion(telefono)
  const ctx = { telefono }

  if (/vendedor|asesor|persona|humano/.test(texto)) {
    const r = await ejecutar("derivar_a_vendedor", { motivo: "El cliente pidió hablar con una persona" }, ctx)
    return `¡Listo! Te paso con ${r.vendedor}, que sigue la conversación por acá en un ratito.`
  }

  const nombre = texto.match(/(?:soy|me llamo)\s+([a-zñ]+)/)?.[1]
  if (nombre) await ejecutar("actualizar_lead", { nombre: nombre[0].toUpperCase() + nombre.slice(1) }, ctx)

  if (/permuta|entregar|entrego|parte de pago|usado mio|mi auto/.test(texto)) {
    await ejecutar("actualizar_lead", { permuta: true, permuta_detalle: historial.at(-1).texto }, ctx)
  }
  if (/contado|efectivo/.test(texto)) await ejecutar("actualizar_lead", { forma_pago: "contado" }, ctx)
  if (/cuota|financ|credito/.test(texto)) await ejecutar("actualizar_lead", { forma_pago: "financiado" }, ctx)

  const hora = texto.match(/(manana|hoy|lunes|martes|miercoles|jueves|viernes|sabado)[^.?!]*?(\d{1,2}(?::\d{2})?)/)
  if (hora && lead.vehiculo_id) {
    const dia = hora[1].replace("manana", "mañana").replace("miercoles", "miércoles").replace("sabado", "sábado")
    await ejecutar("agendar_contacto", { cuando: `${dia} ${hora[2]}`, medio: "llamada" }, ctx)
    await ejecutar("derivar_a_vendedor", { motivo: "Llamada agendada" }, ctx)
    return `Perfecto${lead.nombre ? `, ${lead.nombre}` : ""} ✅ Te llama un asesor ${dia} a las ${hora[2]}.`
  }

  const stock = cargarStock()
  const tipo = ["camioneta", "moto", "suv"].find((t) => texto.includes(t))
  const resultados = buscarVehiculos(stock, { consulta: texto.replace(/\b(hola|tenes|tienen|busco|quiero|una|un|la|el|de|en|que|hay)\b/g, " "), tipo })

  if (resultados.length && !/cuota|financ|permuta|entreg|contado/.test(texto)) {
    const v = resultados[0]
    await ejecutar("actualizar_lead", { vehiculo_id: v.id }, ctx)
    const mas = resultados.length > 1 ? ` También tengo ${resultados.length - 1} opción${resultados.length > 2 ? "es" : ""} más parecida${resultados.length > 2 ? "s" : ""}.` : ""
    return `¡Sí! Tenemos ${fichaCorta(v)}.${mas} ¿La pensás pagar de contado o financiada?`
  }

  if (/cuota|financ|contado/.test(texto)) {
    return "Tenemos planes de financiación y el asesor te arma la cuota exacta. ¿Entregás algún vehículo en parte de pago?"
  }
  if (/permuta|entreg|parte de pago/.test(texto)) {
    return "¡Genial, tomamos tu vehículo! ¿Querés que te llame un asesor? Decime día y horario (ej: mañana 9:30)."
  }
  return `¡Hola! 👋 Soy el asistente de ${config.agencia}. ¿Qué vehículo estás buscando? Contame marca, modelo o presupuesto.`
}
