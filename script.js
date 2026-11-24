/* Web V2 — navegación y mejoras progresivas */
(() => {
  'use strict';
  function init() {
    const header = document.querySelector('header');
    if (header) {
      const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 10);
      updateHeader();
      window.addEventListener('scroll', updateHeader, { passive: true });
      const nav = header.querySelector('nav');
      const links = nav?.querySelector('.nav-enlaces');
      if (nav && links) {
        let toggle = nav.querySelector('.menu-toggle');
        if (!toggle) {
          toggle = document.createElement('button');
          toggle.type = 'button';
          toggle.className = 'menu-toggle';
          for (let i = 0; i < 3; i++) toggle.append(document.createElement('span'));
          nav.insertBefore(toggle, links);
        }
        if (!links.id) links.id = 'nav-principal';
        toggle.setAttribute('aria-controls', links.id);
        const mobile = window.matchMedia('(max-width: 900px)');
        const setOpen = (open) => {
          links.classList.toggle('is-open', open);
          toggle.setAttribute('aria-expanded', String(open));
          toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
        };
        const sync = () => { toggle.hidden = !mobile.matches; setOpen(false); };
        nav.classList.add('js-menu');
        sync();
        toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
        links.addEventListener('click', (event) => { if (event.target.closest('a') && mobile.matches) setOpen(false); });
        document.addEventListener('keydown', (event) => {
          if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setOpen(false); toggle.focus(); }
        });
        document.addEventListener('click', (event) => { if (!nav.contains(event.target) && mobile.matches) setOpen(false); });
        if (mobile.addEventListener) mobile.addEventListener('change', sync);
        else mobile.addListener(sync);
        const current = location.pathname.split('/').pop() || 'index.html';
        links.querySelectorAll('a[href]').forEach(a => {
          if (a.getAttribute('href') === current) a.setAttribute('aria-current', 'page');
        });
      }
    }
    document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
    const cards = document.querySelectorAll('.servicio, .servicio-detalle, .entrada, .servicio-card-index, .v2-service');
    // El contenido permanece visible aunque JavaScript o las animaciones fallen.
    cards.forEach(el => el.classList.add('visible'));
    if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          if (typeof entry.target.animate === 'function') entry.target.animate([{opacity:.75, transform:'translateY(10px)'},{opacity:1, transform:'translateY(0)'}], {duration:350,easing:'ease-out'});
          observer.unobserve(entry.target);
        });
      }, {threshold:.15});
      cards.forEach(el => observer.observe(el));
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
