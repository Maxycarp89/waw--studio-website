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
