/*=============== HELPERS ===============*/
const $ = (id) => document.getElementById(id);
const ESCAPES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ESCAPES[c]);
const ARROW =
  '<svg viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>';

/*=============== MOBILE MENU ===============*/
const burger = $('burger');
const drawer = $('drawer');
const scrim = $('scrim');
let menuOpen = false;
function setMenu(open) {
  menuOpen = open;
  drawer.classList.toggle('open', open);
  scrim.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
}
burger.addEventListener('click', (e) => {
  e.stopPropagation();
  setMenu(true);
});
// tap anywhere (links, backdrop, drawer) closes the menu
document.addEventListener('click', () => menuOpen && setMenu(false));
// swipe up closes the menu
let touchY = null;
document.addEventListener(
  'touchstart',
  (e) => (touchY = menuOpen ? e.touches[0].clientY : null),
  { passive: true },
);
document.addEventListener(
  'touchmove',
  (e) => {
    if (touchY !== null && touchY - e.touches[0].clientY > 40) {
      setMenu(false);
      touchY = null;
    }
  },
  { passive: true },
);
document.addEventListener(
  'keydown',
  (e) => e.key === 'Escape' && setMenu(false),
);

/*=============== ACTIVE LINK ===============*/
const navLinks = document.querySelectorAll('#nav a, #drawer a.l');
const spy = new IntersectionObserver(
  (entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    navLinks.forEach((l) =>
      l.classList.toggle('on', l.getAttribute('href') === `#${e.target.id}`),
    );
  }),
  { rootMargin: '-45% 0px -50% 0px' },
);
document.querySelectorAll('main section[id]').forEach((s) => spy.observe(s));

/*=============== CUSTOM CURSOR ===============*/
// A paper plane that follows the mouse: lavender over anything clickable, with
// a spinner badge over a disabled button, and an I-beam over text fields.
// Only for a fine, hovering pointer; touch screens keep it native.
if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const TILT = 16;
  const PLANE = 'M7 6L25.5 14L17.5 18L12.5 25.5Z';
  const CLICKABLE =
    'a, button:not(:disabled), [role="button"], label[for], summary';
  const plane = (cls, extra = '') =>
    `<svg class="${cls}" viewBox="0 0 32 32" aria-hidden="true"><g transform="rotate(${TILT} 7 6)"><path class="o" d="${PLANE}"/><path class="b" d="${PLANE}"/></g>${extra}</svg>`;
  // wait: the same plane with a small cobalt spinner badge at its corner
  const BADGE =
    '<circle class="bg" cx="25" cy="27" r="6.5"/><g class="sp"><circle class="tr" cx="25" cy="27" r="3.8"/><path class="ar" d="M28.8 27a3.8 3.8 0 00-3.8-3.8"/></g>';
  // text: an I-beam (white outline path first, navy path on top)
  const IBEAM = 'M12 6.5h8M16 6.5v19M12 25.5h8';
  const ibeam = `<svg class="t" viewBox="0 0 32 32" aria-hidden="true"><path class="o" d="${IBEAM}"/><path class="b" d="${IBEAM}"/></svg>`;

  const cursor = document.createElement('div');
  cursor.className = 'cur';
  cursor.innerHTML = plane('d') + plane('p') + plane('w', BADGE) + ibeam;
  document.body.appendChild(cursor);
  document.documentElement.classList.add('custom-cursor');

  document.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType === 'touch') return;
      cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      cursor.classList.add('on');
      const wait = !!e.target.closest?.('button:disabled');
      const txt = !wait && !!e.target.closest?.('input, textarea');
      cursor.classList.toggle('wait', wait);
      cursor.classList.toggle('txt', txt);
      cursor.classList.toggle(
        'ptr',
        !wait && !txt && !!e.target.closest?.(CLICKABLE),
      );
    },
    { passive: true },
  );
  document.documentElement.addEventListener('mouseleave', () =>
    cursor.classList.remove('on'),
  );
}

/*=============== PROJECTS ===============*/
const projectsContainer = $('projects-container');
const tones = ['c-white', 'c-sky', 'c-lav'];

function projectCard(p, i) {
  const tone = tones[i % 3];
  const white = tone === 'c-white';
  const repo = `<a class="btn navy" href="${esc(p.projectGithubSrc)}" target="_blank" rel="noopener">${p.projectLink ? 'GitHub' : `View Repository ${ARROW}`}</a>`;
  const actions = p.projectLink
    ? `<a class="btn navy" href="${esc(p.projectLink)}" target="_blank" rel="noopener">Live Demo ${ARROW}</a>
       <a class="btn ${white ? 'soft' : 'white'}" href="${esc(p.projectGithubSrc)}" target="_blank" rel="noopener">View Repository ${ARROW}</a>`
    : repo;
  return `
    <article class="card proj ${tone}">
      <div>
        <span class="pill ${white ? 'lav' : 'white'}">${esc(p.projectType)}</span>
        <h3>${esc(p.projectTitle)}</h3>
        <p>${esc(p.projectDescription)}</p>
      </div>
      <div class="foot row">${actions}</div>
    </article>`;
}

function renderProjects() {
  projectsContainer.innerHTML = projects.map(projectCard).join('');
}

renderProjects();

$('stat-projects').textContent = projects.length;
$('stat-certs').textContent = certificates.length;

/*=============== CERTIFICATES ===============*/
$('certificates-container').innerHTML = certificates.map((c) => `
  <div class="cert">
    <div class="cert-data">
      <span class="label">${esc(c.organization)}</span>
      <h4>${esc(c.certificateTitle)}</h4>
      <p>Issued on ${esc(c.dateDay)} ${esc(c.dateMonth)}, ${esc(c.dateYear)}</p>
    </div>
    <a class="btn white" href="${esc(c.certificateLink)}" target="_blank" rel="noopener">View Certificate ${ARROW}</a>
  </div>`).join('');

/*=============== CONTACT (EMAILJS) ===============*/
const contactForm = $('contact-form');
const contactMessage = $('contact-message');
const contactBtn = $('contact-button');
const honeypotInput = $('website');
let sendTimeId = null;

// Same outline style as the rest of the icons (24 viewBox, styled in CSS).
const STATUS_ICONS = {
  loading:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" opacity=".25"/><path d="M21 12a9 9 0 00-9-9"/></svg>',
  ok: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"/></svg>',
  error:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 18L18 6M6 6l12 12"/></svg>',
};

function setStatus(text, state) {
  contactMessage.dataset.state = state;
  contactMessage.innerHTML = `${STATUS_ICONS[state]}<span>${esc(text)}</span>`;
  contactMessage.style.display = 'flex';
}

async function sendEmail() {
  if (sendTimeId) clearTimeout(sendTimeId);

  try {
    contactBtn.disabled = true;
    setStatus('Sending...', 'loading');

    if (honeypotInput.value !== '') {
      setStatus('Sent successfully', 'ok');
      contactForm.reset();
      return;
    }

    await emailjs.sendForm(
      'service_3pl6sg8',
      'template_s26dkmr',
      contactForm,
      '8-3MlNU4tu0G6NJrt',
    );

    setStatus('Sent successfully', 'ok');
    contactForm.reset();
  } catch (err) {
    console.log(
      'Error: ' +
        (err.text || err.message || JSON.stringify(err) || 'Unknown Error'),
    );
    setStatus('Failed to send. Please try again.', 'error');
  } finally {
    contactBtn.disabled = false;
    sendTimeId = setTimeout(() => {
      contactMessage.style.display = 'none';
    }, 3500);
  }
}

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  sendEmail();
});

/*=============== SCROLL REVEAL ===============*/
// Everything rises from the bottom, fast, one piece at a time as it scrolls
// into view. Skipped for users who prefer reduced motion.
if (
  typeof ScrollReveal === 'function' &&
  ScrollReveal.isSupported() &&
  !matchMedia('(prefers-reduced-motion: reduce)').matches
) {
  const sr = ScrollReveal({
    origin: 'bottom',
    distance: '24px',
    duration: 1500,
    easing: 'cubic-bezier(.2, .7, .2, 1)',
    opacity: 0,
    viewFactor: 0.1,
    viewOffset: { bottom: 40 },
    cleanup: true,
    once: true,
    // ScrollReveal leaves an inline transform + 1.5s transition behind, which
    // would beat the CSS hover/press transforms, so clear them once revealed.
    afterReveal: (el) => {
      el.style.removeProperty('transform');
      el.style.removeProperty('transition');
    },
  });

  // Reveals every match of `selector` on its own. Elements that sit in the
  // same row (cards, tiles, certificates) enter one after another, `step` ms
  // apart; with `inOrder`, the whole group is staggered by position instead.
  const STEP = 200;
  function reveal(selector, { base = 0, inOrder = false } = {}) {
    const els = [...document.querySelectorAll(selector)];
    els.forEach((el, i) => {
      const n = inOrder
        ? i
        : els.slice(0, i).filter((p) => p.offsetTop === el.offsetTop).length;
      sr.reveal(el, { delay: base + n * STEP });
    });
  }

  // home: each piece on its own
  reveal('.hero-card > *', { base: 50, inOrder: true });
  reveal('.hero-side > *', { base: 150, inOrder: true });

  // section titles
  reveal('.title');

  // about, services, projects, certificates, contact
  reveal('.split > *');
  reveal('.cards3 > .card');
  reveal('.proj-grid > .card');
  reveal('.certs-head');
  reveal('.cert');
}
