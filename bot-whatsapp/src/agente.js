import { config } from "./config.js"
import { definiciones, ejecutar } from "./herramientas.js"

/*
  Agente con OpenAI (Chat Completions + herramientas). Recibe el historial de
  la conversación y devuelve el texto a responder. Si la IA pide herramientas,
  se ejecutan y se le devuelve el resultado hasta que conteste con texto.
*/

const MAX_VUELTAS = 6
const HISTORIAL = 20 // últimos mensajes que se le pasan a la IA

export const instrucciones = () => `Sos el asistente de WhatsApp de ${config.agencia}, una agencia de autos usados en Argentina.
Hablás en español rioplatense, cordial y directo. Mensajes cortos, como en WhatsApp: 1 a 3 oraciones, sin listas largas.

Tu objetivo: atender la consulta, mostrar unidades del stock, calificar al interesado y dejarlo listo para un vendedor.

Reglas:
- Nunca inventes vehículos, precios, km ni disponibilidad. Todo dato sale de buscar_vehiculos o ver_vehiculo.
- Si una unidad está reservada o no hay resultados, decilo y ofrecé alternativas del stock.
- Precios en dólares, tal como figuran. Sobre financiación: decí que hay planes y que el vendedor arma la cuota exacta; no inventes tasas ni cuotas.
- Durante la charla averiguá, sin interrogar: nombre, unidad de interés, forma de pago (contado/financiado), si entrega un vehículo en parte de pago (y cuál), y cuándo piensa comprar. Guardá cada dato con actualizar_lead.
- Cuando el cliente quiera avanzar, ofrecé agendar una llamada o visita (agendar_contacto).
- Derivá a un vendedor (derivar_a_vendedor) si lo pide, si quiere negociar o cerrar, o si pregunta algo que no podés resolver.
- No des información legal, de gestoría ni de seguros: derivá.
- Si te preguntan si sos un bot, decí que sos el asistente virtual de la agencia.`

async function llamarOpenAI(mensajes) {
  const r = await fetch(`${config.openai.baseUrl}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${config.openai.apiKey}` },
    body: JSON.stringify({ model: config.openai.model, messages: mensajes, tools: definiciones, temperature: 0.4 }),
  })
  if (!r.ok) throw new Error(`OpenAI respondió ${r.status}: ${(await r.text()).slice(0, 300)}`)
  const datos = await r.json()
  return datos.choices[0].message
}

/** historial: [{ rol: "cliente" | "bot", texto }] */
export async function responder({ telefono, historial }) {
  const mensajes = [
    { role: "system", content: instrucciones() },
    ...historial.slice(-HISTORIAL).map((m) => ({ role: m.rol === "cliente" ? "user" : "assistant", content: m.texto })),
  ]

  for (let i = 0; i < MAX_VUELTAS; i++) {
    const msg = await llamarOpenAI(mensajes)
    mensajes.push(msg)
    if (!msg.tool_calls?.length) return msg.content?.trim() || "Perdón, ¿me repetís la consulta?"

    for (const llamada of msg.tool_calls) {
      let resultado
      try {
        resultado = await ejecutar(llamada.function.name, JSON.parse(llamada.function.arguments || "{}"), { telefono })
      } catch (e) {
        resultado = { error: String(e.message ?? e) }
      }
      mensajes.push({ role: "tool", tool_call_id: llamada.id, content: JSON.stringify(resultado) })
    }
  }
  return "Te paso con un asesor para seguir la consulta 🙌"
}
