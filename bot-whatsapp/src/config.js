// Configuración leída del entorno (.env). Ver .env.example.
const env = process.env

export const config = {
  port: Number(env.PORT ?? 3001),
  agencia: env.AGENCIA_NOMBRE ?? "Autos del Norte",
  openai: {
    apiKey: env.OPENAI_API_KEY ?? "",
    model: env.OPENAI_MODEL ?? "gpt-4.1-mini",
    baseUrl: (env.OPENAI_BASE_URL ?? "https://api.openai.com/v1").replace(/\/$/, ""),
  },
  zernio: {
    apiKey: env.ZERNIO_API_KEY ?? "",
    accountId: env.ZERNIO_ACCOUNT_ID ?? "",
    webhookSecret: env.ZERNIO_WEBHOOK_SECRET ?? "",
    baseUrl: (env.ZERNIO_BASE_URL ?? "https://zernio.com/api/v1").replace(/\/$/, ""),
  },
  dataDir: new URL("../data/", import.meta.url),
}

export const modoIA = () => Boolean(config.openai.apiKey)
