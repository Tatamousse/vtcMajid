document.addEventListener('DOMContentLoaded', () => {
  /* ---------- NAV TOGGLE (mobile) ---------- */
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('mainNav');

  function closeNav() {
    if (nav) {
      nav.classList.remove('show');
      navToggle?.setAttribute('aria-expanded', 'false');
    }
  }

  if (navToggle && nav) {
    navToggle.setAttribute('aria-controls', 'mainNav');
    navToggle.setAttribute('aria-expanded', 'false');

    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const showing = nav.classList.toggle('show');
      navToggle.setAttribute('aria-expanded', showing ? 'true' : 'false');
    });

    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !navToggle.contains(e.target)) {
        closeNav();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeNav();
    });
  }

  /* ---------- FOOTER YEAR ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- LIGHTBOX ---------- */
  const createLightbox = (src, alt = '') => {
    const overlay = document.createElement('div');
    overlay.className = 'ltbx-overlay';
    overlay.tabIndex = -1;
    overlay.innerHTML = `
      <div class="ltbx-inner" role="dialog" aria-modal="true" aria-label="Agrandissement image">
        <button class="ltbx-close" aria-label="Fermer">✕</button>
        <img src="${src}" alt="${alt}" class="ltbx-img" />
      </div>
    `;
    overlay.querySelector('.ltbx-close').addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.remove();
    });
    document.addEventListener('keydown', function onKey(e) {
      if (e.key === 'Escape') {
        overlay.remove();
        document.removeEventListener('keydown', onKey);
      }
    });
    return overlay;
  };

  document.querySelectorAll('.gallery img').forEach(img => {
    img.setAttribute('loading', 'lazy');
    img.tabIndex = 0;

    img.addEventListener('click', () => {
      const lb = createLightbox(img.src, img.alt || '');
      document.body.appendChild(lb);
      lb.focus();
    });

    img.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const lb = createLightbox(img.src, img.alt || '');
        document.body.appendChild(lb);
        lb.focus();
      }
    });
  });

  /* ---------- SMOOTH SCROLL ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          closeNav();
        }
      }
    });
  });

  /* ---------- FORM EMAILJS ---------- */
  emailjs.init('AwYR_jvfGuzzN2mYH'); // <- ta public key EmailJS

  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
        
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;
        
      emailjs.sendForm('service_ogranzt', 'template_q874jof', this)
        .then(function () {
          alert("Votre demande a été envoyée avec succès !");
          form.reset();
          if (submitBtn) submitBtn.disabled = false;
        }, function (error) {
          alert("Erreur lors de l'envoi : " + JSON.stringify(error));
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  }
});
