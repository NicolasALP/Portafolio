/* =============================================
   ONI — Videojuegos Report | main.js
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* --- NAVBAR: scroll sticky + mobile toggle --- */
  const navbar  = document.getElementById('navbar');
  const toggle  = document.getElementById('navToggle');
  const links   = document.getElementById('navLinks');
  const searchBtn = document.getElementById('searchToggle');
  const searchBar = document.getElementById('searchBar');
  const searchInput = document.getElementById('searchInput');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    backToTop.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    links.classList.toggle('open');
  });

  // Close mobile menu on link click
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('open');
      links.classList.remove('open');
    });
  });

  searchBtn.addEventListener('click', () => {
    searchBar.classList.toggle('active');
    if (searchBar.classList.contains('active')) searchInput.focus();
  });

  /* --- HERO SLIDER --- */
  const slides   = document.querySelectorAll('.hero-slide');
  const dots     = document.querySelectorAll('.dot');
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

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(() => goTo(current + 1), 5500);
  }
  function stopAuto() { clearInterval(autoTimer); }

  prevBtn.addEventListener('click', () => { goTo(current - 1); startAuto(); });
  nextBtn.addEventListener('click', () => { goTo(current + 1); startAuto(); });
  dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); startAuto(); }));

  // Swipe support
  let touchStartX = 0;
  const heroEl = document.querySelector('.hero');
  heroEl.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
  heroEl.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? goTo(current + 1) : goTo(current - 1); startAuto(); }
  }, { passive: true });

  startAuto();

  /* --- BACK TO TOP --- */
  const backToTop = document.getElementById('backToTop');
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* --- SMOOTH SCROLL for anchor links --- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 64;
        window.scrollTo({ top: target.offsetTop - offset - 16, behavior: 'smooth' });
      }
    });
  });

  /* --- CARD TILT (desktop only) --- */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.news-card, .review-card, .community-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width  - 0.5;
        const y = (e.clientY - rect.top)  / rect.height - 0.5;
        card.style.transform = `perspective(700px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-5px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* --- INTERSECTION OBSERVER: fade-in sections --- */
  const observerOpts = { threshold: 0.1 };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOpts);

  document.querySelectorAll(
    '.news-card, .review-card, .esport-item, .community-card, .trending-item, .breaking-item'
  ).forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.5s ease ${i * 0.07}s, transform 0.5s ease ${i * 0.07}s`;
    el.classList.add('observe-me');
    observer.observe(el);
  });

  // Add visible style
  const style = document.createElement('style');
  style.textContent = '.observe-me.visible { opacity: 1 !important; transform: translateY(0) !important; }';
  document.head.appendChild(style);

  /* --- NEWSLETTER form feedback --- */
  const newsletterBtn = document.querySelector('.newsletter-form button');
  const newsletterInput = document.querySelector('.newsletter-form input');
  if (newsletterBtn) {
    newsletterBtn.addEventListener('click', () => {
      const val = newsletterInput.value.trim();
      if (val && val.includes('@')) {
        newsletterBtn.textContent = '¡Suscrito! 🎮';
        newsletterBtn.style.background = '#16a34a';
        newsletterInput.value = '';
        setTimeout(() => {
          newsletterBtn.textContent = 'Suscribirse';
          newsletterBtn.style.background = '';
        }, 3000);
      } else {
        newsletterInput.style.borderColor = '#e8192c';
        setTimeout(() => { newsletterInput.style.borderColor = ''; }, 2000);
      }
    });
  }

  /* --- Active nav link on scroll --- */
  const sections = document.querySelectorAll('section[id], main section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    sections.forEach(section => {
      const top = section.offsetTop - 100;
      const bottom = top + section.offsetHeight;
      if (scrollY >= top && scrollY < bottom) {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${section.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { passive: true });

});
