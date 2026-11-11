import { modoIA } from "./config.js"
import { responder } from "./agente.js"
import { responderDemo } from "./agente-demo.js"
import { enviar } from "./canales/index.js"
import { agregarMensaje, conversacion } from "./store.js"

/*
  Punto de entrada de cada mensaje, venga de WhatsApp o del simulador.
  Si la conversación ya está en manos de un vendedor, el bot no contesta.
*/
export async function atender({ telefono, texto, canal }) {
  agregarMensaje(telefono, { rol: "cliente", texto })
  const conv = conversacion(telefono)
  if (conv.humano) return { respuesta: null, derivado: true }

  let respuesta
  try {
    const generar = modoIA() ? responder : responderDemo
    respuesta = await generar({ telefono, historial: conv.mensajes })
  } catch (e) {
    console.error("Error del agente:", e.message)
    respuesta = "Perdón, tuve un problema técnico. Un asesor te responde enseguida 🙏"
  }

  agregarMensaje(telefono, { rol: "bot", texto: respuesta })
  await enviar(canal, telefono, respuesta)
  return { respuesta, derivado: conversacion(telefono).humano }
}
