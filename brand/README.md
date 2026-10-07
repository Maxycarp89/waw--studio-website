# Logo WAW! para redes

Generado desde los mismos trazados del sitio (`components/landing/logo-paths.ts`
y el estallido de `hero-art.tsx`): es el logo exacto de la web, en vector.

## Foto de perfil (Instagram, Facebook, LinkedIn, WhatsApp)

| Archivo | Uso |
|---|---|
| `perfil-waw-oscuro.png` | Principal. 1080×1080, fondo negro de la marca. |
| `perfil-waw-violeta.png` | Alternativa sobre violeta. |

El logo entra completo dentro del recorte circular que aplican las redes.

## Para las publicaciones de Instagram

| Archivo | Cuándo usarlo |
|---|---|
| `waw-logo-sticker.png` | Sticker completo con fondo transparente (2048 px). Va sobre cualquier fondo: tiene contorno negro. |
| `waw-logo-sticker-chico.png` | El mismo en 400 px, para pegarlo en una esquina del posteo. |
| `waw-firma-blanca.png` | Solo la palabra WAW!, para fotos o fondos oscuros. |
| `waw-firma-negra.png` | Solo la palabra WAW!, para fondos claros o amarillos. |
| `*.svg` | Versiones vectoriales de los mismos (Figma, Illustrator, Canva Pro). |

Sugerencia: en cada posteo, el sticker chico o la firma en una esquina, siempre
la misma (por ejemplo abajo a la derecha), a un 12–15 % del ancho del posteo.

## Regenerar

Si cambia el logo en el sitio, se regeneran todos con Playwright instalado:

```bash
node brand/generar.mjs . brand
```

## Plantillas de posteo (1080×1350)

En `plantillas/`. El contenido se edita en `plantillas/posteos.json` y se generan
los PNG listos para subir en `plantillas/ejemplos/`:

```bash
npm i -D playwright && npx playwright install chromium   # una sola vez
node brand/plantillas/generar.mjs
```

| Plantilla | Para qué | Campos |
|---|---|---|
| `frase` | Frases, ideas, manifiesto (fondo negro) | `etiqueta`, `texto` |
| `servicio` | Presentar un servicio (fondo amarillo) | `numero`, `titulo`, `texto`, `puntos` |
| `trabajo` | Mostrar un proyecto con foto a sangre | `foto`, `cliente`, `texto`, `etiquetas` |
| `dato` | Un número que impacta (fondo violeta) | `etiqueta`, `numero`, `texto`, `reaccion` |
| `contacto` | Cierre / llamado a escribir | `titulo`, `boton`, `contacto` |

En los textos: `*palabra*` la pinta de amarillo y una línea que empieza con `~`
sale hueca (solo contorno), como en la web. Los títulos se achican solos si una
línea no entra. `pie` (arriba del todo en el JSON) es el texto chico de abajo:
cambialo por el usuario de Instagram cuando lo tengan.

## Carruseles panorámicos (estilo SCRL)

En `plantillas/panoramico.mjs`. Cada carrusel se diseña como una sola imagen
ancha (N × 1080 por 1350) y se corta en slides exactas: lo que cruza un corte
(el sticker, la cinta, las fotos) continúa al deslizar, sin saltos.

```bash
node brand/plantillas/panoramico.mjs            # todos
node brand/plantillas/panoramico.mjs trabajos   # uno solo
```

Textos y fotos en `plantillas/carruseles.json`. Salida en
`plantillas/carruseles/<nombre>/01.png, 02.png…` (se suben en ese orden, en un
solo posteo) y `<nombre>-completo.png` para ver la tira entera.

| Carrusel | Slides | Qué es |
|---|---|---|
| `servicios` | 6 | Portada "¿Qué necesita tu negocio?", una tarjeta por servicio y cierre "Escribinos". La cinta amarilla y la línea punteada recorren todo. |
| `trabajos` | 5 | Collage de fotos de proyectos con etiquetas y cierre "¿El próximo es el tuyo?". |

Reglas del diseño (para armar nuevos): ningún texto sobre un corte, la slide 1
tiene que entenderse sola (es la que aparece en el perfil) y el texto importante
lejos del borde de arriba y de abajo, donde Instagram pone su interfaz. Al
subirlo, no recortar ni aplicar filtros distintos por slide.

## Carrusel "Cómo trabajamos" (método, 8 slides)

Versión editorial y sobria de la marca: mucho aire, numerales gigantes en
contorno, metadatos en versalitas, filetes finos, grano de película y una línea
de progreso que avanza fase a fase. Contenido en `plantillas/metodo.json`
(fases, plazos, entregables y "tu parte"):

```bash
node brand/plantillas/metodo.mjs
```
