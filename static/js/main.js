// main.js
document.addEventListener('DOMContentLoaded', () => {
  /* ---------- NAV TOGGLE (mobile) ---------- */
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('mainNav');
  const headerInner = document.querySelector('.header-inner');

  function closeNav() {
    if (nav) {
      nav.classList.remove('show');
      navToggle && navToggle.setAttribute('aria-expanded', 'false');
    }
  }

  function openNav() {
    if (nav) {
      nav.classList.add('show');
      navToggle && navToggle.setAttribute('aria-expanded', 'true');
    }
  }

  if (navToggle && nav) {
    // ensure correct initial aria state
    navToggle.setAttribute('aria-controls', 'mainNav');
    navToggle.setAttribute('aria-expanded', 'false');

    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const showing = nav.classList.toggle('show');
      navToggle.setAttribute('aria-expanded', showing ? 'true' : 'false');
    });

    // close nav when clicking outside (on small screens)
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !navToggle.contains(e.target)) {
        closeNav();
      }
    });

    // close nav on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeNav();
    });
  }

  /* ---------- FOOTER YEAR ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- LIGHTBOX FOR GALLERY ---------- */
  // Create a reusable overlay element to avoid creating many nodes
  const createLightbox = (src, alt = '') => {
    const overlay = document.createElement('div');
    overlay.className = 'ltbx-overlay';
    overlay.tabIndex = -1; // allow focus
    overlay.innerHTML = `
      <div class="ltbx-inner" role="dialog" aria-modal="true" aria-label="Agrandissement image">
        <button class="ltbx-close" aria-label="Fermer">✕</button>
        <img src="${src}" alt="${alt}" class="ltbx-img" />
      </div>
    `;
    // Close handlers
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
    img.addEventListener('click', () => {
      const lb = createLightbox(img.src, img.alt || '');
      document.body.appendChild(lb);
      // move focus to overlay for accessibility
      lb.focus();
    });

    // allow Enter/Space to open when image is focusable (a11y)
    img.tabIndex = 0;
    img.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const lb = createLightbox(img.src, img.alt || '');
        document.body.appendChild(lb);
        lb.focus();
      }
    });
  });

  /* ---------- BASIC FORM VALIDATION ---------- */
  const form = document.querySelector('form[data-validate]');
  if (form) {
    form.addEventListener('submit', (e) => {
      const nameField = form.querySelector('[name="name"]');
      const phoneField = form.querySelector('[name="phone"]');

      const name = nameField ? nameField.value.trim() : '';
      const phone = phoneField ? phoneField.value.trim() : '';

      if (!name || !phone) {
        e.preventDefault();
        // focus on first missing field
        if (!name && nameField) nameField.focus();
        else if (!phone && phoneField) phoneField.focus();
        alert('Merci de renseigner votre nom et numéro de téléphone.');
        return false;
      }

      // optional: disable submit to avoid double submission
      const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.setAttribute('aria-disabled', 'true');
        // re-enable after 8s as fallback
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.removeAttribute('aria-disabled');
        }, 8000);
      }

      return true;
    });
  }

  /* ---------- SMOOTH SCROLL FOR INTERNAL LINKS (nice-to-have) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // close mobile nav after navigation
          closeNav();
        }
      }
    });
  });

  /* ---------- OPTIONAL: improve keyboard accessibility for nav links ---------- */
  document.querySelectorAll('#mainNav a').forEach(link => {
    link.addEventListener('click', () => closeNav());
  });
});
