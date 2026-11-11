import { test, after } from "node:test"
import assert from "node:assert/strict"
import { createServer } from "node:http"

/* OpenAI falso: primero pide buscar_vehiculos y actualizar_lead, después contesta con texto. */
const pedidos = []
const falso = createServer(async (req, res) => {
  let cuerpo = ""
  for await (const p of req) cuerpo += p
  const datos = JSON.parse(cuerpo)
  pedidos.push(datos)
  const yaUsoHerramientas = datos.messages.some((m) => m.role === "tool")
  const message = yaUsoHerramientas
    ? { role: "assistant", content: "¡Sí! Tenemos una Toyota Hilux SRV 2020 a USD 34.500. ¿Contado o financiada?" }
    : {
        role: "assistant", content: null,
        tool_calls: [
          { id: "c1", type: "function", function: { name: "buscar_vehiculos", arguments: JSON.stringify({ consulta: "hilux" }) } },
          { id: "c2", type: "function", function: { name: "actualizar_lead", arguments: JSON.stringify({ vehiculo_id: "A104", nombre: "Ana" }) } },
        ],
      }
  res.writeHead(200, { "Content-Type": "application/json" })
  res.end(JSON.stringify({ choices: [{ message }] }))
})
await new Promise((r) => falso.listen(0, r))
after(() => falso.close())

process.env.OPENAI_API_KEY = "sk-prueba"
process.env.OPENAI_BASE_URL = `http://localhost:${falso.address().port}`
delete process.env.ZERNIO_API_KEY

const { atender } = await import("../src/atender.js")
const { conversacion, reiniciar } = await import("../src/store.js")

test("modo IA: ejecuta las herramientas que pide el modelo y devuelve su respuesta", async () => {
  const tel = "test-ia"
  reiniciar(tel)
  const r = await atender({ telefono: tel, texto: "Hola, soy Ana, tenés Hilux?", canal: "simulador" })

  assert.match(r.respuesta, /Hilux/)
  assert.equal(pedidos.length, 2)
  assert.equal(pedidos[0].tools.length, 5)
  assert.equal(pedidos[0].messages[0].role, "system")
  const resultadoBusqueda = JSON.parse(pedidos[1].messages.find((m) => m.tool_call_id === "c1").content)
  assert.equal(resultadoBusqueda[0].id, "A104")
  assert.equal(conversacion(tel).lead.nombre, "Ana")
  reiniciar(tel)
})
