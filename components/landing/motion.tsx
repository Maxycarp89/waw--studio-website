"use client"

import { useEffect } from "react"

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

    /* ---------- intro: telón con contador que dispara el hero ---------- */
    const intro = $("[data-intro]")
    const start = () => body.classList.add("is-loaded")
    if (intro && !reduce) {
      const count = $("[data-intro-count]", intro)
      const t0 = performance.now()
      const tick = (now: number) => {
        if (!alive) return
        const p = clamp((now - t0) / 1300, 0, 1)
        if (count) count.textContent = String(Math.round(100 * (1 - Math.pow(1 - p, 3)))).padStart(3, "0")
        if (p < 1) requestAnimationFrame(tick)
        else {
          intro.classList.add("is-done")
          setTimeout(start, 250)
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
    const drifts = $$("[data-drift]")
    const steps = $("[data-steps]")
    const words = $$("[data-words]").map((el) => ({ el, list: $$(".w", el) }))
    const marquees = $$("[data-marquee]").map((el) => ({
      track: el.firstElementChild as HTMLElement,
      x: 0,
      dir: Number(el.dataset.marquee) || 1,
      speed: Number(el.dataset.speed) || 0.6,
    }))
    const hero3d = $("[data-hero-3d]")
    const heroPin = $("[data-hero-pin]")
    const heroCopy = $("[data-hero-copy]")
    // posición de reposo: a la derecha en desktop, abajo del texto en mobile
    const rest = () => (innerWidth > 900 ? { x: innerWidth * 0.22, y: 0 } : { x: 0, y: innerHeight * 0.18 })
    const chat = $("[data-chat]")
    const chatMsgs = chat ? $$("[data-at]", chat).map((el) => ({ el, at: Number(el.dataset.at), bot: el.dataset.bot !== undefined })) : []
    const chatTyping = chat && $("[data-typing]", chat)
    const chatFeats = chat ? $$("[data-feat]", chat).map((el) => ({ el, from: Number(el.dataset.feat) })) : []
    // arranca girado y "desarmado": el lerp lo trae a su lugar al cargar
    const art = { rx: 24, ry: -160, ex: 1.2, s: 0.8, ...rest() }

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

      if (hero3d) {
        // hero fijo: la pieza viaja al centro, crece, gira y se desarma
        // mientras el texto se desvanece; el mouse solo la inclina en reposo
        let p = 0
        if (heroPin && !reduce) {
          const r = heroPin.getBoundingClientRect()
          p = clamp(-r.top / Math.max(1, heroPin.offsetHeight - vh), 0, 1)
        }
        const loaded = body.classList.contains("is-loaded")
        const calm = (fine && !reduce ? 1 : 0) * (1 - p)
        const home = rest()
        const t = loaded || reduce
          ? {
              rx: 10 - p * 18 - (my / vh - 0.5) * 12 * calm,
              ry: -24 + p * 52 + (mx / innerWidth - 0.5) * 18 * calm,
              ex: reduce ? 0 : Math.pow(p, 1.4) * 1.8,
              s: 1 + p * p * 2.8,
              x: home.x * (1 - p),
              y: home.y * (1 - p),
            }
          : art
        const k = reduce ? 1 : ease(0.08)
        art.rx += (t.rx - art.rx) * k
        art.ry += (t.ry - art.ry) * k
        art.ex += (t.ex - art.ex) * k
        art.s += (t.s - art.s) * k
        art.x += (t.x - art.x) * k
        art.y += (t.y - art.y) * k
        hero3d.style.setProperty("--rx", art.rx.toFixed(2))
        hero3d.style.setProperty("--ry", art.ry.toFixed(2))
        hero3d.style.setProperty("--explode", art.ex.toFixed(3))
        hero3d.style.transform = `translate(-50%, -50%) translate3d(${art.x.toFixed(1)}px, ${art.y.toFixed(1)}px, 0) scale(${art.s.toFixed(3)})`
        // en mobile la pieza queda detrás del texto: en reposo es solo textura
        if (loaded) hero3d.style.opacity = innerWidth > 900 ? "" : (0.35 + 0.65 * clamp(p * 2.5, 0, 1)).toFixed(2)
        if (heroCopy) {
          heroCopy.style.opacity = String(1 - clamp(p * 2.4, 0, 1))
          heroCopy.style.transform = `translate3d(0, ${(-p * 140).toFixed(1)}px, 0)`
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
        chatFeats.forEach((f, i) => {
          const next = chatFeats[i + 1]
          f.el.classList.toggle("is-active", p >= f.from && (!next || p < next.from))
        })
      }

      if (!reduce) {
        marquees.forEach((m) => {
          const half = m.track.scrollWidth / 2
          m.x -= m.dir * (m.speed + Math.min(Math.abs(velocity) * 0.12, 6))
          if (m.x <= -half) m.x += half
          if (m.x > 0) m.x -= half
          m.track.style.transform = `translate3d(${m.x}px,0,0)`
        })
        spins.forEach((el) => { el.style.rotate = `${y * 0.12}deg` })
        drifts.forEach((el) => {
          const r = el.closest("section")!.getBoundingClientRect()
          const p = (vh - r.top) / (vh + r.height)
          el.style.transform = `translate3d(${(p - 0.5) * Number(el.dataset.drift) * 34}vw,0,0)`
        })
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
    }
  }, [])

  return null
}
