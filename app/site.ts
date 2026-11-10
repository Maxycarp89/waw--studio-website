/*
  Datos del sitio que comparten metadata, sitemap, robots y JSON-LD.
  La URL sale de NEXT_PUBLIC_SITE_URL si está definida; si no, del dominio de
  producción que Vercel expone en el build (se actualiza solo al conectar uno).
*/
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000")

export const SITE_NAME = "WAW! Studio"
export const SITE_TITLE = "WAW! Studio | Webs, automatizaciones con IA y sistemas a medida"
export const SITE_DESCRIPTION =
  "Webs, automatizaciones con IA, branding y sistemas a medida. Diseñamos lo que tus clientes ven y construimos lo que tu negocio necesita."
export const CONTACT = { email: "waw.studio.agency@gmail.com", phone: "+54 381 626 2536" }
