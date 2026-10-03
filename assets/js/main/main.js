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

function setStatus(text) {
  contactMessage.textContent = text;
  contactMessage.style.display = 'block';
}

async function sendEmail() {
  if (sendTimeId) clearTimeout(sendTimeId);

  try {
    contactBtn.disabled = true;
    setStatus('Sending...');

    if (honeypotInput.value !== '') {
      setStatus('Sent successfully');
      contactForm.reset();
      return;
    }

    await emailjs.sendForm(
      'service_3pl6sg8',
      'template_s26dkmr',
      contactForm,
      '8-3MlNU4tu0G6NJrt',
    );

    setStatus('Sent successfully');
    contactForm.reset();
  } catch (err) {
    console.log(
      'Error: ' +
        (err.text || err.message || JSON.stringify(err) || 'Unknown Error'),
    );
    setStatus('Failed to send. Please try again.');
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
