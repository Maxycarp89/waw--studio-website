import { fichaCorta, cargarStock } from "../stock.js"
import { enviarTexto, zernioConfigurado } from "./zernio.js"

/*
  Salida de mensajes. "simulador" = el chat web de prueba; "whatsapp" = Zernio.
  El aviso al vendedor se registra siempre en el panel; además se le manda
  por WhatsApp si tiene teléfono cargado y Zernio está configurado.
*/
export const avisos = []

export async function enviar(canal, telefono, texto) {
  if (canal !== "whatsapp") return
  if (!zernioConfigurado()) return console.warn(`[sin Zernio] no se envió a ${telefono}: ${texto}`)
  await enviarTexto(telefono, texto)
}

export async function notificarVendedor(vendedor, conv) {
  const l = conv.lead
  const v = l.vehiculo_id && cargarStock().find((x) => x.id === l.vehiculo_id)
  const texto = [
    `🔔 Nueva oportunidad para ${vendedor.nombre}`,
    `Cliente: ${l.nombre ?? "sin nombre"} · ${conv.telefono}`,
    v ? `Unidad: ${fichaCorta(v)}` : null,
    l.forma_pago ? `Pago: ${l.forma_pago}` : null,
    l.permuta ? `Permuta: ${l.permuta_detalle ?? "sí"}` : null,
    l.agenda ? `Agenda: ${l.agenda}` : null,
    l.motivo_derivacion ? `Motivo: ${l.motivo_derivacion}` : null,
  ].filter(Boolean).join("\n")

  avisos.push({ fecha: new Date().toISOString(), vendedor: vendedor.nombre, texto })
  console.log(`\n${texto}\n`)
  // Ojo: si el vendedor no le escribió al número en las últimas 24 h, Meta exige
  // una plantilla aprobada. En producción esto va con plantilla de "utilidad".
  if (vendedor.telefono && zernioConfigurado()) {
    await enviarTexto(vendedor.telefono, texto).catch((e) => console.error("No se pudo avisar al vendedor:", e.message))
  }
}
