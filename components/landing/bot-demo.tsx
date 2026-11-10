import Image from "next/image"

/*
  Demo de un bot de WhatsApp que avanza con el scroll. Cada mensaje tiene
  su umbral (data-at, de 0 a 1 sobre el recorrido de la sección) y la capa
  de movimiento los va encendiendo. Es ilustrativa: lo aclara el pie.
*/

const FEATURES = [
  { from: 0, title: "Recibe cada consulta", text: "Contesta a cualquier hora y registra al interesado." },
  { from: 0.3, title: "Identifica el vehículo", text: "Reconoce la unidad consultada y manda ficha, fotos y financiación." },
  { from: 0.55, title: "Califica al comprador", text: "Detecta forma de pago y permuta, y agenda el contacto." },
  { from: 0.84, title: "Deriva al vendedor", text: "La oportunidad entra al CRM asignada y con seguimiento automático." },
]

type Msg =
  | { at: number; from: "user" | "bot"; text: string; time: string }
  | { at: number; from: "card" }
  | { at: number; from: "system"; text: string }

const CHAT: Msg[] = [
  { at: 0.04, from: "user", text: "Hola! La moto negra de la foto está disponible? 🏍️", time: "23:47" },
  { at: 0.18, from: "bot", text: "¡Hola! 👋 Sí, está disponible. Es una naked 2023 con 12.000 km.", time: "23:47" },
  { at: 0.32, from: "card" },
  { at: 0.44, from: "user", text: "Se puede en cuotas? Tengo un auto para entregar", time: "23:48" },
  { at: 0.57, from: "bot", text: "¡Claro! Tomamos tu auto y hay planes en cuotas. ¿Te llamamos mañana a las 9:30?", time: "23:48" },
  { at: 0.67, from: "user", text: "Sí, perfecto. Soy Lucas", time: "23:49" },
  { at: 0.79, from: "bot", text: "Listo, Lucas ✅ Un asesor te llama mañana a las 9:30.", time: "23:49" },
  { at: 0.88, from: "system", text: "Oportunidad: Lucas · Naked 2023 · cuotas + permuta → CRM, asignada a vendedor" },
]

export function BotDemo({ whatsapp }: { whatsapp: string }) {
  return (
    <section className="chat-pin" id="automatizacion" data-chat>
      <div className="chat-stage shell">
        <div className="scroll-hint" data-hint="chat" aria-hidden="true"><span className="scroll-hint__icon"><i /></span>Seguí deslizando</div>
        <div className="chat-copy">
          <span className="eyebrow"><i />Automatización en vivo</span>
          <h2 className="display">Son las 23:47.<br /><span className="hollow">Tu agencia responde.</span></h2>
          <ul className="feats">
            {FEATURES.map((f, i) => (
              <li key={f.title} data-feat={f.from}>
                <b>0{i + 1}</b>
                <div><h3>{f.title}</h3><p>{f.text}</p></div>
              </li>
            ))}
          </ul>
          <a className="btn" href={whatsapp} target="_blank" rel="noopener noreferrer" data-magnetic data-track="bot">Automatizar mis consultas</a>
        </div>

        <div className="phone" aria-label="Demo de conversación con un bot de WhatsApp">
          <div className="phone-head">
            <span className="phone-avatar">A</span>
            <div><b>Agencia de autos</b><small>en línea · responde con IA</small></div>
          </div>
          <div className="phone-body">
            {CHAT.map((m, i) => {
              if (m.from === "card") {
                return (
                  <div key={i} className="msg msg--bot msg--card" data-at={m.at} data-bot>
                    <Image src="/work/amartin-moto.webp" alt="Moto naked negra" width={480} height={360} />
                    <div><b>Naked 2023 · 12.000 km</b><small>Financiación en cuotas semanales</small></div>
                    <span className="msg-btn">Ver ficha</span>
                  </div>
                )
              }
              if (m.from === "system") {
                return <div key={i} className="msg msg--system" data-at={m.at}>{m.text}</div>
              }
              return (
                <div key={i} className={`msg msg--${m.from}`} data-at={m.at} {...(m.from === "bot" ? { "data-bot": "" } : {})}>
                  {m.text}<time>{m.time}</time>
                </div>
              )
            })}
            <div className="msg msg--bot typing" data-typing aria-hidden="true"><i /><i /><i /></div>
          </div>
          <p className="phone-note">Demo ilustrativa del tipo de automatización que armamos</p>
        </div>
      </div>
    </section>
  )
}
