# Bot de WhatsApp con IA para agencias de autos (prototipo)

Prototipo de WAW! Studio. Atiende consultas por WhatsApp, muestra unidades del stock, califica al interesado (pago, permuta, urgencia), lo carga en un CRM mínimo, agenda una llamada y deriva al vendedor. Desde ese momento el bot deja de responder en esa conversación.

## Probarlo en 1 minuto

Requiere Node.js 22 o superior. No tiene dependencias externas.

```bash
cd bot-whatsapp
npm start
```

Abrí <http://localhost:3001>: a la izquierda hay un chat tipo WhatsApp y a la derecha se ve en vivo la oportunidad en el CRM, los avisos al vendedor y el stock.

- **Sin `OPENAI_API_KEY`** corre en **modo demo**: reglas simples, sin IA. Sirve para mostrar el recorrido completo, pero solo entiende frases parecidas a los botones de ejemplo.
- **Con `OPENAI_API_KEY`** (copiá `.env.example` a `.env`) responde con IA de verdad, usando el stock y las herramientas.

```bash
npm test
```

## Cómo funciona

```
Cliente escribe por WhatsApp
        ↓
Meta (API oficial) → Zernio → POST /webhooks/zernio
        ↓
atender(): guarda el mensaje; si la conversación ya es de un vendedor, no contesta
        ↓
Agente (OpenAI) con herramientas:
  buscar_vehiculos · ver_vehiculo · actualizar_lead · agendar_contacto · derivar_a_vendedor
        ↓
Respuesta → Zernio → WhatsApp del cliente
Derivación → aviso al vendedor (panel + WhatsApp si tiene teléfono cargado)
```

| Archivo | Qué hace |
| --- | --- |
| `src/server.js` | Servidor HTTP: webhook, simulador y panel |
| `src/atender.js` | Flujo de cada mensaje entrante |
| `src/agente.js` | Agente con OpenAI y reglas del asistente (tono, qué no inventar, cuándo derivar) |
| `src/agente-demo.js` | Modo demo sin IA |
| `src/herramientas.js` | Herramientas que usa la IA: stock, CRM, agenda, derivación |
| `src/canales/zernio.js` | **Único archivo que depende de Zernio** |
| `src/stock.js`, `data/stock.json` | Stock de ejemplo y búsqueda |
| `src/store.js` | Conversaciones y leads (JSON en `data/runtime/`) |
| `data/vendedores.json` | Vendedores; la derivación los asigna por turno |

## Conectarlo a WhatsApp con Zernio

1. Verificar la empresa de la agencia en Meta Business.
2. En Zernio, conectar el número de WhatsApp de la agencia y crear una API key.
3. Completar `ZERNIO_API_KEY`, `ZERNIO_ACCOUNT_ID` y `ZERNIO_WEBHOOK_SECRET` en `.env`.
4. Publicar el servidor con una URL pública (Railway, Render, un VPS…) y registrar en Zernio el webhook `https://<tu-servidor>/webhooks/zernio`.

### ⚠️ Pendiente de confirmar con la documentación de Zernio

Cuando se escribió el prototipo no se pudo acceder a `docs.zernio.com`. En `src/canales/zernio.js` están marcados con `CONFIRMAR`:

- la ruta y el cuerpo para **enviar** un mensaje (hoy: `POST /whatsapp/messages`);
- el formato del **webhook** entrante (el lector ya acepta el formato de Meta y uno plano de tipo evento);
- el header y el formato de la **firma** del webhook (hoy: HMAC-SHA256 en `x-zernio-signature`).

Es un archivo chico: ajustarlo lleva minutos una vez que se tiene la documentación.

## Antes de usarlo con clientes reales

- **Base de datos:** reemplazar los JSON por una base de datos (por ejemplo Supabase o Postgres).
- **Stock real:** conectar `cargarStock()` al sistema o la planilla de la agencia.
- **Plantillas de Meta:** fuera de la ventana de 24 h solo se pueden mandar plantillas aprobadas. Hacen falta para los seguimientos y para avisar al vendedor.
- **Panel de vendedores:** para responder desde ahí y devolverle la conversación al bot.
- **Seguridad:** el simulador y `/api/panel` no tienen login. No exponerlos públicamente tal como están.
