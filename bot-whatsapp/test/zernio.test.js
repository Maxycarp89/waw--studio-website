import { test } from "node:test"
import assert from "node:assert/strict"
import { createHmac } from "node:crypto"

process.env.ZERNIO_WEBHOOK_SECRET = "secreto"
const { leerWebhook, firmaValida } = await import("../src/canales/zernio.js")

test("lee el formato de Meta reenviado", () => {
  const cuerpo = { entry: [{ changes: [{ value: { messages: [{ from: "5493815555555", id: "wamid.1", type: "text", text: { body: "Hola" } }] } }] }] }
  assert.deepEqual(leerWebhook(cuerpo), { telefono: "5493815555555", texto: "Hola", idMensaje: "wamid.1" })
})

test("lee un formato plano de evento", () => {
  const r = leerWebhook({ event: "message.received", data: { id: "m1", from: "+54 9 381 555-5555", text: "Hola" } })
  assert.deepEqual(r, { telefono: "+5493815555555", texto: "Hola", idMensaje: "m1" })
})

test("ignora eventos que no son mensajes entrantes", () => {
  assert.equal(leerWebhook({ event: "message.delivered", data: { from: "1", text: "x" } }), null)
  assert.equal(leerWebhook({ event: "message.received", data: { from: "1", direction: "outbound", text: "x" } }), null)
})

test("verifica la firma HMAC", () => {
  const cuerpo = '{"a":1}'
  const firma = createHmac("sha256", "secreto").update(cuerpo).digest("hex")
  assert.equal(firmaValida(cuerpo, { "x-zernio-signature": `sha256=${firma}` }), true)
  assert.equal(firmaValida(cuerpo, { "x-zernio-signature": "mala" }), false)
})
