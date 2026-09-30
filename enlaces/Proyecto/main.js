/* =============================================
   ONI — Videojuegos Report | main.js
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  $$('.anio').forEach(el => { el.textContent = new Date().getFullYear(); });

  /* --- NAVBAR: scroll sticky + mobile toggle --- */
  const navbar  = document.getElementById('navbar');
  const toggle  = document.getElementById('navToggle');
  const links   = document.getElementById('navLinks');
  const searchBtn = document.getElementById('searchToggle');
  const searchBar = document.getElementById('searchBar');
  const searchInput = document.getElementById('searchInput');
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    backToTop.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    links.classList.toggle('open');
  });

  // Close mobile menu on link click
  $$('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('open');
      links.classList.remove('open');
    });
  });

  searchBtn.addEventListener('click', () => {
    searchBar.classList.toggle('active');
    if (searchBar.classList.contains('active')) searchInput.focus();
    else hideResults();
  });

  /* --- HERO SLIDER --- */
  const slides   = $$('.hero-slide');
  const dots     = $$('.dot');
  const prevBtn  = document.getElementById('heroPrev');
  const nextBtn  = document.getElementById('heroNext');
  let current = 0;
  let autoTimer;

  function goTo(idx) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }
  function startAuto() { stopAuto(); autoTimer = setInterval(() => goTo(current + 1), 5500); }
  function stopAuto() { clearInterval(autoTimer); }

  prevBtn.addEventListener('click', () => { goTo(current - 1); startAuto(); });
  nextBtn.addEventListener('click', () => { goTo(current + 1); startAuto(); });
  dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); startAuto(); }));

  // Swipe support
  let touchStartX = 0;
  const heroEl = $('.hero');
  heroEl.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
  heroEl.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? goTo(current + 1) : goTo(current - 1); startAuto(); }
  }, { passive: true });
  startAuto();

  /* --- BACK TO TOP --- */
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* --- SMOOTH SCROLL for anchor links (ignora href="#") --- */
  const navOffset = () => (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 64) + 16;
  function scrollToEl(el) {
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - navOffset(), behavior: 'smooth' });
  }
  $$('a[href^="#"]').forEach(anchor => {
    const href = anchor.getAttribute('href');
    if (href.length < 2) return;
    anchor.addEventListener('click', e => {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        if (href === '#hero') window.scrollTo({ top: 0, behavior: 'smooth' });
        else scrollToEl(target);
      }
    });
  });

  /* --- CARD TILT (desktop only) --- */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    $$('.news-card, .review-card, .community-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width  - 0.5;
        const y = (e.clientY - rect.top)  / rect.height - 0.5;
        card.style.transform = `perspective(700px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-5px)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  /* --- INTERSECTION OBSERVER: fade-in --- */
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.1 });

  $$('.news-card, .review-card, .esport-item, .community-card, .trending-item, .breaking-item').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.5s ease ${(i % 4) * 0.07}s, transform 0.5s ease ${(i % 4) * 0.07}s`;
    el.classList.add('observe-me');
    observer.observe(el);
  });
  const style = document.createElement('style');
  style.textContent = '.observe-me.visible { opacity: 1 !important; transform: translateY(0) !important; }';
  document.head.appendChild(style);

  /* --- Active nav link on scroll --- */
  const sections = $$('section[id]');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    sections.forEach(section => {
      const top = section.offsetTop - 100;
      if (y >= top && y < top + section.offsetHeight) {
        $$('.nav-link').forEach(l => l.classList.remove('active'));
        const active = $(`.nav-link[href="#${section.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { passive: true });

  /* --- TOAST --- */
  const toastEl = document.getElementById('oniToast');
  let toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-on'), 2800);
  }

  /* =============================================
     ÍNDICE DE ARTÍCULOS (se construye desde el HTML)
     ============================================= */
  const bgUrl = el => {
    const v = (el.getAttribute('style') || '').match(/url\(['"]?([^'")]+)['"]?\)/);
    return v ? v[1] : '';
  };
  const text = (el, s) => {
    const n = el && el.querySelector(s);
    if (!n) return '';
    const c = n.cloneNode(true);
    c.querySelectorAll('br').forEach(br => br.replaceWith(' '));
    return c.textContent.trim().replace(/\s+/g, ' ');
  };
  const platformNames = el => $$('.review-platform i', el).map(i => {
    if (i.classList.contains('fa-playstation')) return 'PlayStation';
    if (i.classList.contains('fa-xbox')) return 'Xbox';
    if (i.classList.contains('fa-steam')) return 'PC / Steam';
    return '';
  }).filter(Boolean);

  /* Cuerpo de cada artículo (el resto de los datos se lee del HTML) */
  const CONTENIDO = {
    'estudios': { cuerpo: [
      'Detrás de cada juego hay equipos de programación, arte, diseño, sonido y control de calidad que trabajan durante años. Las reuniones de revisión son clave para decidir qué se mantiene, qué se mejora y qué se corta.',
      'La mayoría de los estudios trabaja con metodologías ágiles: el proyecto avanza en ciclos cortos con versiones jugables que se prueban constantemente, dentro y fuera del equipo.'
    ] },
    'pandemia': { cuerpo: [
      'Con millones de personas en casa, los videojuegos se convirtieron en una forma de entretenerse y de mantener el contacto con amigos y familia. Plataformas como Steam registraron récords de usuarios conectados durante 2020.',
      'Muchos de esos jugadores nuevos se quedaron: los juegos multijugador y las comunidades en línea siguen siendo uno de los principales espacios sociales para toda una generación.'
    ] },
    'feed': { cuerpo: [
      'Seguir a tus medios favoritos con un lector de noticias o con listas en redes sociales te ayuda a enterarte de lanzamientos, parches y eventos sin perderte entre rumores.',
      'Consejo: separa las cuentas oficiales de los estudios de las de opinión, y activa notificaciones solo para los juegos que realmente juegas.'
    ] },
    'filtraciones': { cuerpo: [
      'Cada gran lanzamiento viene acompañado de supuestas filtraciones. Antes de creer en una, revisa quién la publica, si otras fuentes confiables la confirman y si existe algo más que una simple captura de pantalla.',
      'Las imágenes editadas y las cuentas que imitan a periodistas conocidos son las trampas más comunes. Si suena demasiado bueno para ser verdad, probablemente no lo sea.'
    ] },
    'demons-souls': { cuerpo: [
      'Demon\'s Souls llegó originalmente a PlayStation 3 en 2009 y sentó las bases de lo que hoy conocemos como juegos «souls». El remake de Bluepoint Games fue uno de los títulos de lanzamiento de PlayStation 5 en noviembre de 2020.',
      'El estudio rehízo modelos, escenarios y animaciones, pero respetó el diseño de niveles y el combate original. Boletaria sigue siendo un reino hostil donde cada error se paga caro y, precisamente por eso, cada victoria se siente ganada.'
    ] },
    'cod-mw': { cuerpo: [
      'Infinity Ward reinició la subsaga Modern Warfare en 2019 con una campaña más cruda y realista, y con el Capitán Price de vuelta como figura central.',
      'Su multijugador fue el primero de la serie con juego cruzado entre PC, PlayStation y Xbox, y su base sirvió para Warzone, el battle royale gratuito lanzado en 2020.'
    ] },
    'blizzcon': { cuerpo: [
      'BlizzCon, la convención de Blizzard Entertainment, se celebra en Anaheim, California. Para quienes no podían viajar, el ticket virtual ofrecía transmisiones de los paneles, conciertos y torneos, además de recompensas para juegos como Overwatch, Hearthstone, Diablo o World of Warcraft.',
      'Este formato ayudó a que otras convenciones abrieran sus actividades en línea, algo que hoy es habitual en los grandes eventos de la industria.'
    ] },
    'setup-rgb': { cuerpo: [
      'La iluminación cambia por completo un espacio de juego. Una tira LED detrás del monitor (bias lighting) reduce el contraste entre la pantalla y la pared, y ayuda a que la vista se canse menos en sesiones largas.',
      'Para el resto de la habitación, combina una luz principal cálida con acentos de color. Muchos periféricos permiten sincronizar sus efectos RGB desde un mismo programa para lograr un ambiente coherente.'
    ] },
    'lofi': { cuerpo: [
      'Transmisiones como la de Lofi Girl, con su personaje estudiando junto a la ventana, convirtieron la música lo-fi en compañía permanente para estudiar y trabajar. Su estética de ilustraciones cálidas y ritmos suaves pasó rápidamente a los videojuegos.',
      'Los juegos acogedores de granja, decoración o puzles tranquilos comparten ese espíritu: sesiones sin presión, pensadas para relajarse más que para competir.'
    ] },
    're-village': { cuerpo: [
      'Ethan Winters vuelve como protagonista y ahora busca a su hija en una misteriosa aldea de Europa del Este. Capcom divide la aventura en zonas con estilos muy distintos: del castillo de Lady Dimitrescu a una casa que apuesta por el terror psicológico.',
      'Lo mejor: su variedad, el diseño del castillo y un ritmo que casi nunca decae. Lo peor: el tramo final se inclina demasiado hacia la acción. Aun así, es una de las entregas más entretenidas de la saga.'
    ] },
    'cyberpunk': { cuerpo: [
      'Cyberpunk 2077 tuvo uno de los lanzamientos más polémicos de la industria en 2020, con errores graves en las consolas de la generación anterior. CD Projekt Red siguió trabajando y, en 2023, la actualización 2.0 rehízo sistemas completos como las habilidades, la policía y la inteligencia de los enemigos.',
      'La expansión Phantom Liberty sumó una historia de espionaje protagonizada por Idris Elba y consolidó la redención del juego. Hoy es una recomendación fácil para cualquier fan de los RPG.'
    ] },
    'overwatch-2': { cuerpo: [
      'Overwatch 2 reemplazó al juego original en octubre de 2022 con un cambio importante: los equipos pasaron de seis a cinco jugadores, con un solo tanque por lado. El resultado son partidas más ágiles, donde cada decisión individual pesa más.',
      'El juego es gratuito y se financia con temporadas y pase de batalla. Su jugabilidad sigue siendo de las más pulidas del género, aunque la forma de desbloquear contenido ha generado debate en la comunidad.'
    ] },
    'setup-competitivo': { cuerpo: [
      'Antes de gastar en el periférico más caro, prioriza tres cosas: un monitor con alta tasa de refresco (144 Hz o más), un mouse cómodo para el tamaño de tu mano y una silla y un escritorio a la altura correcta.',
      'Los jugadores profesionales también cuidan la postura y el orden: un espacio despejado y bien iluminado reduce distracciones en partidas largas.'
    ] },
    'subir-rango': { cuerpo: [
      'Calienta antes de jugar clasificatorias, revisa tus repeticiones para detectar errores, especialízate en pocos personajes o roles, comunícate de forma clara con tu equipo y descansa: jugar cansado o frustrado suele terminar en una racha de derrotas.',
      'La constancia pesa más que el talento: pequeñas mejoras cada semana se notan mucho en tu rango al final de la temporada.'
    ] },
    'aim': { cuerpo: [
      'Los entrenadores de puntería proponen ejercicios cortos de seguimiento, cambio de objetivo y precisión. Diez o quince minutos al día antes de jugar son más útiles que una sesión larga a la semana.',
      'Ajusta la sensibilidad para girar 180° con un movimiento cómodo del brazo y mantenla estable: cambiarla a cada rato impide desarrollar memoria muscular.'
    ] },
    'guia-souls': { img: 'img/demon_souls.jpg', cuerpo: [
      'Empieza con calma: explora, aprende los patrones de los enemigos y no tengas miedo de retroceder. Elden Ring ofrece más libertad para avanzar a tu ritmo, mientras que Dark Souls o Demon\'s Souls son más lineales.',
      'Invierte tus primeros niveles en vida y resistencia, mejora tu arma principal antes de cambiarla y recuerda que morir es parte del aprendizaje.'
    ] },
    'orden-re': { img: 'img/re.webp', cuerpo: [
      'Si quieres la historia completa, sigue el orden de lanzamiento: la trilogía original (o sus remakes), luego Resident Evil 4, 5 y 6, y por último la etapa en primera persona con RE7 y Village.',
      'Si prefieres ir directo a lo mejor, empieza por los remakes de Resident Evil 2 y 4, y continúa con RE7 y Village, que forman su propio arco con Ethan Winters.'
    ] },
    'pc-consola': { img: 'img/image-four.jpg', cuerpo: [
      'La consola es más simple: la conectas y juegas, con un catálogo optimizado y exclusivos propios. El PC exige más inversión y configuración inicial, pero permite mejorar piezas con el tiempo, usar mods y aprovechar descuentos frecuentes.',
      'Piensa en qué juegos te interesan, con quién juegas y cuánto quieres gastar a lo largo del tiempo, no solo en la compra inicial.'
    ] },
    'mas-fps': { img: 'img/tech-red.jpg', cuerpo: [
      'Actualiza los controladores de tu tarjeta de video, cierra programas en segundo plano y activa el modo de juego de Windows. Dentro del juego, bajar sombras, efectos volumétricos y reflejos suele dar el mayor aumento de rendimiento con poca pérdida visual.',
      'Si tu tarjeta lo permite, prueba tecnologías de escalado como DLSS, FSR o XeSS para ganar cuadros por segundo manteniendo una buena imagen.'
    ] },
    'cooperativos': { img: 'img/will-lofi.jpg', cuerpo: [
      'It Takes Two, Overcooked 2, Stardew Valley, Deep Rock Galactic y Minecraft son apuestas seguras: cada uno propone una forma distinta de colaborar, desde resolver puzles en pareja hasta construir un mundo entero.',
      'Para grupos grandes funcionan mejor los juegos con partidas cortas y roles claros; para jugar en pareja, busca títulos diseñados específicamente para dos personas.'
    ] },
    'gpu': { cuerpo: [
      'Para jugar en 1080p, una tarjeta de gama media con al menos 8 GB de memoria de video es suficiente en la mayoría de los juegos actuales. En 1440p conviene subir a gama media-alta con 12 GB o más, sobre todo si usas un monitor de alta tasa de refresco.',
      'El 4K sigue siendo terreno de las tarjetas de gama alta. Antes de comprar, revisa que tu fuente de poder y tu procesador acompañen a la nueva GPU para evitar cuellos de botella.'
    ] }
  };

  const articles = [];
  function addArticle(el, data) {
    const extra = CONTENIDO[el.dataset.id] || {};
    data.id = el.dataset.id || '';
    data.cuerpo = (extra.cuerpo || []).slice();
    if (extra.img) data.img = extra.img;
    // Si no hay bajada en el HTML, el primer párrafo del cuerpo hace de bajada
    if (!data.lead || data.lead === data.title) data.lead = data.cuerpo.shift() || '';
    data.el = el;
    data.index = articles.length;
    data.search = [data.section, data.cat, data.title, data.lead, data.cuerpo.join(' '), (data.tags || []).join(' '), (data.platforms || []).join(' '), data.meta || ''].join(' ');
    articles.push(data);
    el.dataset.article = data.index;
  }

  $$('.breaking-item').forEach(el => addArticle(el, {
    section: 'Noticias', cat: text(el, '.breaking-tag'), title: text(el, 'p'), lead: '',
    img: el.querySelector('img').getAttribute('src')
  }));
  $$('.news-card').forEach(el => addArticle(el, {
    section: 'Noticias', cat: text(el, '.card-cat'), title: text(el, '.card-title'), lead: text(el, '.card-excerpt'),
    img: el.querySelector('img').getAttribute('src'), meta: text(el, '.card-date'), badge: text(el, '.card-badge')
  }));
  const destacado = $('.banner-destacado');
  if (destacado) addArticle(destacado, {
    section: 'Especial', cat: text(destacado, '.banner-eyebrow'), title: text(destacado, 'h2'), lead: text(destacado, '.banner-content p'),
    img: bgUrl(destacado), meta: $$('.stat', destacado).map(s => `${text(s, '.stat-num')} · ${text(s, '.stat-label').toLowerCase()}`).join('  |  ')
  });
  $$('.review-card').forEach(el => addArticle(el, {
    section: 'Reviews', cat: 'Review', title: text(el, 'h3'), lead: text(el, '.review-body > p'),
    img: el.querySelector('img').getAttribute('src'), score: text(el, '.review-score span'),
    tags: $$('.review-tags span', el).map(s => s.textContent.trim()), platforms: platformNames(el),
    stars: el.querySelector('.review-stars') ? el.querySelector('.review-stars').innerHTML : ''
  }));
  $$('.esport-item').forEach(el => addArticle(el, {
    section: 'eSports', cat: text(el, '.card-cat'), title: text(el, 'h4'), lead: '',
    img: el.querySelector('img').getAttribute('src'), meta: $$('.esport-meta span', el).map(s => s.textContent.trim()).join(' · ')
  }));
  $$('.trending-item').forEach(el => addArticle(el, {
    section: 'Lo más leído', cat: 'Tendencia', title: text(el, 'a'), lead: '', img: 'img/cyber.jpg', meta: text(el, '.card-date')
  }));
  const banner2 = $('.banner-full');
  if (banner2) addArticle(banner2, {
    section: 'Especial', cat: text(banner2, '.banner-eyebrow'), title: text(banner2, 'h2'), lead: text(banner2, '.banner-full-text p'), img: bgUrl(banner2)
  });

  // Las diapositivas del hero abren el artículo completo al que hacen referencia
  slides.forEach(sl => {
    const ref = articles.find(a => a.id === sl.dataset.ref);
    if (!ref) return;
    sl.dataset.article = ref.index;
    ref.search += ' ' + text(sl, '.slide-tag') + ' ' + text(sl, '.slide-desc');
  });

  /* =============================================
     MODALES
     ============================================= */
  const reader = document.getElementById('readerModal');
  const info = document.getElementById('infoModal');
  let lastFocus = null;
  let currentArticle = null;

  function openModal(m) {
    lastFocus = document.activeElement;
    m.hidden = false;
    document.body.style.overflow = 'hidden';
    stopAuto();
    const close = m.querySelector('[data-close]');
    if (close) close.focus();
  }
  function closeModal(m) {
    if (m.hidden) return;
    m.hidden = true;
    if (reader.hidden && info.hidden) { document.body.style.overflow = ''; startAuto(); }
    if (lastFocus) lastFocus.focus();
  }
  [reader, info].forEach(m => {
    m.addEventListener('click', e => { if (e.target === m || e.target.closest('[data-close]')) closeModal(m); });
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeModal(reader); closeModal(info); hideResults(); }
  });

  function showArticle(a) {
    currentArticle = a;
    const img = document.getElementById('readerImg');
    img.src = a.img; img.alt = a.title;
    const meta = document.getElementById('readerMeta');
    meta.innerHTML = '';
    const cat = document.createElement('span'); cat.className = 'card-cat'; cat.textContent = a.cat || a.section; meta.appendChild(cat);
    if (a.score) { const sc = document.createElement('span'); sc.className = 'reader__score'; sc.innerHTML = `${a.score}<small>/10</small>`; meta.appendChild(sc); }
    if (a.meta) { const m = document.createElement('span'); m.textContent = a.meta; meta.appendChild(m); }
    document.getElementById('readerTitle').textContent = a.title;
    const lead = document.getElementById('readerLead');
    lead.textContent = a.lead || `Todo lo que necesitas saber sobre “${a.title}”, con el análisis del equipo de ONI.`;
    const body = document.getElementById('readerBody');
    body.innerHTML = '';
    (a.cuerpo || []).forEach(par => { const p = document.createElement('p'); p.textContent = par; body.appendChild(p); });
    const extra = document.getElementById('readerExtra');
    extra.innerHTML = '';
    if (a.stars) { const st = document.createElement('div'); st.className = 'review-stars'; st.innerHTML = a.stars; extra.appendChild(st); }
    if (a.platforms && a.platforms.length) { const p = document.createElement('p'); p.textContent = 'Disponible en: ' + a.platforms.join(', '); extra.appendChild(p); }
    if (a.tags && a.tags.length) {
      const t = document.createElement('div'); t.className = 'review-tags';
      a.tags.forEach(tag => { const s = document.createElement('span'); s.textContent = tag; t.appendChild(s); });
      extra.appendChild(t);
    }
    reader.querySelector('.oni-modal__box').scrollTop = 0;
    history.replaceState(null, '', '#articulo-' + (a.index + 1));
  }

  function openArticle(a) { showArticle(a); openModal(reader); }

  document.getElementById('readerNext').addEventListener('click', () => {
    showArticle(articles[(currentArticle.index + 1) % articles.length]);
  });
  document.getElementById('readerShare').addEventListener('click', async () => {
    const url = location.href;
    try { await navigator.clipboard.writeText(url); toast('Enlace copiado al portapapeles'); }
    catch { toast('Copia este enlace: ' + url); }
  });
  // Al cerrar el lector se limpia el hash
  const clearHash = () => { if (location.hash.startsWith('#articulo-')) history.replaceState(null, '', location.pathname + location.search); };
  reader.addEventListener('click', e => { if (e.target === reader || e.target.closest('[data-close]')) clearHash(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') clearHash(); });

  // Abrir artículo directamente desde un enlace compartido (#articulo-N)
  const m = location.hash.match(/^#articulo-(\d+)$/);
  if (m && articles[+m[1] - 1]) setTimeout(() => openArticle(articles[+m[1] - 1]), 300);

  /* --- Información (footer) y comunidad --- */
  const INFO = {
    acerca: { icon: 'fa-gamepad', title: 'Acerca de ONI', html: '<p>ONI es un portal de videojuegos de demostración: noticias, reseñas, eSports y comunidad en un diseño oscuro de alto impacto.</p><p>Fue creado por <a href="../../index.html">Nicolás López</a> para mostrar un slider automático, buscador en vivo, lector de artículos y newsletter funcionando.</p>' },
    equipo: { icon: 'fa-pen-nib', title: 'Equipo editorial', html: '<p>Los artículos de este sitio son contenido de muestra creado para la demostración.</p><p>¿Quieres un portal como este para tu medio o comunidad? <a href="../../index.html#contacto">Contacta al desarrollador</a>.</p>' },
    publicidad: { icon: 'fa-bullhorn', title: 'Publicidad', html: '<p>Los banners destacados y especiales están pensados para campañas de marcas y lanzamientos.</p><p><a href="../../index.html#contacto">Solicita una cotización</a> para un sitio con espacios publicitarios a tu medida.</p>' },
    contacto: { icon: 'fa-envelope', title: 'Contacto', html: '<p>Este es un sitio de demostración. Para proyectos similares, escribe a través del <a href="../../index.html#contacto">formulario del portafolio</a>.</p>' },
    privacidad: { icon: 'fa-shield-halved', title: 'Privacidad', html: '<p>ONI no envía tus datos a ningún servidor. Si te suscribes al newsletter, tu correo solo se guarda en este navegador (LocalStorage) y puedes borrarlo limpiando los datos del sitio.</p>' }
  };
  function showInfo(key) {
    const d = INFO[key];
    if (!d) return;
    document.getElementById('infoIcon').innerHTML = `<i class="fas ${d.icon}"></i>`;
    document.getElementById('infoTitle').textContent = d.title;
    document.getElementById('infoBody').innerHTML = d.html;
    openModal(info);
  }
  function showCommunity(platform) {
    const icons = { Twitch: 'fa-brands fa-twitch', Discord: 'fa-brands fa-discord', YouTube: 'fa-brands fa-youtube' };
    document.getElementById('infoIcon').innerHTML = `<i class="${icons[platform] || 'fas fa-users'}"></i>`;
    document.getElementById('infoTitle').textContent = `Únete en ${platform}`;
    document.getElementById('infoBody').innerHTML =
      `<p>Déjanos tu correo y te avisamos del próximo evento de la comunidad ONI en ${platform}.</p>
       <form id="communityForm" novalidate>
         <input type="email" placeholder="tu@email.com" aria-label="Tu correo" autocomplete="email" required>
         <p class="form-error" aria-live="polite"></p>
         <button type="submit">Avísame</button>
       </form>`;
    openModal(info);
    const f = document.getElementById('communityForm');
    f.querySelector('input').focus();
    f.addEventListener('submit', e => {
      e.preventDefault();
      const input = f.querySelector('input');
      if (!validEmail(input.value)) { f.querySelector('.form-error').textContent = 'Ingresa un correo válido.'; input.focus(); return; }
      saveSubscriber(input.value, platform);
      document.getElementById('infoBody').innerHTML = `<p><i class="fas fa-circle-check" style="color:#4ade80"></i> ¡Listo! Te avisaremos a <b></b> del próximo evento en ${platform}.</p>`;
      document.querySelector('#infoBody b').textContent = input.value.trim();
    });
  }

  /* --- Delegación de clics en enlaces "#" --- */
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href="#"]');
    if (!a) return;
    e.preventDefault();
    if (a.dataset.buscar) { openSearch(a.dataset.buscar); return; }
    if (a.dataset.info) { showInfo(a.dataset.info); return; }
    if (a.dataset.comunidad) { showCommunity(a.dataset.comunidad); return; }
    const host = a.closest('[data-article]');
    if (host) openArticle(articles[+host.dataset.article]);
  });

  // Las tarjetas de "última hora" también abren el artículo
  $$('.breaking-item').forEach(el => {
    el.style.cursor = 'pointer';
    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'button');
    const open = () => openArticle(articles[+el.dataset.article]);
    el.addEventListener('click', open);
    el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  });

  /* =============================================
     BUSCADOR EN VIVO
     ============================================= */
  const results = document.getElementById('searchResults');
  const norm = t => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  let focusIdx = -1;

  function hideResults() { results.hidden = true; focusIdx = -1; }

  function highlight(title, q) {
    const i = norm(title).indexOf(q);
    const span = document.createElement('b');
    if (i < 0 || !q) { span.textContent = title; return span; }
    span.append(title.slice(0, i));
    const mk = document.createElement('mark'); mk.textContent = title.slice(i, i + q.length); span.append(mk);
    span.append(title.slice(i + q.length));
    return span;
  }

  function runSearch(raw) {
    const q = norm(raw.trim());
    results.innerHTML = '';
    focusIdx = -1;
    if (!q) { hideResults(); return []; }
    const words = q.split(/\s+/);
    const seen = new Set();
    const found = articles.filter(a => {
      const hay = norm(a.search);
      const key = norm(a.title);
      if (seen.has(key) || !words.every(w => hay.includes(w))) return false;
      seen.add(key); return true;
    }).slice(0, 8);

    if (!found.length) {
      results.innerHTML = '<p class="search-empty">Sin resultados para “<span></span>”. Prueba con <button type="button" data-q="RPG">RPG</button>, <button type="button" data-q="Xbox">Xbox</button> o <button type="button" data-q="eSports">eSports</button>.</p>';
      results.querySelector('span').textContent = raw.trim();
    } else {
      found.forEach(a => {
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'search-result'; b.setAttribute('role', 'option');
        const im = document.createElement('img'); im.src = a.img; im.alt = '';
        const sp = document.createElement('span');
        const sm = document.createElement('small'); sm.textContent = a.section + (a.cat && a.cat !== a.section ? ' · ' + a.cat : '');
        sp.append(sm, highlight(a.title, words[0]));
        b.append(im, sp);
        b.addEventListener('click', () => goToArticle(a));
        results.appendChild(b);
      });
    }
    results.hidden = false;
    return found;
  }

  function goToArticle(a) {
    hideResults();
    searchBar.classList.remove('active');
    const el = a.el;
    scrollToEl(el);
    el.classList.remove('oni-highlight'); void el.offsetWidth; el.classList.add('oni-highlight');
    setTimeout(() => openArticle(a), 700);
  }

  function openSearch(q) {
    searchBar.classList.add('active');
    searchInput.value = q;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    runSearch(q);
    searchInput.focus({ preventScroll: true });
  }

  searchInput.addEventListener('input', () => runSearch(searchInput.value));
  searchInput.addEventListener('keydown', e => {
    const items = $$('.search-result', results);
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      if (!items.length) return;
      e.preventDefault();
      focusIdx = (focusIdx + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
      items.forEach((it, i) => it.classList.toggle('is-focus', i === focusIdx));
      items[focusIdx].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (!items.length) runSearch(searchInput.value);
      const list = $$('.search-result', results);
      if (list.length) list[Math.max(0, focusIdx)].click();
    }
  });
  document.getElementById('searchGo').addEventListener('click', () => {
    const found = runSearch(searchInput.value);
    if (found.length === 1) goToArticle(found[0]);
    searchInput.focus();
  });
  results.addEventListener('click', e => {
    const q = e.target.closest('[data-q]');
    if (q) { searchInput.value = q.dataset.q; runSearch(q.dataset.q); searchInput.focus(); }
  });
  document.addEventListener('click', e => {
    if (!searchBar.contains(e.target) && !searchBtn.contains(e.target) && !e.target.closest('[data-buscar]')) hideResults();
  });

  /* =============================================
     NEWSLETTER
     ============================================= */
  function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); }
  function saveSubscriber(email, origen) {
    try {
      const subs = JSON.parse(localStorage.getItem('oni_suscriptores') || '[]');
      if (!subs.some(s => s.email === email.trim())) subs.push({ email: email.trim(), origen, fecha: new Date().toISOString() });
      localStorage.setItem('oni_suscriptores', JSON.stringify(subs));
    } catch { /* sin almacenamiento */ }
  }

  const nlForm = document.getElementById('newsletterForm');
  if (nlForm) {
    const input = nlForm.querySelector('input');
    const btn = nlForm.querySelector('button');
    const msg = nlForm.querySelector('.newsletter-msg');
    nlForm.addEventListener('submit', e => {
      e.preventDefault();
      if (!validEmail(input.value)) {
        input.style.borderColor = '#e8192c';
        msg.textContent = 'Ingresa un correo válido.'; msg.className = 'newsletter-msg err';
        input.focus();
        setTimeout(() => { input.style.borderColor = ''; }, 2000);
        return;
      }
      saveSubscriber(input.value, 'Newsletter');
      btn.textContent = '¡Suscrito! 🎮';
      btn.style.background = '#16a34a';
      msg.textContent = 'Listo: recibirás lo mejor de ONI cada semana.'; msg.className = 'newsletter-msg ok';
      input.value = '';
      setTimeout(() => { btn.textContent = 'Suscribirse'; btn.style.background = ''; msg.textContent = ''; }, 4000);
    });
  }
});
