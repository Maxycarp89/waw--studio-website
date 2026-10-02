/*
  WAW! Studio — capa de movimiento compartida por las 3 propuestas.
  Vanilla, sin dependencias. Cada efecto se activa solo si su atributo
  data-* existe en la página, así cada opción elige su set.
*/
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer:fine)').matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(Math.max(v, a), b);

  /* ---------- Intro: telón que sube y dispara el hero ---------- */
  const intro = $('[data-intro]');
  const start = () => document.body.classList.add('is-loaded');
  if (intro && !reduce) {
    const count = $('[data-intro-count]', intro);
    const t0 = performance.now(), dur = 1300;
    (function tick(now) {
      const p = clamp((now - t0) / dur, 0, 1);
      if (count) count.textContent = String(Math.round(100 * (1 - Math.pow(1 - p, 3)))).padStart(3, '0');
      if (p < 1) requestAnimationFrame(tick);
      else { intro.classList.add('is-done'); setTimeout(start, 250); }
    })(t0);
  } else {
    if (intro) intro.remove();
    requestAnimationFrame(start);
  }

  /* ---------- Scroll suave (solo mouse) ---------- */
  let velocity = 0, lastY = scrollY;
  if (!reduce && fine) {
    let target = scrollY, current = target, raf = null;
    const max = () => document.documentElement.scrollHeight - innerHeight;
    addEventListener('wheel', e => {
      if (e.ctrlKey) return;
      e.preventDefault();
      const d = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
      target = clamp(target + d, 0, max());
      if (!raf) raf = requestAnimationFrame(loop);
    }, { passive: false });
    function loop() {
      current += (target - current) * 0.085;
      if (Math.abs(target - current) < 0.5) { current = target; raf = null; }
      else raf = requestAnimationFrame(loop);
      scrollTo(0, current);
    }
    addEventListener('scroll', () => { if (!raf) target = current = scrollY; }, { passive: true });
    addEventListener('resize', () => { target = current = scrollY; });
    // anchors con el mismo scroll suave
    $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
      const el = $(a.getAttribute('href'));
      if (!el) return;
      e.preventDefault();
      target = clamp(el.getBoundingClientRect().top + scrollY - 40, 0, max());
      if (!raf) raf = requestAnimationFrame(loop);
    }));
  }

  /* ---------- Reveals con máscara ---------- */
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('is-in');
    io.unobserve(e.target);
  }), { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  $$('[data-reveal]').forEach(el => {
    $$('.rm, .ru, .line', el).forEach((c, j) => c.style.setProperty('--d', (j * 90) + 'ms'));
    reduce ? el.classList.add('is-in') : io.observe(el);
  });

  /* ---------- Texto que se ilumina palabra por palabra ---------- */
  const wordBlocks = $$('[data-words]').map(el => {
    el.innerHTML = el.innerHTML.split(/(<[^>]+>|\s+)/).map(t =>
      !t || /^\s+$/.test(t) || t.startsWith('<') ? t : `<span class="w">${t}</span>`).join('');
    return { el, words: $$('.w', el) };
  });

  /* ---------- Marquees que aceleran con la velocidad del scroll ---------- */
  const marquees = $$('[data-marquee]').map(el => {
    const track = el.firstElementChild;
    track.innerHTML += track.innerHTML; // duplicado para el loop
    return { track, x: 0, dir: Number(el.dataset.marquee) || 1, speed: Number(el.dataset.speed) || 0.6 };
  });

  /* ---------- Cursor con etiqueta ---------- */
  let mx = innerWidth / 2, my = innerHeight / 2;
  const cursor = $('.cursor');
  if (cursor && fine && !reduce) {
    let cx = mx, cy = my;
    addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    (function loop() {
      cx += (mx - cx) * 0.18; cy += (my - cy) * 0.18;
      cursor.style.transform = `translate3d(${cx}px,${cy}px,0)`;
      requestAnimationFrame(loop);
    })();
    $$('a,button,[data-cursor]').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add(el.dataset.cursor ? 'is-label' : 'is-lg');
        if (el.dataset.cursor) cursor.dataset.label = el.dataset.cursor;
      });
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-lg', 'is-label'));
    });
  } else if (cursor) cursor.remove();
  if (!cursor) addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  /* ---------- Botones magnéticos ---------- */
  if (fine && !reduce) $$('[data-magnetic]').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.3}px,${(e.clientY - r.top - r.height / 2) * 0.4}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });

  /* ---------- Preview de imagen que sigue al mouse en listas ---------- */
  const preview = $('.hover-preview');
  if (preview && fine && !reduce) {
    const img = $('img', preview);
    let px = mx, py = my;
    $$('[data-img]').forEach(row => {
      row.addEventListener('mouseenter', () => { img.src = row.dataset.img; preview.classList.add('is-on'); });
      row.addEventListener('mouseleave', () => preview.classList.remove('is-on'));
    });
    (function loop() {
      px += (mx - px) * 0.12; py += (my - py) * 0.12;
      const rot = clamp((mx - px) * 0.08, -12, 12);
      preview.style.transform = `translate3d(${px}px,${py}px,0) rotate(${rot}deg)`;
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- Menú mobile ---------- */
  const burger = $('[data-burger]');
  if (burger) burger.addEventListener('click', () => document.body.classList.toggle('menu-open'));
  $$('[data-menu] a').forEach(a => a.addEventListener('click', () => document.body.classList.remove('menu-open')));

  /* ---------- Todo lo que depende del scroll, en un solo frame ---------- */
  const bar = $('[data-progress]');
  const nav = $('[data-nav]');
  const floats = $$('[data-float]');
  const parallax = $$('[data-parallax]');
  const spins = $$('[data-spin]');
  const drifts = $$('[data-drift]');
  const hscroll = $('[data-hscroll]');
  const steps = $('[data-steps]');
  const stacks = $$('[data-stack] > *');
  let navY = 0;

  function frame() {
    const y = scrollY;
    velocity += ((y - lastY) - velocity) * 0.2;
    lastY = y;
    const vh = innerHeight;

    if (bar) bar.style.transform = `scaleX(${y / Math.max(1, document.documentElement.scrollHeight - vh)})`;

    if (nav) {
      if (y > navY + 6 && y > 200) nav.classList.add('is-hidden');
      else if (y < navY - 6) nav.classList.remove('is-hidden');
      nav.classList.toggle('is-solid', y > 40);
      navY = y;
    }

    if (!reduce) {
      marquees.forEach(m => {
        const half = m.track.scrollWidth / 2;
        m.x -= m.dir * (m.speed + Math.min(Math.abs(velocity) * 0.12, 6));
        if (m.x <= -half) m.x += half;
        if (m.x > 0) m.x -= half;
        m.track.style.transform = `translate3d(${m.x}px,0,0)`;
      });

      floats.forEach(el => {
        const d = Number(el.dataset.float) || 20;
        const fx = (mx / innerWidth - 0.5) * d, fy = (my / vh - 0.5) * d;
        el.style.translate = `${fx}px ${fy - y * d * 0.01}px`;
      });

      parallax.forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        const p = (r.top + r.height / 2 - vh / 2) / vh;
        el.style.transform = `translate3d(0,${(-p * (Number(el.dataset.parallax) || 14)).toFixed(2)}px,0) scale(1.12)`;
      });

      spins.forEach(el => { el.style.rotate = `${y * 0.12}deg`; });

      drifts.forEach(el => {
        const sec = el.closest('section');
        const r = sec.getBoundingClientRect();
        const p = (vh - r.top) / (vh + r.height);
        el.style.transform = `translate3d(${(p - 0.5) * Number(el.dataset.drift) * 34}vw,0,0)`;
      });

      if (hscroll) {
        const track = hscroll.querySelector('[data-hscroll-track]');
        const r = hscroll.getBoundingClientRect();
        const p = clamp(-r.top / (hscroll.offsetHeight - vh), 0, 1);
        track.style.transform = `translate3d(${-p * (track.scrollWidth - innerWidth)}px,0,0)`;
        const meter = hscroll.querySelector('[data-hscroll-meter]');
        if (meter) meter.style.transform = `scaleX(${p})`;
      }

      stacks.forEach((card, i) => {
        const next = stacks[i + 1];
        if (!next) return;
        const r = next.getBoundingClientRect();
        const p = clamp(1 - (r.top - 80) / vh, 0, 1);
        card.style.transform = `scale(${1 - p * 0.06})`;
        card.style.filter = `brightness(${1 - p * 0.35})`;
      });
    }

    wordBlocks.forEach(({ el, words }) => {
      const r = el.getBoundingClientRect();
      const p = clamp((vh * 0.85 - r.top) / (r.height + vh * 0.35), 0, 1);
      const lit = reduce ? words.length : Math.round(p * words.length);
      words.forEach((w, i) => w.classList.toggle('on', i < lit));
    });

    if (steps) {
      const items = $$('[data-step]', steps);
      const r = steps.getBoundingClientRect();
      const p = clamp((vh * 0.5 - r.top) / r.height, 0, 1);
      let current = 0;
      items.forEach((it, i) => {
        const ir = it.getBoundingClientRect();
        const active = ir.top < vh * 0.6;
        if (active) current = i;
        it.classList.toggle('is-active', active);
      });
      const out = $('[data-step-current]', steps);
      if (out) out.textContent = current + 1;
      const line = $('[data-step-line]', steps);
      if (line) line.style.transform = `scaleY(${p})`;
    }

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
