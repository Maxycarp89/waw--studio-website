/*
  Datos del sitio que comparten metadata, sitemap, robots y JSON-LD.
  La URL sale de NEXT_PUBLIC_SITE_URL si está definida; si no, del dominio de
  producción que Vercel expone en el build (se actualiza solo al conectar uno).
*/
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000")

export const SITE_NAME = "WAW! Studio"
export const SITE_TITLE = "WAW! Studio | Sistemas y automatización para el negocio automotor"
export const SITE_DESCRIPTION =
  "Software a medida, automatización e IA para agencias de autos usados y concesionarias: CRM, gestión de stock, WhatsApp automatizado, dashboards e integraciones. Menos trabajo manual, más control."
export const CONTACT = { email: "waw.studio.agency@gmail.com", phone: "+54 381 626 2536" }
