import { createHmac, timingSafeEqual } from "node:crypto"
import { config } from "../config.js"

/*
  Adaptador de Zernio (canal de WhatsApp).

  ⚠️ PENDIENTE DE CONFIRMAR con la documentación de Zernio (docs.zernio.com):
  este archivo es el ÚNICO lugar que depende de Zernio. Los nombres exactos del
  endpoint de envío, del cuerpo del webhook y de la firma no se pudieron verificar
  al escribir el prototipo, así que están marcados con "CONFIRMAR".
  El resto del bot (IA, stock, CRM, derivación) no cambia si cambia el proveedor.
*/

export const zernioConfigurado = () => Boolean(config.zernio.apiKey)

/** Envía un texto por WhatsApp. Solo vale dentro de la ventana de 24 h que abre el cliente. */
export async function enviarTexto(telefono, texto) {
  // CONFIRMAR: ruta y forma del cuerpo para enviar un mensaje de WhatsApp.
  const r = await fetch(`${config.zernio.baseUrl}/whatsapp/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${config.zernio.apiKey}` },
    body: JSON.stringify({ accountId: config.zernio.accountId, to: telefono, type: "text", text: { body: texto } }),
  })
  if (!r.ok) throw new Error(`Zernio respondió ${r.status}: ${(await r.text()).slice(0, 300)}`)
}

/**
 * Convierte el cuerpo del webhook en { telefono, texto, idMensaje } o null si no
 * es un mensaje de texto entrante. Acepta varias formas posibles del payload
 * (incluida la de Meta, por si Zernio la reenvía tal cual).
 * CONFIRMAR: nombre del evento y campos reales del payload de Zernio.
 */
export function leerWebhook(cuerpo) {
  const meta = cuerpo?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]
  if (meta) return meta.type === "text" ? { telefono: meta.from, texto: meta.text.body, idMensaje: meta.id } : null

  const d = cuerpo?.data ?? cuerpo?.message ?? cuerpo
  const evento = String(cuerpo?.event ?? cuerpo?.type ?? "")
  // los avisos de entrega, lectura o error no son mensajes del cliente
  if (evento && (!/message|received|inbound/i.test(evento) || /deliver|read|sent|status|fail/i.test(evento))) return null
  if (d?.direction && !/in/i.test(d.direction)) return null

  const telefono = d?.from ?? d?.sender?.phone ?? d?.contact?.phone ?? d?.phone
  const texto = d?.text?.body ?? d?.text ?? d?.body ?? d?.content
  if (!telefono || typeof texto !== "string") return null
  return { telefono: String(telefono).replace(/[^\d+]/g, ""), texto, idMensaje: d?.id ?? d?.messageId ?? cuerpo?.id }
}

/**
 * Verifica la firma del webhook (HMAC-SHA256 del cuerpo crudo con el secreto).
 * CONFIRMAR: nombre del header y formato (hex / base64 / prefijo "sha256=").
 * Sin ZERNIO_WEBHOOK_SECRET no se verifica (solo para pruebas).
 */
export function firmaValida(cuerpoCrudo, headers) {
  if (!config.zernio.webhookSecret) return true
  const recibida = String(headers["x-zernio-signature"] ?? headers["x-signature"] ?? "").replace(/^sha256=/, "")
  const esperada = createHmac("sha256", config.zernio.webhookSecret).update(cuerpoCrudo).digest("hex")
  const a = Buffer.from(recibida)
  const b = Buffer.from(esperada)
  return a.length === b.length && timingSafeEqual(a, b)
}
