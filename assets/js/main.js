/* =========================================================
   Nicolás López · Portafolio — main.js
   ========================================================= */
(() => {
  'use strict';

  const CONTACT_EMAIL = 'nicolas.lopez.pasten@gmail.com';
  const FORM_ENDPOINT = 'https://formsubmit.co/ajax/' + CONTACT_EMAIL;

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- Año ---------- */
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Toast ---------- */
  const toastEl = $('#toast');
  let toastTimer;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-on'), 2600);
  }

  /* ---------- Navegación ---------- */
  const nav = $('#nav');
  const navToggle = $('#navToggle');
  const navMenu = $('#navMenu');

  function closeMenu() {
    navMenu.classList.remove('is-open');
    nav.classList.remove('menu-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Abrir menú');
  }
  navToggle.addEventListener('click', () => {
    const open = !navMenu.classList.contains('is-open');
    navMenu.classList.toggle('is-open', open);
    nav.classList.toggle('menu-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });
  $$('#navMenu a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  /* ---------- Scroll: nav, progreso, botones flotantes ---------- */
  const progress = $('#scrollProgress');
  const toTop = $('#toTop');
  const mobileCta = $('#mobileCta');
  const hero = $('#inicio');
  const contact = $('#contacto');
  let ticking = false;

  function onScroll() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    nav.classList.toggle('is-scrolled', y > 20);
    if (progress) progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    toTop.classList.toggle('is-visible', y > 700);
    const pastHero = y > hero.offsetHeight * 0.7;
    const cRect = contact.getBoundingClientRect();
    const inContact = cRect.top < window.innerHeight && cRect.bottom > 0;
    mobileCta.classList.toggle('is-visible', pastHero && !inContact);
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

  /* ---------- Link activo según sección ---------- */
  const navLinks = $$('.nav__link');
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === '#' + entry.target.id));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  ['inicio', 'servicios', 'proyectos', 'proceso', 'sobre-mi', 'faq', 'contacto']
    .map(id => document.getElementById(id)).filter(Boolean)
    .forEach(s => sectionObserver.observe(s));

  /* ---------- Reveal on scroll ---------- */
  const revealEls = $$('[data-reveal]');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('is-in'));
  } else {
    const ro = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('is-in'); ro.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => ro.observe(el));
  }

  /* ---------- Contadores ---------- */
  const counters = $$('[data-count]');
  const co = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const end = +el.dataset.count;
      co.unobserve(el);
      if (reduceMotion) { el.textContent = end; return; }
      const dur = 1400; const t0 = performance.now();
      const step = t => {
        const p = Math.min((t - t0) / dur, 1);
        el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.6 });
  counters.forEach(c => co.observe(c));

  /* ---------- Texto rotativo del hero ---------- */
  const typedEl = $('#typed');
  const words = ['landing pages', 'tiendas online', 'aplicaciones web', 'dashboards de datos', 'tu próximo proyecto'];
  if (typedEl && !reduceMotion) {
    let wi = 0, ci = words[0].length, deleting = true;
    const tick = () => {
      const word = words[wi];
      if (deleting) {
        ci--;
        typedEl.textContent = word.slice(0, ci);
        if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
        setTimeout(tick, 45);
      } else {
        const next = words[wi];
        ci++;
        typedEl.textContent = next.slice(0, ci);
        if (ci === next.length) { deleting = true; setTimeout(tick, 1900); }
        else setTimeout(tick, 85);
      }
    };
    setTimeout(tick, 2200);
  }

  /* ---------- Editor de código animado ---------- */
  const codeEl = $('#codeTyper');
  const CODE = [
    [['const ', 'kw'], ['nicolas', 'var'], [' = {', 'pun']],
    [['  rol', 'prop'], [': ', 'pun'], ['"Desarrollador Frontend"', 'str'], [',', 'pun']],
    [['  stack', 'prop'], [': [', 'pun'], ['"JS"', 'str'], [', ', 'pun'], ['"Java"', 'str'], [', ', 'pun'], ['"C#"', 'str'], [', ', 'pun'], ['"Python"', 'str'], ['],', 'pun']],
    [['  metodologia', 'prop'], [': ', 'pun'], ['"Scrum"', 'str'], [',', 'pun']],
    [['  ubicacion', 'prop'], [': ', 'pun'], ['"Santiago, Chile"', 'str'], [',', 'pun']],
    [['  disponible', 'prop'], [': ', 'pun'], ['true', 'bool'], [',', 'pun']],
    [['};', 'pun']],
    [['', '']],
    [['// tu idea + mi código = resultados', 'com']],
    [['nicolas', 'var'], ['.', 'pun'], ['construir', 'fn'], ['(', 'pun'], ['"tu proyecto"', 'str'], [');', 'pun']]
  ];

  function renderCodeStatic() {
    codeEl.innerHTML = '';
    CODE.forEach((line, i) => {
      const ln = document.createElement('span'); ln.className = 'ln'; ln.textContent = i + 1;
      codeEl.appendChild(ln);
      line.forEach(([txt, cls]) => {
        const s = document.createElement('span'); if (cls) s.className = 'tk-' + cls; s.textContent = txt; codeEl.appendChild(s);
      });
      codeEl.appendChild(document.createTextNode('\n'));
    });
    finishTerminal();
  }

  function typeCode() {
    codeEl.innerHTML = '';
    let li = 0, ti = 0, ci = 0, span = null;
    const next = () => {
      if (li >= CODE.length) { finishTerminal(); return; }
      const line = CODE[li];
      if (ti === 0 && ci === 0 && !span) {
        const ln = document.createElement('span'); ln.className = 'ln'; ln.textContent = li + 1;
        codeEl.appendChild(ln);
      }
      const [txt, cls] = line[ti];
      if (!span) { span = document.createElement('span'); if (cls) span.className = 'tk-' + cls; codeEl.appendChild(span); }
      if (ci < txt.length) {
        span.textContent += txt[ci++];
        setTimeout(next, 12 + Math.random() * 22);
        return;
      }
      span = null; ci = 0; ti++;
      if (ti >= line.length) { codeEl.appendChild(document.createTextNode('\n')); ti = 0; li++; setTimeout(next, 90); }
      else next();
    };
    next();
  }

  function finishTerminal() {
    const l1 = $('#termLine1'), l2 = $('#termLine2');
    if (!l1) return;
    setTimeout(() => { l1.textContent = '✓ build completado en 1.2s'; l1.className = 't-green'; }, reduceMotion ? 0 : 500);
    setTimeout(() => l2.classList.add('is-on'), reduceMotion ? 0 : 1100);
  }

  if (codeEl) {
    if (reduceMotion) renderCodeStatic();
    else setTimeout(typeCode, 700);
  }

  /* ---------- Tilt del editor ---------- */
  const codeWin = $('#codeWindow');
  if (codeWin && finePointer && !reduceMotion) {
    const visual = codeWin.parentElement;
    visual.addEventListener('mousemove', e => {
      const r = visual.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      codeWin.style.transform = `rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
    });
    visual.addEventListener('mouseleave', () => { codeWin.style.transform = ''; });
  }

  /* ---------- Spotlight en tarjetas + brillo del cursor ---------- */
  if (finePointer) {
    $$('.card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    });
    const glow = $('#cursorGlow');
    if (glow && !reduceMotion) {
      let gx = 0, gy = 0, tx = 0, ty = 0, raf = null;
      const loop = () => {
        gx += (tx - gx) * 0.12; gy += (ty - gy) * 0.12;
        glow.style.transform = `translate(${gx}px, ${gy}px)`;
        raf = (Math.abs(tx - gx) > .5 || Math.abs(ty - gy) > .5) ? requestAnimationFrame(loop) : null;
      };
      window.addEventListener('mousemove', e => {
        tx = e.clientX; ty = e.clientY;
        glow.classList.add('is-on');
        if (!raf) raf = requestAnimationFrame(loop);
      }, { passive: true });
      document.addEventListener('mouseleave', () => glow.classList.remove('is-on'));
    }
  }

  /* ---------- Red de partículas del hero ---------- */
  const canvas = $('#netCanvas');
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    let W = 0, H = 0, DPR = 1, pts = [], running = false, rafId = null;
    const mouse = { x: -9999, y: -9999 };
    const LINK = 140;

    function resize() {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W * DPR; canvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      const count = Math.min(95, Math.round((W * H) / 16000));
      pts = Array.from({ length: count }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35,
        r: Math.random() * 1.6 + .6
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        if (!reduceMotion) {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > W) p.vx *= -1;
          if (p.y < 0 || p.y > H) p.vy *= -1;
          const dxm = p.x - mouse.x, dym = p.y - mouse.y, dm = Math.hypot(dxm, dym);
          if (dm < 120 && dm > 0) { p.x += dxm / dm * .8; p.y += dym / dm * .8; }
        }
        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j];
          const dx = p.x - q.x, dy = p.y - q.y, d = dx * dx + dy * dy;
          if (d < LINK * LINK) {
            const a = 1 - Math.sqrt(d) / LINK;
            ctx.strokeStyle = `rgba(56, 189, 248, ${a * .22})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }
        const dm2 = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        if (dm2 < 180) {
          ctx.strokeStyle = `rgba(34, 211, 238, ${(1 - dm2 / 180) * .45})`;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
        ctx.fillStyle = 'rgba(147, 197, 253, .85)';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
      if (running) rafId = requestAnimationFrame(draw);
    }

    function start() { if (!running && !reduceMotion) { running = true; rafId = requestAnimationFrame(draw); } }
    function stop() { running = false; cancelAnimationFrame(rafId); }

    resize(); draw();
    let rt; window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { resize(); if (!running) draw(); }, 150); });
    hero.addEventListener('mousemove', e => { const r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
    hero.addEventListener('mouseleave', () => { mouse.x = mouse.y = -9999; });
    new IntersectionObserver(([e]) => { e.isIntersecting ? start() : stop(); }).observe(hero);
    document.addEventListener('visibilitychange', () => { document.hidden ? stop() : start(); });
  }

  /* ---------- Filtro de proyectos ---------- */
  const filterBtns = $$('.filter');
  const projects = $$('#projectsGrid .project');
  filterBtns.forEach(btn => btn.addEventListener('click', () => {
    const f = btn.dataset.filter;
    filterBtns.forEach(b => { const on = b === btn; b.classList.toggle('is-active', on); b.setAttribute('aria-pressed', String(on)); });
    projects.forEach(p => {
      const show = f === 'all' || p.dataset.cat.split(' ').includes(f);
      p.classList.toggle('is-hidden', !show);
      if (show) { p.classList.add('is-in'); p.classList.remove('is-entering'); void p.offsetWidth; p.classList.add('is-entering'); }
    });
  }));

  /* ---------- "Cotizar este servicio" preselecciona el formulario ---------- */
  const serviceSelect = $('#cf-service');
  $$('[data-service]').forEach(link => link.addEventListener('click', () => {
    const val = link.dataset.service;
    if (serviceSelect && [...serviceSelect.options].some(o => o.value === val)) serviceSelect.value = val;
    setTimeout(() => $('#cf-name')?.focus({ preventScroll: true }), 700);
  }));

  /* ---------- Copiar correo ---------- */
  $$('[data-copy]').forEach(btn => btn.addEventListener('click', async () => {
    const text = btn.dataset.copy;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch { /* sin soporte */ }
      ta.remove();
    }
    toast('Correo copiado: ' + text);
  }));

  /* ---------- FAQ: solo una abierta a la vez ---------- */
  const faqs = $$('.faq__item');
  faqs.forEach(d => d.addEventListener('toggle', () => { if (d.open) faqs.forEach(o => { if (o !== d) o.open = false; }); }));

  /* ---------- Formulario de contacto ---------- */
  const form = $('#contactForm');
  if (form) {
    const fields = {
      nombre: { el: $('#cf-name'), check: v => v.trim().length >= 2 || 'Escribe tu nombre (mínimo 2 letras).' },
      email: { el: $('#cf-email'), check: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Ingresa un correo válido, por ejemplo nombre@correo.com.' },
      telefono: { el: $('#cf-phone'), check: v => !v.trim() || /^[+()\d\s-]{8,20}$/.test(v.trim()) || 'Revisa el número (solo dígitos, espacios, + o -).' },
      mensaje: { el: $('#cf-message'), check: v => v.trim().length >= 10 || 'Cuéntame un poco más (mínimo 10 caracteres).' }
    };
    const submitBtn = $('#cfSubmit');
    const success = $('#formSuccess');
    const successText = $('#formSuccessText');

    function validate(name) {
      const f = fields[name];
      const res = f.check(f.el.value);
      const wrap = f.el.closest('.field');
      const err = wrap.querySelector('.field__error');
      const ok = res === true;
      wrap.classList.toggle('is-invalid', !ok);
      wrap.classList.toggle('is-valid', ok && f.el.value.trim() !== '');
      f.el.setAttribute('aria-invalid', String(!ok));
      err.textContent = ok ? '' : res;
      return ok;
    }
    Object.keys(fields).forEach(name => {
      const el = fields[name].el;
      el.addEventListener('blur', () => { if (el.value.trim() || el.required) validate(name); });
      el.addEventListener('input', () => { if (el.closest('.field').classList.contains('is-invalid')) validate(name); });
    });

    function mailtoFallback(data) {
      const body = `Hola Nicolás,\n\n${data.mensaje}\n\n—\nNombre: ${data.nombre}\nCorreo: ${data.email}\nTeléfono: ${data.telefono || '-'}\nServicio: ${data.servicio}`;
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Cotización: ' + data.servicio)}&body=${encodeURIComponent(body)}`;
    }

    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (form.elements._honey && form.elements._honey.value) return; // bot
      const valid = Object.keys(fields).map(validate).every(Boolean);
      if (!valid) {
        const firstBad = form.querySelector('.is-invalid input, .is-invalid textarea');
        firstBad && firstBad.focus();
        return;
      }
      const data = {
        nombre: fields.nombre.el.value.trim(),
        email: fields.email.el.value.trim(),
        telefono: fields.telefono.el.value.trim(),
        servicio: serviceSelect.value,
        mensaje: fields.mensaje.el.value.trim()
      };
      submitBtn.classList.add('is-loading');
      let sent = false;
      try {
        const ctrl = new AbortController();
        const to = setTimeout(() => ctrl.abort(), 12000);
        const res = await fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            ...data,
            _subject: `Nueva cotización desde el portafolio: ${data.servicio}`,
            _replyto: data.email,
            _template: 'table',
            _captcha: 'false'
          }),
          signal: ctrl.signal
        });
        clearTimeout(to);
        const json = await res.json().catch(() => ({}));
        sent = res.ok && String(json.success) === 'true';
      } catch { sent = false; }
      submitBtn.classList.remove('is-loading');

      if (sent) {
        successText.textContent = `Gracias, ${data.nombre.split(' ')[0]}. Recibí tu mensaje y te responderé a ${data.email} a la brevedad.`;
      } else {
        successText.textContent = 'Abrí tu aplicación de correo con el mensaje listo para enviar. Si no se abrió, escríbeme a ' + CONTACT_EMAIL + '.';
        mailtoFallback(data);
      }
      success.hidden = false;
      form.reset();
      form.querySelectorAll('.field').forEach(f => f.classList.remove('is-valid', 'is-invalid'));
    });

    $('#formReset').addEventListener('click', () => { success.hidden = true; fields.nombre.el.focus(); });
  }
})();
