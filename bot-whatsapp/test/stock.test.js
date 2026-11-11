import { test } from "node:test"
import assert from "node:assert/strict"
import { buscarVehiculos, cargarStock } from "../src/stock.js"

const stock = cargarStock()

test("encuentra por modelo sin importar acentos ni mayúsculas", () => {
  assert.equal(buscarVehiculos(stock, { consulta: "HILUX" })[0].id, "A104")
})

test("no ofrece unidades reservadas", () => {
  assert.ok(buscarVehiculos(stock, { consulta: "ranger" }).every((v) => v.estado === "disponible"))
})

test("filtra por tipo, precio y año", () => {
  const r = buscarVehiculos(stock, { tipo: "auto", precio_max: 17000, anio_min: 2020 })
  assert.deepEqual(r.map((v) => v.id), ["A103"])
})
