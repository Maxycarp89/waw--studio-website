import { readFileSync } from "node:fs"
import { config } from "./config.js"
import { buscarVehiculos, cargarStock } from "./stock.js"
import { actualizarLead, conversacion, pasarAHumano } from "./store.js"
import { notificarVendedor } from "./canales/index.js"

/*
  Herramientas que la IA puede usar. La IA nunca inventa autos ni precios:
  todo lo que dice del stock sale de buscar_vehiculos / ver_vehiculo.
*/

const vendedores = JSON.parse(readFileSync(new URL("vendedores.json", config.dataDir), "utf8"))
let turno = 0
const siguienteVendedor = () => vendedores[turno++ % vendedores.length]

export const definiciones = [
  {
    type: "function",
    function: {
      name: "buscar_vehiculos",
      description: "Busca unidades disponibles en el stock de la agencia. Usala siempre antes de hablar de un vehículo, precio o disponibilidad.",
      parameters: {
        type: "object",
        properties: {
          consulta: { type: "string", description: "Marca, modelo, color o palabras clave (ej: 'hilux', 'corolla gris')" },
          tipo: { type: "string", enum: ["auto", "camioneta", "suv", "moto"] },
          precio_max: { type: "number", description: "Precio máximo en USD" },
          anio_min: { type: "number", description: "Año mínimo" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "ver_vehiculo",
      description: "Devuelve la ficha completa de una unidad por su id.",
      parameters: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    },
  },
  {
    type: "function",
    function: {
      name: "actualizar_lead",
      description: "Guarda en el CRM lo que vas sabiendo del interesado. Llamala cada vez que el cliente da un dato nuevo.",
      parameters: {
        type: "object",
        properties: {
          nombre: { type: "string" },
          vehiculo_id: { type: "string", description: "Id de la unidad que le interesa" },
          forma_pago: { type: "string", enum: ["contado", "financiado", "a_definir"] },
          permuta: { type: "boolean", description: "Si quiere entregar un vehículo como parte de pago" },
          permuta_detalle: { type: "string", description: "Marca, modelo, año y km del vehículo que entrega" },
          urgencia: { type: "string", enum: ["alta", "media", "baja"], description: "Alta: quiere comprar esta semana" },
          notas: { type: "string" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "agendar_contacto",
      description: "Agenda una llamada o visita del cliente con un vendedor.",
      parameters: {
        type: "object",
        properties: {
          cuando: { type: "string", description: "Día y horario acordado, tal como lo dijo el cliente (ej: 'mañana 9:30')" },
          medio: { type: "string", enum: ["llamada", "visita", "videollamada"] },
        },
        required: ["cuando", "medio"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "derivar_a_vendedor",
      description: "Pasa la conversación a un vendedor humano. Usala cuando el cliente lo pide, quiere cerrar la compra o negociar precio, o pregunta algo que no podés resolver con las herramientas.",
      parameters: { type: "object", properties: { motivo: { type: "string" } }, required: ["motivo"] },
    },
  },
]

export async function ejecutar(nombre, args, { telefono }) {
  const stock = cargarStock()
  switch (nombre) {
    case "buscar_vehiculos": {
      const resultados = buscarVehiculos(stock, args)
      return resultados.length ? resultados : { sin_resultados: true, sugerencia: "Ofrecé alternativas parecidas o preguntá presupuesto y tipo de vehículo." }
    }
    case "ver_vehiculo":
      return stock.find((v) => v.id === args.id) ?? { error: "No existe una unidad con ese id" }
    case "actualizar_lead": {
      const lead = actualizarLead(telefono, args)
      const calificado = lead.vehiculo_id && lead.forma_pago && lead.forma_pago !== "a_definir"
      if (calificado && lead.estado === "nuevo") actualizarLead(telefono, { estado: "calificado" })
      return { ok: true }
    }
    case "agendar_contacto":
      actualizarLead(telefono, { estado: "agendado", agenda: `${args.medio} · ${args.cuando}` })
      return { ok: true, nota: "Confirmale al cliente el día y horario. Un vendedor lo va a contactar." }
    case "derivar_a_vendedor": {
      const vendedor = siguienteVendedor()
      pasarAHumano(telefono, vendedor, args.motivo)
      await notificarVendedor(vendedor, conversacion(telefono))
      return { ok: true, vendedor: vendedor.nombre, nota: "Avisale al cliente que el vendedor sigue la conversación por acá en breve." }
    }
    default:
      return { error: `Herramienta desconocida: ${nombre}` }
  }
}
