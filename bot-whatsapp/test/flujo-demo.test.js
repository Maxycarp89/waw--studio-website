import { test } from "node:test"
import assert from "node:assert/strict"

delete process.env.OPENAI_API_KEY
delete process.env.ZERNIO_API_KEY
const { atender } = await import("../src/atender.js")
const { conversacion, reiniciar } = await import("../src/store.js")
const { avisos } = await import("../src/canales/index.js")

test("modo demo: consulta → calificación → agenda → derivación, y después el bot se calla", async () => {
  const tel = "test-demo"
  reiniciar(tel)
  const hablar = (texto) => atender({ telefono: tel, texto, canal: "simulador" })

  assert.match((await hablar("Hola! tenés alguna Hilux?")).respuesta, /Hilux/)
  assert.equal(conversacion(tel).lead.vehiculo_id, "A104")

  await hablar("Se puede financiar? Soy Lucas")
  await hablar("Tengo un Gol 2015 para entregar")
  const lead = conversacion(tel).lead
  assert.equal(lead.nombre, "Lucas")
  assert.equal(lead.forma_pago, "financiado")
  assert.equal(lead.permuta, true)

  const r = await hablar("Me llaman mañana 9:30?")
  assert.match(r.respuesta, /9:30/)
  assert.equal(r.derivado, true)
  assert.equal(conversacion(tel).lead.estado, "derivado")
  assert.match(avisos.at(-1).texto, /Lucas/)

  const despues = await hablar("Hola? sigue ahí?")
  assert.equal(despues.respuesta, null)
  reiniciar(tel)
})
