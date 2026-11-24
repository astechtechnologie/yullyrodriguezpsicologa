/* Web Premium V3 — navegación y mejoras progresivas */
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
        const pageKey = path => (path.replace(/\/$/, '').split('/').pop() || 'index').replace(/\.html$/, '');
        const current = location.pathname.endsWith('/yullyrodriguezpsicologa/') ? 'index' : pageKey(location.pathname);
        links.querySelectorAll('a[href]').forEach(a => {
          const u = new URL(a.href, location.href);
          if (u.origin === (window.SITE_CONFIG?.dominio || location.origin) && pageKey(u.pathname) === current) a.setAttribute('aria-current', 'page');
          else a.removeAttribute('aria-current');
        });
      }
    }
    const topButton = document.querySelector('.v3-top');
    if (topButton) {
      const updateTop = () => { topButton.hidden = window.scrollY < 600; };
      updateTop();
      window.addEventListener('scroll', updateTop, { passive: true });
      topButton.addEventListener('click', () => { window.scrollTo({top:0, behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}); document.querySelector('.skip-link')?.focus({preventScroll:true}); });
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

/* V3.1 — enlaces centralizados y consultas administrativas. */
(() => {
  'use strict';
  function initContact() {
    const config = window.SITE_CONFIG;
    if (!config) return; // Los enlaces HTML originales siguen funcionando.
    document.querySelectorAll('[data-site-link]').forEach(link => {
      const value = config.redes[link.dataset.siteLink];
      if (typeof value === 'string' && value.startsWith('https://')) link.href = value;
    });
    document.querySelectorAll('[data-site-text]').forEach(el => {
      const value = config[el.dataset.siteText];
      if (typeof value === 'string') el.textContent = value;
    });
    const form = document.getElementById('v31-contact-form');
    const status = document.getElementById('v31-contact-status');
    if (!form) return;
    const submit = form.querySelector('button[type="submit"]');
    if (submit) submit.disabled = false;
    const topics = { disponibilidad:'la disponibilidad de citas', modalidades:'las modalidades de atención', tarifas:'las tarifas y condiciones de atención', general:'información general sobre las consultas' };
    form.addEventListener('submit', event => {
      event.preventDefault();
      const topic = document.getElementById('v31-topic').value;
      if (!Object.prototype.hasOwnProperty.call(topics,topic)) return;
      if (!/^\d{8,15}$/.test(config.whatsappNumero)) {
        if(status) status.textContent = 'El número de WhatsApp no está configurado. Utiliza otro canal de contacto.';
        return;
      }
      const msg = 'Hola Yully, quisiera consultar sobre ' + topics[topic] + '. Gracias.';
      const url = 'https://wa.me/' + config.whatsappNumero + '?text=' + encodeURIComponent(msg);
      if(status) status.textContent = 'Se abrirá WhatsApp. Revisa el mensaje y decide si deseas enviarlo.';
      window.location.assign(url);
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initContact,{once:true});
  else initContact();
})();
