// ─── UTILITIES ─────────────────────────────────────────────
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ─── NAV SCROLL EFFECT ─────────────────────────────────────
const nav = document.getElementById('nav');

function handleNavScroll() {
  if (window.scrollY > 24) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll(); // Run once on load

// ─── MOBILE NAV TOGGLE ─────────────────────────────────────
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('menu-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

// Close menu when a nav link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('menu-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Close menu on outside click
document.addEventListener('click', (e) => {
  if (nav.classList.contains('menu-open') && !nav.contains(e.target)) {
    nav.classList.remove('menu-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});

// ─── ACTIVE NAV LINK ON SCROLL ─────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link[href^="#"]');

function highlightActiveNavLink() {
  const scrollMid = window.scrollY + window.innerHeight / 3;

  let activeSectionId = null;

  sections.forEach(section => {
    const top    = section.offsetTop;
    const bottom = top + section.offsetHeight;
    if (scrollMid >= top && scrollMid < bottom) {
      activeSectionId = section.id;
    }
  });

  navLinkEls.forEach(link => {
    const href = link.getAttribute('href').replace('#', '');
    if (href === activeSectionId) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

window.addEventListener('scroll', highlightActiveNavLink, { passive: true });
highlightActiveNavLink();

// ─── SCROLL FADE-IN ANIMATIONS ─────────────────────────────
if (!prefersReducedMotion) {
  const fadeTargets = document.querySelectorAll([
    '.hero-tag',
    '.hero-headline',
    '.hero-sub',
    '.hero-ctas',
    '.stats-row',
    '.problem-body',
    '.section-heading',
    '.section-sub',
    '.section-body',
    '.service-card',
    '.step',
    '.tools-row',
    '.case-card',
    '.pricing-card',
    '.booking-card',
    '.contact-form',
    '.contact-alt'
  ].join(', '));

  fadeTargets.forEach((el, index) => {
    el.classList.add('fade-in');

    // Stagger cards within a grid
    const parent = el.parentElement;
    if (
      parent &&
      (parent.classList.contains('service-cards') ||
       parent.classList.contains('case-cards') ||
       parent.classList.contains('pricing-cards') ||
       parent.classList.contains('steps'))
    ) {
      const siblings = Array.from(parent.children).filter(
        c => c.tagName !== 'svg' && !c.classList.contains('step-arrow')
      );
      const pos = siblings.indexOf(el);
      if (pos === 1) el.classList.add('fade-in-delay-1');
      if (pos === 2) el.classList.add('fade-in-delay-2');
      if (pos === 3) el.classList.add('fade-in-delay-3');
    }
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  fadeTargets.forEach(el => observer.observe(el));
}

// ─── CONTACT FORM ───────────────────────────────────────────
const form        = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (form) {
  form.addEventListener('submit', function(e) {
    // Do NOT call e.preventDefault() — let Netlify handle the actual POST.
    // We only intercept to show the success state visually.

    const submitBtn = form.querySelector('button[type="submit"]');
    if (!submitBtn) return;

    // Brief visual confirmation before Netlify redirects (or on AJAX fallback)
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled    = true;

    // Show success message after a short delay (visible before page navigates)
    setTimeout(() => {
      if (formSuccess) {
        formSuccess.hidden = false;
      }
      submitBtn.textContent = 'Sent';
    }, 300);
  });
}
