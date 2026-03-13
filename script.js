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
handleNavScroll();

// ─── MOBILE NAV TOGGLE ─────────────────────────────────────
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('menu-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('menu-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

document.addEventListener('click', (e) => {
  if (nav.classList.contains('menu-open') && !nav.contains(e.target)) {
    nav.classList.remove('menu-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});

// ─── ACTIVE NAV LINK ON SCROLL ─────────────────────────────
const sections    = document.querySelectorAll('section[id]');
const navLinkEls  = document.querySelectorAll('.nav-link[href^="#"]');

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
    link.classList.toggle('active', href === activeSectionId);
  });
}

window.addEventListener('scroll', highlightActiveNavLink, { passive: true });
highlightActiveNavLink();

// ─── SCROLL FADE-IN ANIMATIONS ─────────────────────────────
if (!prefersReducedMotion) {
  const fadeTargets = document.querySelectorAll([
    '.hero-tag',
    '.hero-headline',
    '.hero-greeting',
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
    '.skill-card',
    '.pricing-card',
    '.booking-card',
    '.contact-form',
    '.contact-alt',
    '.testimonial-card',
    '.testimonial-video-block'
  ].join(', '));

  fadeTargets.forEach(el => {
    el.classList.add('fade-in');

    const parent = el.parentElement;
    if (
      parent &&
      (parent.classList.contains('service-cards') ||
       parent.classList.contains('case-cards') ||
       parent.classList.contains('pricing-cards') ||
       parent.classList.contains('skills-grid') ||
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
  form.addEventListener('submit', function() {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (!submitBtn) return;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled    = true;
    setTimeout(() => {
      if (formSuccess) formSuccess.hidden = false;
      submitBtn.textContent = 'Sent';
    }, 300);
  });
}

// ─── CASE STUDY MODAL ───────────────────────────────────────
const caseData = {
  'email-agent': {
    tag:     'E-Commerce',
    title:   'How an e-commerce sales team stopped answering the same emails twice',
    img:     'assets/workflow-email-agent.png',
    imgAlt:  'Email AI Agent n8n workflow diagram',
    videoHref: '#',
    problem: 'A growing support inbox where the team spent most of the day reading incoming emails and writing replies they had written a dozen times before. New team members took two weeks to learn the response patterns.',
    whatBuilt: 'An n8n workflow that triggers on every incoming Gmail email. Claude AI classifies it, fetches the relevant knowledge base section, and drafts a reply in the same thread. The team reviews and sends. Every email the team sends gets added back to the knowledge base — the system learns from their own output.',
    results: [
      'Manual email triage: gone',
      'Copy-pasting standard replies: gone',
      '2-week onboarding for new staff: gone',
      'Human review before sending: kept'
    ],
    tools: ['n8n', 'Claude AI', 'Gmail API', 'Google Sheets']
  },
  'ad-responder': {
    tag:     'Service Business',
    title:   'How a service business stopped losing leads from their Google Ads',
    img:     'assets/workflow-ad-responder.png',
    imgAlt:  'Local Ad Responder n8n workflow diagram',
    videoHref: '#',
    problem: 'A service business running local Google Ads. The problem was what happened after form submission — someone would see it eventually, sometimes two hours later. By then, the lead had called someone else.',
    whatBuilt: 'An n8n workflow that triggers the moment a form lands. The lead gets an SMS within seconds. The manager gets a full notification with name, phone, what they asked, and timestamp. Everything is logged to Google Sheets automatically.',
    results: [
      'Lead response time: from hours to minutes',
      'Manual lead logging: gone',
      'After-hours submissions: handled automatically',
      'Manager visibility: full details on every alert'
    ],
    tools: ['n8n', 'Twilio', 'Google Sheets', 'Webhook']
  }
};

const modal       = document.getElementById('caseModal');
const modalClose  = document.getElementById('modalClose');
const modalContent = document.getElementById('modalContent');

function openModal(caseId) {
  const d = caseData[caseId];
  if (!d) return;

  const resultItems = d.results.map(r => `<li>${r}</li>`).join('');
  const toolSpans   = d.tools.map(t => `<span>${t}</span>`).join('');
  const videoLink   = d.videoHref && d.videoHref !== '#'
    ? `<a href="${d.videoHref}" target="_blank" rel="noopener noreferrer" class="case-video-link" aria-label="Watch workflow walkthrough">
        <span class="play-btn-circle">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        </span>
        Watch the walkthrough
      </a>`
    : '';

  modalContent.innerHTML = `
    <div class="case-img-wrap">
      <img src="${d.img}" alt="${d.imgAlt}" class="case-img" onerror="this.parentElement.classList.add('no-img')" />
      <div class="case-img-placeholder">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
        <span>Workflow screenshot coming soon</span>
      </div>
    </div>
    <div class="case-tag">${d.tag}</div>
    <h3>${d.title}</h3>
    ${videoLink}
    <div class="modal-body">
      <div class="modal-problem">${d.problem}</div>
      <div class="modal-what">
        <div class="modal-what-label">What was built</div>
        <p>${d.whatBuilt}</p>
      </div>
      <div>
        <div class="modal-results-label">Results</div>
        <ul class="modal-results">${resultItems}</ul>
      </div>
      <div class="modal-tools">${toolSpans}</div>
    </div>
  `;

  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  modalClose.focus();
}

function closeModal() {
  modal.hidden = true;
  document.body.style.overflow = '';
}

// Prevent video links from triggering modal open
document.querySelectorAll('.case-video-link').forEach(link => {
  link.addEventListener('click', e => e.stopPropagation());
});

// Open on card click / keyboard
document.querySelectorAll('.case-card[data-case]').forEach(card => {
  card.addEventListener('click', () => openModal(card.dataset.case));
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openModal(card.dataset.case);
    }
  });
});

// Close handlers
modalClose.addEventListener('click', closeModal);

modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modal.hidden) closeModal();
});
