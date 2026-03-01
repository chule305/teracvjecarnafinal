/* ================================================================
   TERA cvjećarna — script.js
   ================================================================ */
(function () {
  'use strict';

  /* ── 1. NAV SCROLL ──────────────────────────────────────────── */
  const nav = document.querySelector('.nav');
  function onScroll() {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── 2. MOBILE NAV ──────────────────────────────────────────── */
  const burger = document.querySelector('.nav-burger');
  const links = document.querySelector('.nav-links');
  if (burger && links) {
    burger.addEventListener('click', () => {
      const open = burger.classList.toggle('open');
      links.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
      burger.setAttribute('aria-expanded', String(open));
    });
    links.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        burger.classList.remove('open');
        links.classList.remove('open');
        document.body.style.overflow = '';
      })
    );
  }

  /* ── 3. ACTIVE LINK ─────────────────────────────────────────── */
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });

  /* ── 4. PARALLAX ────────────────────────────────────────────── */
  const isMobile = () => window.innerWidth <= 768;
  const pEls = document.querySelectorAll('[data-parallax]');
  function doParallax() {
    if (isMobile()) return;
    const sy = window.pageYOffset;
    pEls.forEach(el => {
      const container = el.closest('.hero, .para-sec, .pg-hero');
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const top = rect.top + sy;
      const rel = sy - top;
      const spd = parseFloat(el.dataset.parallax) || 0.3;
      el.style.transform = `translateY(${rel * spd}px)`;
    });
  }
  if (pEls.length) {
    window.addEventListener('scroll', doParallax, { passive: true });
    doParallax();
  }

  /* ── 5. SCROLL REVEAL ───────────────────────────────────────── */
  const revEls = document.querySelectorAll('.reveal, .reveal-l, .reveal-r, .reveal-s');
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in-view');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revEls.forEach(el => obs.observe(el));
  } else {
    revEls.forEach(el => el.classList.add('in-view'));
  }

  /* ── 6. GALLERY FILTER ──────────────────────────────────────── */
  const fBtns = document.querySelectorAll('.f-btn');
  const gItems = document.querySelectorAll('.g-item');
  if (fBtns.length && gItems.length) {
    fBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const f = btn.dataset.filter;
        fBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        gItems.forEach(item => {
          item.classList.toggle('hidden', f !== 'all' && item.dataset.cat !== f);
        });
      });
    });
  }

  /* ── 7. PRODUCT THUMBNAILS ──────────────────────────────────── */
  const thumbs = document.querySelectorAll('.thumb-btn');
  const mainImg = document.querySelector('.prod-main-img');
  if (thumbs.length && mainImg) {
    thumbs.forEach(t => {
      t.addEventListener('click', () => {
        mainImg.style.opacity = '0';
        setTimeout(() => {
          mainImg.src = t.dataset.src;
          mainImg.style.opacity = '1';
        }, 200);
        thumbs.forEach(x => x.classList.remove('active'));
        t.classList.add('active');
      });
    });
    thumbs[0]?.classList.add('active');
  }

  /* ── 8. CONTACT FORM (UI only — wire up a backend to send) ──── */
  const cForm = document.querySelector('#contact-form');
  const cSuccess = document.querySelector('.form-success');
  if (cForm) {
    cForm.addEventListener('submit', e => {
      e.preventDefault();
      cForm.style.cssText = 'opacity:0;transition:opacity .4s ease;pointer-events:none;';
      setTimeout(() => {
        cForm.style.display = 'none';
        if (cSuccess) {
          cSuccess.style.cssText = 'display:block;opacity:0;transition:opacity .4s ease;';
          requestAnimationFrame(() => { cSuccess.style.opacity = '1'; });
        }
      }, 420);
    });
  }

  /* ── 9. INQUIRY FORM (product page) ────────────────────────── */
  const iForm = document.querySelector('#inquiry-form');
  if (iForm) {
    iForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = iForm.querySelector('[type=submit]');
      if (!btn) return;
      const orig = btn.textContent;
      btn.textContent = 'Upit je poslan — hvala!';
      btn.disabled = true;
      setTimeout(() => { btn.textContent = orig; btn.disabled = false; iForm.reset(); }, 3500);
    });
  }

  /* ── 10. SMOOTH ANCHOR SCROLL ───────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - offset, behavior: 'smooth' });
    });
  });

  document.addEventListener('DOMContentLoaded', function () {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      const targetBtn = document.querySelector(`.f-btn[data-filter="${hash}"]`);
      if (targetBtn) {
        targetBtn.click();
      }
    }
  });

  function applyFilterFromHash() {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      const targetBtn = document.querySelector(`.f-btn[data-filter="${hash}"]`);
      if (targetBtn) {
        targetBtn.click();
      }
    }
  }

  document.addEventListener('DOMContentLoaded', applyFilterFromHash);
  window.addEventListener('hashchange', applyFilterFromHash);

  function applyFilterFromHash() {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      const targetBtn = document.querySelector(`.f-btn[data-filter="${hash}"]`);
      if (targetBtn) {
        targetBtn.click();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }

  document.addEventListener('DOMContentLoaded', applyFilterFromHash);
  window.addEventListener('hashchange', applyFilterFromHash);

  function applyFilterFromHash() {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      setTimeout(() => {
        const targetBtn = document.querySelector(`.f-btn[data-filter="${hash}"]`);
        if (targetBtn) {
          targetBtn.click();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100); // waits for gallery filter JS to fully initialize
    }
  }

  document.addEventListener('DOMContentLoaded', applyFilterFromHash);
  window.addEventListener('hashchange', applyFilterFromHash);



})();