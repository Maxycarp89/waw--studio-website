"use client"

import { useEffect, useRef, useState } from "react"

/*
  Calculadora de lo que cuestan las tareas manuales. Es el imán de contactos:
  el CTA abre WhatsApp con el monto ya escrito.
  El costo por hora por defecto es una referencia; ajustarlo a mano si cambia.
*/

const WHATSAPP_NUMBER = "5493816262536"
const fmt = (n: number) => Math.round(n).toLocaleString("es-AR")

function useCountUp(value: number) {
  const [shown, setShown] = useState(value)
  const from = useRef(value)
  useEffect(() => {
    const start = from.current
    const t0 = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const p = Math.min((now - t0) / 700, 1)
      const v = start + (value - start) * (1 - Math.pow(1 - p, 3))
      setShown(v)
      from.current = v
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value])
  return shown
}

function Slider(props: {
  label: string; value: number; min: number; max: number; step: number
  onChange: (v: number) => void; format: (v: number) => string; hint: string
}) {
  const pct = ((props.value - props.min) / (props.max - props.min)) * 100
  return (
    <label className="calc-field">
      <span className="calc-label">{props.label}<b>{props.format(props.value)}</b></span>
      <input
        type="range" min={props.min} max={props.max} step={props.step} value={props.value}
        onChange={(e) => props.onChange(Number(e.target.value))}
        style={{ ["--pct" as string]: `${pct}%` }}
      />
      <small>{props.hint}</small>
    </label>
  )
}

export function Calculator() {
  const [tasks, setTasks] = useState(120)
  const [minutes, setMinutes] = useState(15)
  const [hourly, setHourly] = useState(8000)

  const hoursMonth = (tasks * minutes) / 60
  const yearly = hoursMonth * hourly * 12
  const shown = useCountUp(yearly)

  const message = `Hola WAW! 👋 Según la calculadora pierdo $${fmt(yearly)} por año en tareas manuales (${Math.round(hoursMonth)} hs por mes). Quiero automatizarlo.`
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`

  return (
    <section className="shell sec" id="calculadora">
      <div className="head" data-reveal>
        <div>
          <span className="eyebrow ru"><i />Calculadora</span>
          <h2 className="display">
            <span className="rm"><span>¿Cuánta plata</span></span>
            <span className="rm"><span className="hollow">se te escapa?</span></span>
          </h2>
        </div>
        <p className="ru">Cargar pedidos, responder lo mismo veinte veces, pasar datos de una planilla a otra. Mové los controles y mirá cuánto te cuesta por año.</p>
      </div>

      <div className="calc">
        <div className="calc-inputs">
          <Slider label="Tareas manuales por mes" value={tasks} min={10} max={600} step={10} onChange={setTasks}
            format={(v) => String(v)} hint={`≈ ${Math.round((tasks / 22) * 10) / 10} por día hábil`} />
          <Slider label="Minutos por tarea" value={minutes} min={5} max={60} step={5} onChange={setMinutes}
            format={(v) => `${v} min`} hint={`${Math.round(hoursMonth)} horas por mes en total`} />
          <Slider label="Costo de una hora de trabajo" value={hourly} min={2000} max={30000} step={500} onChange={setHourly}
            format={(v) => `$${fmt(v)}`} hint="Sueldo + cargas, dividido por horas trabajadas" />
        </div>

        <div className="calc-result">
          <small>Estás perdiendo</small>
          <output className="calc-amount" aria-live="polite">${fmt(shown)}</output>
          <p>por año en tareas que una automatización puede hacer sola.</p>
          <div className="calc-bar"><i style={{ transform: `scaleX(${Math.min(yearly / 15_000_000, 1)})` }} /></div>
          <a className="btn" href={href} target="_blank" rel="noopener noreferrer" data-magnetic>
            Quiero recuperar ${fmt(yearly)}
          </a>
        </div>
      </div>
    </section>
  )
}
