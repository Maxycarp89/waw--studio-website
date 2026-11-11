import { createServer } from "node:http"
import { readFile } from "node:fs/promises"
import { config, modoIA } from "./config.js"
import { atender } from "./atender.js"
import { avisos } from "./canales/index.js"
import { firmaValida, leerWebhook, zernioConfigurado } from "./canales/zernio.js"
import { cargarStock } from "./stock.js"
import { listarConversaciones, reiniciar, yaProcesado } from "./store.js"

const json = (res, status, datos) => {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" })
  res.end(JSON.stringify(datos))
}

async function leerCuerpo(req) {
  const partes = []
  let total = 0
  for await (const p of req) {
    total += p.length
    if (total > 1_000_000) throw new Error("Cuerpo demasiado grande")
    partes.push(p)
  }
  return Buffer.concat(partes).toString("utf8")
}

const servidor = createServer(async (req, res) => {
  const { pathname } = new URL(req.url, "http://localhost")
  try {
    // Webhook de Zernio: responde 200 al instante y procesa en segundo plano
    if (req.method === "POST" && pathname === "/webhooks/zernio") {
      const crudo = await leerCuerpo(req)
      if (!firmaValida(crudo, req.headers)) return json(res, 401, { error: "firma inválida" })
      const msg = leerWebhook(JSON.parse(crudo || "{}"))
      json(res, 200, { ok: true })
      if (msg && !yaProcesado(msg.idMensaje)) {
        atender({ ...msg, canal: "whatsapp" }).catch((e) => console.error("Error atendiendo mensaje:", e))
      }
      return
    }

    // Simulador web
    if (req.method === "GET" && pathname === "/") {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" })
      return res.end(await readFile(new URL("../public/simulador.html", import.meta.url)))
    }
    if (req.method === "POST" && pathname === "/api/simular") {
      const { telefono = "5493810000000", texto = "" } = JSON.parse(await leerCuerpo(req) || "{}")
      if (!texto.trim()) return json(res, 400, { error: "texto vacío" })
      return json(res, 200, await atender({ telefono, texto: texto.slice(0, 2000), canal: "simulador" }))
    }
    if (req.method === "POST" && pathname === "/api/reiniciar") {
      const { telefono } = JSON.parse(await leerCuerpo(req) || "{}")
      reiniciar(telefono)
      return json(res, 200, { ok: true })
    }

    // Panel (CRM mínimo)
    if (req.method === "GET" && pathname === "/api/panel") {
      return json(res, 200, {
        agencia: config.agencia,
        modo: modoIA() ? `IA (${config.openai.model})` : "demo (sin IA)",
        whatsapp: zernioConfigurado() ? "Zernio configurado" : "solo simulador",
        conversaciones: listarConversaciones().map(({ telefono, humano, lead, mensajes }) => ({ telefono, humano, lead, mensajes: mensajes.length })),
        avisos: avisos.slice(-20),
        stock: cargarStock(),
      })
    }
    if (req.method === "GET" && pathname === "/salud") return json(res, 200, { ok: true })

    json(res, 404, { error: "no encontrado" })
  } catch (e) {
    console.error(e)
    if (!res.headersSent) json(res, 500, { error: "error interno" })
  }
})

servidor.listen(config.port, () => {
  console.log(`Bot de ${config.agencia} escuchando en http://localhost:${config.port}`)
  console.log(`Modo: ${modoIA() ? `IA (${config.openai.model})` : "demo, sin IA (falta OPENAI_API_KEY)"}`)
  console.log(`WhatsApp: ${zernioConfigurado() ? "Zernio configurado → webhook en /webhooks/zernio" : "sin Zernio, solo simulador"}`)
})
