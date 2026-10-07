"use client"

import { useEffect } from "react"
import { track } from "@vercel/analytics"

/*
  Capa de movimiento de la landing. Todo es imperativo y se engancha por
  atributos data-*, así el markup sigue siendo server component.
  Cada listener usa el mismo AbortController y cada loop chequea `alive`,
  para que el doble montaje de React en desarrollo no deje nada colgado.
*/
export function LandingMotion() {
  useEffect(() => {
    const ac = new AbortController()
    const on = { signal: ac.signal }
    const passive = { signal: ac.signal, passive: true }
    let alive = true

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches
    const fine = matchMedia("(pointer:fine)").matches
    const $ = <T extends Element = HTMLElement>(s: string, c: ParentNode = document) => c.querySelector<T>(s)
    const $$ = <T extends Element = HTMLElement>(s: string, c: ParentNode = document) => [...c.querySelectorAll<T>(s)]
    const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b)
    const body = document.body

    /* ---------- intro: telón con contador que dispara el hero ----------
       Solo en la primera visita: un script en el <head> (layout) marca
       html.intro-seen antes de pintar, y acá lo recordamos al terminar */
    const intro = $("[data-intro]")
    let loadedAt = 0
    const start = () => {
      body.classList.add("is-loaded")
      loadedAt = performance.now()
    }
    const seen = document.documentElement.classList.contains("intro-seen")
    if (intro && !reduce && !seen) {
      const count = $("[data-intro-count]", intro)
      const t0 = performance.now()
      const tick = (now: number) => {
        if (!alive) return
        const p = clamp((now - t0) / 900, 0, 1)
        if (count) count.textContent = String(Math.round(100 * (1 - Math.pow(1 - p, 3)))).padStart(3, "0")
        if (p < 1) requestAnimationFrame(tick)
        else {
          intro.classList.add("is-done")
          try { localStorage.setItem("waw-intro", "1") } catch {}
          setTimeout(start, 120)
          setTimeout(() => { intro.style.display = "none" }, 1100)
        }
      }
      requestAnimationFrame(tick)
    } else {
      intro?.classList.add("is-done")
      start()
    }

    /* ---------- scroll suave con rueda (solo mouse) ---------- */
    if (!reduce && fine) {
      let target = scrollY
      let current = target
      let raf = 0
      const max = () => document.documentElement.scrollHeight - innerHeight
      const loop = () => {
        current += (target - current) * 0.085
        if (Math.abs(target - current) < 0.5) {
          current = target
          raf = 0
        } else raf = requestAnimationFrame(loop)
        scrollTo(0, current)
      }
      const kick = () => { if (!raf) raf = requestAnimationFrame(loop) }
      addEventListener("wheel", (e) => {
        if (e.ctrlKey || body.classList.contains("menu-open")) return
        e.preventDefault()
        target = clamp(target + (e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY), 0, max())
        kick()
      }, { signal: ac.signal, passive: false })
      addEventListener("scroll", () => { if (!raf) target = current = scrollY }, passive)
      addEventListener("resize", () => { target = current = scrollY }, passive)
      $$<HTMLAnchorElement>('a[href^="#"]').forEach((a) =>
        a.addEventListener("click", (e) => {
          const href = a.getAttribute("href")!
          const el = href.length > 1 ? $(href) : null
          if (!el && href !== "#top") return
          e.preventDefault()
          target = el ? clamp(el.getBoundingClientRect().top + scrollY - 40, 0, max()) : 0
          kick()
        }, on),
      )
      ac.signal.addEventListener("abort", () => cancelAnimationFrame(raf))
    }

    /* ---------- reveals con máscara ---------- */
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return
      e.target.classList.add("is-in")
      io.unobserve(e.target)
    }), { threshold: 0.15, rootMargin: "0px 0px -8% 0px" })
    $$("[data-reveal]").forEach((el) => {
      $$(".rm, .ru", el).forEach((c, j) => c.style.setProperty("--d", `${j * 90}ms`))
      if (reduce) el.classList.add("is-in")
      else io.observe(el)
    })

    /* ---------- analítica: clics en todo lo que lleva a contactarnos ----------
       Un evento "Contacto" con el origen (data-track) y el canal */
    document.addEventListener("click", (e) => {
      const a = (e.target as Element | null)?.closest<HTMLAnchorElement>("a[data-track]")
      if (!a) return
      const href = a.getAttribute("href") ?? ""
      const canal = href.includes("wa.me") ? "whatsapp" : href.startsWith("mailto:") ? "email" : "seccion"
      const props: Record<string, string> = { origen: a.dataset.track!, canal }
      if (a.dataset.trackMonto) props.monto = a.dataset.trackMonto
      track("Contacto", props)
    }, on)

    /* ---------- menú mobile ---------- */
    $("[data-burger]")?.addEventListener("click", () => body.classList.toggle("menu-open"), on)
    $$("[data-menu] a").forEach((a) => a.addEventListener("click", () => body.classList.remove("menu-open"), on))

    /* ---------- mouse, cursor, magnéticos y preview ---------- */
    let mx = innerWidth / 2
    let my = innerHeight / 2
    addEventListener("mousemove", (e) => { mx = e.clientX; my = e.clientY }, passive)

    const cursor = $("[data-cursor-dot]")
    let cx = mx, cy = my
    if (cursor && fine && !reduce) {
      $$("a, button, [data-cursor]").forEach((el) => {
        el.addEventListener("mouseenter", () => {
          const label = el.getAttribute("data-cursor")
          cursor.classList.add(label ? "is-label" : "is-lg")
          if (label) cursor.dataset.label = label
        }, on)
        el.addEventListener("mouseleave", () => cursor.classList.remove("is-lg", "is-label"), on)
      })
    } else cursor?.setAttribute("hidden", "")

    if (fine && !reduce) $$("[data-magnetic]").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect()
        el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.3}px,${(e.clientY - r.top - r.height / 2) * 0.4}px)`
      }, on)
      el.addEventListener("mouseleave", () => { el.style.transform = "" }, on)
    })

    const preview = $("[data-preview]")
    const previewImg = preview && $<HTMLImageElement>("img", preview)
    let px = mx, py = my
    if (preview && previewImg && fine && !reduce) $$("[data-img]").forEach((row) => {
      row.addEventListener("mouseenter", () => { previewImg.src = row.dataset.img!; preview.classList.add("is-on") }, on)
      row.addEventListener("mouseleave", () => preview.classList.remove("is-on"), on)
    })

    /* ---------- todo lo que depende del scroll, en un solo frame ---------- */
    const bar = $("[data-progress]")
    const nav = $("[data-nav]")
    const spins = $$("[data-spin]")
    // filas de proyectos: el progreso se mide sobre el bloque de filas (no toda
    // la sección) y el desplazamiento se suaviza con lerp
    const drifts = $$("[data-drift]").map((el) => ({ el, rows: el.parentElement!, dir: Number(el.dataset.drift), x: 0, ready: false }))
    const steps = $("[data-steps]")
    const words = $$("[data-words]").map((el) => ({ el, list: $$(".w", el) }))
    const marquees = $$("[data-marquee]").map((el) => ({
      track: el.firstElementChild as HTMLElement,
      x: 0,
      dir: Number(el.dataset.marquee) || 1,
      speed: Number(el.dataset.speed) || 0.6,
    }))
    // logo del hero: 3D en desktop, plano en mobile (el CSS muestra uno solo)
    const hero3d = $("[data-hero-3d]")
    const heroLogo = $("[data-hero-logo]")
    const isDesk = () => innerWidth > 900
    const heroEl = () => (hero3d && isDesk() ? hero3d : heroLogo)
    const heroPin = $("[data-hero-pin]")
    const heroCopy = $("[data-hero-copy]")
    // posición de reposo: a la derecha y algo alta en desktop; en mobile arriba
    // de todo, debajo del menú (el texto arranca debajo del logo, ver CSS)
    const rest = () =>
      innerWidth > 900
        ? { x: innerWidth * 0.28, y: -innerHeight * 0.05 }
        : { x: 0, y: 76 + baseW / 2 - innerHeight / 2 }
    const chat = $("[data-chat]")
    const chatMsgs = chat ? $$("[data-at]", chat).map((el) => ({ el, at: Number(el.dataset.at), bot: el.dataset.bot !== undefined })) : []
    const chatTyping = chat && $("[data-typing]", chat)
    const chatFeats = chat ? $$("[data-feat]", chat).map((el) => ({ el, from: Number(el.dataset.feat) })) : []
    // servicios: cada tarjeta entra desde su costado y se pinta al llegar al centro
    const servicesSec = $("[data-cards]")
    const cards = servicesSec ? $$("[data-card]", servicesSec) : []
    // sección que pasa el sitio a fondo claro mientras está en pantalla
    const lightSec = $("[data-theme-light]")
    // avisos de "deslizá": hero (hasta que el usuario empieza a scrollear) y chat
    const hintHero = $('[data-hint="hero"]')
    const hintChat = $('[data-hint="chat"]')
    // WAW! gigante del footer: las letras suben en cascada y el ! cae al final
    const giant = $("[data-giant]")
    const giantLetters = giant ? $$(".gl", giant).map((el) => ({ el, k: 0, sq: 0, bang: el.classList.contains("gl--bang") })) : []
    // tokens del tema oscuro y del claro, en RGBA, para interpolarlos
    const THEME = {
      bg: [[11, 11, 11, 1], [244, 241, 234, 1]],
      surface: [[21, 21, 21, 1], [233, 228, 218, 1]],
      fg: [[244, 241, 234, 1], [11, 11, 11, 1]],
      muted: [[143, 139, 132, 1], [93, 89, 82, 1]],
      line: [[244, 241, 234, 0.1], [11, 11, 11, 0.12]],
    } as const
    let themeT = 0
    let themeShown = -1
    const applyTheme = (t: number) => {
      const st = body.style
      if (t < 0.001) {
        for (const k of Object.keys(THEME)) st.removeProperty(`--${k}`)
        st.removeProperty("--t")
      } else {
        // el fondo pasa gradual; el texto queda claro hasta que el fondo cruza la
        // mitad y recién ahí pasa a oscuro, rápido: nunca quedan los dos en gris
        const tText = clamp((t - 0.46) / 0.08, 0, 1)
        const textT = tText * tText * (3 - 2 * tText)
        for (const [k, [a, b]] of Object.entries(THEME)) {
          const kt = k === "fg" || k === "muted" ? textT : t
          const c = a.map((v, i) => v + (b[i] - v) * kt)
          st.setProperty(`--${k}`, `rgba(${Math.round(c[0])}, ${Math.round(c[1])}, ${Math.round(c[2])}, ${c[3].toFixed(3)})`)
        }
        st.setProperty("--t", t.toFixed(3))
      }
      body.classList.toggle("theme-light", t > 0.5)
    }

    // arranca girado, chico y (en 3D) desarmado: el lerp lo trae a su lugar
    const art = { rx: 24, ry: -160, ex: 1.2, r: -18, s: 0.8, x: 0, y: 0, p: 0 }

    // Nitidez: scale() estira una textura ya rasterizada y el SVG se ve borroso
    // al crecer. Mientras se mueve usamos scale() (fluido); cuando se detiene,
    // pasamos ese tamaño al layout real para que el SVG se redibuje nítido.
    // En 3D la perspectiva y la profundidad de capas escalan igual: sin saltos.
    let baseW = 0
    let layoutScale = 1
    const applyLayout = (k: number) => {
      const el = heroEl()
      if (!el) return
      layoutScale = k
      el.style.width = `${(baseW * k).toFixed(1)}px`
      if (el === hero3d) {
        el.style.perspective = `${(baseW * k * 2.2).toFixed(1)}px`
        el.style.setProperty("--ls", k.toFixed(4))
      }
    }
    const measure = () => {
      const el = heroEl()
      if (!el) return
      el.style.width = ""
      baseW = el.offsetWidth
      applyLayout(1)
    }
    measure()
    Object.assign(art, rest())
    addEventListener("resize", measure, passive)

    let lastY = scrollY
    let velocity = 0
    let navY = scrollY
    let last = performance.now()

    const frame = (now: number) => {
      if (!alive) return
      // lerp independiente del framerate: misma sensación a 30, 60 o 120 Hz
      const dt = Math.min((now - last) / 16.67, 4)
      last = now
      const ease = (k: number) => 1 - Math.pow(1 - k, dt)
      const y = scrollY
      const vh = innerHeight
      velocity += (y - lastY - velocity) * 0.2
      lastY = y

      if (bar) bar.style.transform = `scaleX(${y / Math.max(1, document.documentElement.scrollHeight - vh)})`

      if (nav) {
        if (y > navY + 6 && y > 200) nav.classList.add("is-hidden")
        else if (y < navY - 6) nav.classList.remove("is-hidden")
        nav.classList.toggle("is-solid", y > 40)
        navY = y
      }

      if (cursor && fine && !reduce) {
        cx += (mx - cx) * 0.18
        cy += (my - cy) * 0.18
        cursor.style.transform = `translate3d(${cx}px,${cy}px,0)`
      }

      if (preview && fine && !reduce) {
        px += (mx - px) * 0.12
        py += (my - py) * 0.12
        preview.style.transform = `translate3d(${px}px,${py}px,0) rotate(${clamp((mx - px) * 0.08, -12, 12)}deg)`
      }

      const heroNow = heroEl()
      if (heroNow) {
        // hero fijo: el logo viaja al centro y se acerca mientras el texto se
        // desvanece. En 3D además gira y se desarma; el mouse lo mueve en reposo
        let p = 0
        if (heroPin && !reduce) {
          const r = heroPin.getBoundingClientRect()
          p = clamp(-r.top / Math.max(1, heroPin.offsetHeight - vh), 0, 1)
        }
        const loaded = body.classList.contains("is-loaded")
        const calm = (fine && !reduce ? 1 : 0) * (1 - p)
        const home = rest()
        const mxn = mx / innerWidth - 0.5
        const myn = my / vh - 0.5
        const is3d = heroNow === hero3d
        const t = loaded || reduce
          ? is3d
            ? {
                rx: 10 - p * 18 - myn * 12 * calm,
                ry: -24 + p * 52 + mxn * 18 * calm,
                ex: reduce ? 0 : Math.pow(p, 1.4) * 1.8,
                r: 0, p,
                s: 1 + p * p * 2.8,
                x: home.x * (1 - p),
                y: home.y * (1 - p),
              }
            : {
                rx: 0, ry: 0, ex: 0, p,
                r: -4 + p * 14,
                s: 1 + p * p * 2.6,
                x: home.x * (1 - p) + mxn * 24 * calm,
                y: home.y * (1 - p) + myn * 24 * calm,
              }
          : art
        const k = reduce ? 1 : ease(is3d ? 0.08 : 0.1)
        for (const key of ["rx", "ry", "ex", "r", "s", "x", "y", "p"] as const) art[key] += (t[key] - art[key]) * k
        if (Math.abs(t.s - art.s) < 0.003 && Math.abs(layoutScale - art.s) > 0.01) applyLayout(art.s)
        const move = `translate(-50%, -50%) translate3d(${art.x.toFixed(1)}px, ${art.y.toFixed(1)}px, 0)`
        if (is3d) {
          heroNow.style.setProperty("--rx", art.rx.toFixed(2))
          heroNow.style.setProperty("--ry", art.ry.toFixed(2))
          heroNow.style.setProperty("--explode", art.ex.toFixed(3))
          heroNow.style.transform = `${move} scale(${(art.s / layoutScale).toFixed(4)})`
        } else {
          heroNow.style.transform = `${move} rotate(${art.r.toFixed(2)}deg) scale(${(art.s / layoutScale).toFixed(4)})`
          heroNow.style.setProperty("--p", art.p.toFixed(3))
        }
        // aparece cuando terminó de armarse el logo y se va al empezar a scrollear
        if (hintHero) {
          const ready = loadedAt > 0 && now - loadedAt > (reduce ? 0 : 2400)
          hintHero.style.opacity = ready ? (1 - clamp(p * 6, 0, 1)).toFixed(2) : "0"
        }
        if (heroCopy) {
          heroCopy.style.opacity = String(1 - clamp(p * 2.4, 0, 1))
          heroCopy.style.transform = `translate3d(0, ${(-p * 140).toFixed(1)}px, 0)`
        }
      }

      if (servicesSec) {
        const sr = servicesSec.getBoundingClientRect()
        if (sr.top < vh && sr.bottom > 0) {
          cards.forEach((card) => {
            const r = card.getBoundingClientRect()
            const into = reduce ? 1 : clamp((vh * 0.95 - r.top) / (vh * 0.4), 0, 1)
            card.style.setProperty("--in", (1 - Math.pow(1 - into, 3)).toFixed(3))
            const mid = r.top + r.height / 2
            card.classList.toggle("is-lit", mid > vh * 0.15 && mid < vh * 0.7)
          })
        }
      }

      if (lightSec) {
        const r = lightSec.getBoundingClientRect()
        // entra de a poco mientras la sección sube y sale de a poco al irse
        const enter = clamp((vh * 0.4 - r.top) / (vh * 0.35), 0, 1)
        const leave = clamp((r.bottom - vh * 0.6) / (vh * 0.35), 0, 1)
        const target = reduce ? (enter > 0.5 && leave > 0.5 ? 1 : 0) : Math.min(enter, leave)
        themeT += (target - themeT) * ease(0.25)
        if (Math.abs(target - themeT) < 0.002) themeT = target
        // solo se reescriben los colores cuando cambian de verdad
        if (Math.abs(themeT - themeShown) > 0.004 || (themeT === 0 && themeShown !== 0) || (themeT === 1 && themeShown !== 1)) {
          themeShown = themeT
          applyTheme(themeT)
        }
      }

      if (chat) {
        // la conversación avanza con el scroll; el "escribiendo…" aparece
        // justo antes de cada mensaje del bot
        const r = chat.getBoundingClientRect()
        const p = reduce ? 1 : clamp(-r.top / Math.max(1, chat.offsetHeight - vh), 0, 1)
        let typing = false
        chatMsgs.forEach((m) => {
          m.el.classList.toggle("is-on", p >= m.at)
          if (m.bot && p < m.at && p >= m.at - 0.07) typing = true
        })
        chatTyping?.classList.toggle("is-on", typing)
        // visible mientras la charla avanza; se va cuando ya terminó
        if (hintChat) hintChat.style.opacity = (clamp(p * 25, 0, 1) * (1 - clamp((p - 0.82) / 0.08, 0, 1))).toFixed(2)
        chatFeats.forEach((f, i) => {
          const next = chatFeats[i + 1]
          f.el.classList.toggle("is-active", p >= f.from && (!next || p < next.from))
        })
      }

      if (!reduce) {
        // inercia: cintas y filas se inclinan según la velocidad del scroll
        const skew = clamp(velocity * 0.18, -7, 7).toFixed(2)
        marquees.forEach((m) => {
          const half = m.track.scrollWidth / 2
          m.x -= m.dir * (m.speed + Math.min(Math.abs(velocity) * 0.12, 6))
          if (m.x <= -half) m.x += half
          if (m.x > 0) m.x -= half
          m.track.style.transform = `translate3d(${m.x}px,0,0) skewX(${skew}deg)`
        })
        spins.forEach((el) => { el.style.rotate = `${y * 0.12}deg` })
        drifts.forEach((d) => {
          const r = d.rows.getBoundingClientRect()
          if (r.bottom < -vh || r.top > vh * 2) return
          const p = clamp((vh - r.top) / (vh + r.height), 0, 1)
          // en mobile cada foto ocupa casi todo el ancho: hace falta más recorrido
          const amp = innerWidth > 900 ? 0.4 : 1.3
          // centrada según su ancho real, así nunca deja huecos en los bordes
          const target = -(d.el.scrollWidth - innerWidth) / 2 + (p - 0.5) * d.dir * amp * innerWidth
          d.x = d.ready ? d.x + (target - d.x) * ease(0.12) : target
          d.ready = true
          d.el.style.transform = `translate3d(${d.x.toFixed(1)}px,0,0) skewX(${skew}deg)`
        })
      }

      if (giant && !reduce) {
        const r = giant.getBoundingClientRect()
        if (r.top < vh * 1.2 && r.bottom > -vh * 0.2) {
          // 0 cuando el borde de arriba asoma, 1 cuando la palabra entró entera
          const p = clamp((vh - r.top) / (r.height * 1.35), 0, 1)
          giantLetters.forEach((g, i) => {
            const l = clamp((p - i * 0.13) / 0.5, 0, 1)
            let k: number, sq = 0
            if (g.bang) {
              // cae con gravedad hasta el 60% y después rebota aplastándose
              k = Math.min(1, Math.pow(l / 0.6, 2))
              const b = clamp((l - 0.6) / 0.4, 0, 1)
              sq = b > 0 && b < 1 ? Math.sin(b * Math.PI * 2) * (1 - b) : 0
            } else k = 1 - Math.pow(1 - l, 3)
            g.k += (k - g.k) * ease(0.2)
            g.sq += (sq - g.sq) * ease(0.3)
            g.el.style.setProperty("--k", g.k.toFixed(3))
            if (g.bang) g.el.style.setProperty("--sq", g.sq.toFixed(3))
          })
        }
      }

      words.forEach(({ el, list }) => {
        const r = el.getBoundingClientRect()
        const p = clamp((vh * 0.85 - r.top) / (r.height + vh * 0.35), 0, 1)
        const lit = reduce ? list.length : Math.round(p * list.length)
        list.forEach((w, i) => w.classList.toggle("on", i < lit))
      })

      if (steps) {
        const r = steps.getBoundingClientRect()
        let current = 0
        $$("[data-step]", steps).forEach((it, i) => {
          const active = it.getBoundingClientRect().top < vh * 0.6
          if (active) current = i
          it.classList.toggle("is-active", active)
        })
        const out = $("[data-step-current]", steps)
        if (out) out.textContent = String(current + 1)
        const line = $("[data-step-line]", steps)
        if (line) line.style.transform = `scaleY(${clamp((vh * 0.5 - r.top) / r.height, 0, 1)})`
      }

      requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)

    return () => {
      alive = false
      ac.abort()
      io.disconnect()
      body.classList.remove("menu-open")
      applyTheme(0)
    }
  }, [])

  return null
}
