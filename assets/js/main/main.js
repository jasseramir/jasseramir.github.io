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

  let lastX = 0;
  let lastY = 0;
  let lastTouch = false;

  // Picks which cursor layer shows for the element under the pointer.
  // While the Easter egg terminal is typing, the whole skills card shows the
  // wait cursor (Contact Me included); afterwards it goes back to normal.
  function paint(target) {
    const typing =
      document.documentElement.classList.contains('egg-typing') &&
      !!target?.closest?.('#skills');
    const wait = typing || !!target?.closest?.('button:disabled');
    const txt = !wait && !!target?.closest?.('input, textarea');
    cursor.classList.toggle('wait', wait);
    cursor.classList.toggle('txt', txt);
    cursor.classList.toggle(
      'ptr',
      !wait && !txt && !!target?.closest?.(CLICKABLE),
    );
  }

  document.addEventListener(
    'pointermove',
    (e) => {
      lastTouch = e.pointerType === 'touch';
      if (lastTouch) return;
      lastX = e.clientX;
      lastY = e.clientY;
      cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      cursor.classList.add('on');
      paint(e.target);
    },
    { passive: true },
  );
  // typing started or stopped while the mouse was standing still
  document.addEventListener('eggtyping', () => {
    if (lastTouch || !cursor.classList.contains('on')) return;
    paint(document.elementFromPoint(lastX, lastY));
  });
  document.documentElement.addEventListener('mouseleave', () =>
    cursor.classList.remove('on'),
  );
}

/*=============== SKILLS EASTER EGG ===============*/
// Hold every skill chip until it fills. When all nine are full, the card turns
// into a build terminal. The chips and the terminal share one grid cell, so the
// card never changes size, and the progress track and Contact Me button stay.
// The restart button next to "Core Stack" appears once the terminal has
// finished typing and puts the card back exactly as it was.
(() => {
  // ---- EDIT THE WORDS HERE ----------------------------------------------
  // The terminal reserves room for five lines (`min-height: 8.5em` on `.term`
  // in styles.css). Keep it to five, or raise that value to match.
  const COPY = {
    title: 'Build Passed', // replaces "My Skills Are:" once unlocked
    command: 'npm run build', // first line, shown after a "$"
    compiling: (name) => `compiling ${name}...`, // flashes once per chip
    compiled: (count) => `${count}/${count} skills compiled`, // gets the check
    result: '0 errors, 0 warnings', // gets the check too
    secret: 'YOU FOUND THE EASTER EGG!', // "//" is added in front automatically
    closing: "NEXT STEP: BUILD IT TOGETHER", // same
  };
  // ------------------------------------------------------------------------

  const card = $('skills');
  const chips = [...card.querySelectorAll('.chips button')];
  const term = $('skills-term');
  const title = $('skills-title');
  const bar = $('skills-bar');
  const restart = $('skills-restart');
  const HOLD = 650; // ms to fill one chip
  const DRAIN = HOLD / 3; // ms to empty a chip released early
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // same check as the form's success icon
  const CHECK =
    '<svg class="ck" viewBox="0 0 24 24" aria-hidden="true"><path pathLength="1" d="M5 13l4 4L19 7"/></svg>';

  const names = chips.map((c) => c.textContent.trim());
  const originalTitle = title.textContent;
  const progress = chips.map(() => 0);
  const held = chips.map(() => false);
  const done = chips.map(() => false);
  let unlocked = false;
  let running = false;
  let last = 0;
  let run = 0; // bumped on restart so a half-typed terminal stops itself
  let unlockTimer = 0;

  const fills = chips.map((chip, i) => {
    const fill = document.createElement('i');
    fill.className = 'fill';
    const label = document.createElement('span');
    label.textContent = names[i];
    chip.textContent = '';
    chip.append(fill, label);
    return fill;
  });

  function press(i, on) {
    if (unlocked || done[i]) return;
    held[i] = on;
    chips[i].classList.toggle('held', on);
    card.classList.toggle('holding', held.some(Boolean));
    if (on) start();
  }

  function start() {
    if (running) return;
    running = true;
    last = performance.now();
    requestAnimationFrame(tick);
  }

  function tick(now) {
    const dt = now - last;
    last = now;
    let busy = false;
    chips.forEach((chip, i) => {
      if (done[i]) return;
      if (held[i]) {
        progress[i] = Math.min(1, progress[i] + dt / HOLD);
        busy = true;
      } else if (progress[i] > 0) {
        progress[i] = Math.max(0, progress[i] - dt / DRAIN);
        busy = true;
      }
      fills[i].style.height = `${progress[i] * 100}%`;
      chip.classList.toggle('lit', progress[i] > 0.55);
      if (progress[i] >= 1) complete(i);
    });
    paintBar();
    if (busy && !unlocked) requestAnimationFrame(tick);
    else running = false;
  }

  // Strain, then break free. For the first half of the hold the bar creeps
  // forward with effort (slow, building tension, no stalls) and only gets to
  // 50%; then it breaks free and reveals smoothly to the end. The reveal starts
  // at exactly the speed the strain ended with, so nothing pauses in between.
  // Exactly 0 at 0 and exactly 1 at 1, so the bar lands precisely on count/total.
  const STRAIN_SHARE = 0.5; // part of the hold spent straining
  const STRAIN_REACH = 0.5; // how far the bar gets before it breaks free
  function struggle(p) {
    if (p <= 0) return 0;
    if (p >= 1) return 1;
    const Q = STRAIN_SHARE;
    const A = STRAIN_REACH;
    if (p < Q) {
      const u = p / Q;
      return A * u * u;
    }
    const m0 = (2 * A * (1 - Q)) / (Q * (1 - A)); // match the strain's end speed
    const r = (p - Q) / (1 - Q);
    const r2 = r * r;
    const r3 = r2 * r;
    const h = (r3 - 2 * r2 + r) * m0 + (-2 * r3 + 3 * r2);
    return A + (1 - A) * h;
  }

  // The track follows the live fill of every chip (finished chips count as 1),
  // so it grows while holding and lands exactly on count/total.
  function paintBar() {
    const total = progress.reduce((a, b) => a + struggle(b), 0);
    bar.style.width = `${(total / chips.length) * 100}%`;
    card.classList.toggle('holding', held.some(Boolean));
  }

  function complete(i) {
    done[i] = true;
    held[i] = false;
    chips[i].classList.remove('held');
    chips[i].classList.add('done');
    navigator.vibrate?.(15);
    const count = done.filter(Boolean).length;
    paintBar();
    // brief pulse as the bar locks onto its new point
    bar.classList.remove('lock');
    void bar.offsetWidth;
    bar.classList.add('lock');
    if (count === chips.length) {
      unlocked = true;
      unlockTimer = setTimeout(unlock, reduceMotion ? 0 : 500);
    }
  }

  const wait = (ms) => new Promise((r) => setTimeout(r, reduceMotion ? 0 : ms));

  // Adds a terminal line. Every line has a two-character gutter on the left
  // ("$", ">", "//" or an icon) so all the text starts in the same column.
  function line(cls = '', text = '', mark = '') {
    const row = document.createElement('div');
    const gutter = document.createElement('span');
    gutter.className = `g ${cls}`;
    if (mark.startsWith('<svg')) gutter.innerHTML = mark;
    else gutter.textContent = mark;
    const body = document.createElement('span');
    const out = document.createElement('span');
    out.className = cls;
    out.textContent = text;
    term.querySelector('.caret')?.remove();
    const caret = document.createElement('span');
    caret.className = 'caret';
    body.append(out, caret);
    row.append(gutter, body);
    term.appendChild(row);
    return { out, gutter };
  }

  // Types text into a line one character at a time, like an old console.
  async function type(out, text, ms, live) {
    if (reduceMotion) {
      out.textContent = text;
      return;
    }
    for (let n = 1; n <= text.length; n++) {
      if (!live()) return;
      out.textContent = text.slice(0, n);
      await wait(ms);
    }
  }

  // tells the custom cursor (above) to show wait over the card while typing
  function setTyping(on) {
    document.documentElement.classList.toggle('egg-typing', on);
    document.dispatchEvent(new Event('eggtyping'));
  }

  async function unlock() {
    const id = run;
    const live = () => id === run;
    setTyping(true);
    card.classList.add('unlocked');
    title.textContent = COPY.title;
    term.textContent = '';
    const cmd = line('d', '', '$');
    await wait(500);
    await type(cmd.out, COPY.command, 85, live);
    await wait(750);
    if (!live()) return;
    const status = line('w', '', '>');
    for (const name of names) {
      if (!live()) return;
      status.out.textContent = COPY.compiling(name);
      await wait(330);
    }
    if (!live()) return;
    status.out.className = '';
    status.out.textContent = '';
    await type(status.out, COPY.compiled(names.length), 130, live); // slowest line
    if (!live()) return;
    status.gutter.className = 'g';
    status.gutter.innerHTML = CHECK;
    await wait(700);
    if (!live()) return;
    const res = line('', '', CHECK);
    await type(res.out, COPY.result, 70, live);
    await wait(900);
    if (!live()) return;
    const sec = line('d', '', '//');
    await type(sec.out, COPY.secret, 70, live);
    await wait(650);
    if (!live()) return;
    const end = line('w', '', '//');
    await type(end.out, COPY.closing, 70, live);
    if (!live()) return;
    setTyping(false);
    card.classList.add('ready'); // shows the restart button
  }

  // Puts the card back exactly as it was: chips empty, track empty, title and
  // terminal reset, restart button hidden again.
  function reset() {
    run++;
    clearTimeout(unlockTimer);
    setTyping(false);
    unlocked = false;
    card.classList.remove('unlocked', 'ready');
    title.textContent = originalTitle;
    term.textContent = '';
    bar.style.width = '0';
    bar.classList.remove('lock');
    card.classList.remove('holding');
    chips.forEach((chip, i) => {
      progress[i] = 0;
      held[i] = false;
      done[i] = false;
      fills[i].style.height = '0';
      chip.classList.remove('held', 'done', 'lit');
    });
    chips[0].focus({ preventScroll: true });
  }

  restart.addEventListener('click', reset);

  chips.forEach((chip, i) => {
    // no context menu or text selection from a long press on touch screens
    chip.addEventListener('contextmenu', (e) => e.preventDefault());
    chip.addEventListener('pointerdown', (e) => {
      if (e.button) return;
      e.preventDefault();
      chip.setPointerCapture?.(e.pointerId);
      press(i, true);
    });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((type) =>
      chip.addEventListener(type, () => press(i, false)),
    );
    chip.addEventListener('keydown', (e) => {
      if (e.key !== ' ' && e.key !== 'Enter') return;
      e.preventDefault();
      press(i, true);
    });
    chip.addEventListener('keyup', (e) => {
      if (e.key === ' ' || e.key === 'Enter') press(i, false);
    });
    chip.addEventListener('blur', () => press(i, false));
  });
})();

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

  // True when the element is already on screen at page load (mirrors the
  // viewFactor / viewOffset used above).
  const visibleAtLoad = (el) => {
    const r = el.getBoundingClientRect();
    return r.top < innerHeight - 40 - r.height * 0.1 && r.bottom > 0;
  };
  
  // Reveals every match of `selector` on its own. Elements that sit in the
  // same row (cards, tiles, certificates) enter one after another, `STEP` ms apart.
  const STEP = 200;
  function reveal(selector, { base = 0, inOrder = false } = {}) {
    const els = [...document.querySelectorAll(selector)];
    let shown = 0;
    els.forEach((el, i) => {
      const sameRow = els.slice(0, i).filter((p) => p.offsetTop === el.offsetTop).length;
      let delay = sameRow * STEP; // default
      
      if (!inOrder) delay = base + sameRow * STEP;
      else if (visibleAtLoad(el)) delay = base + shown++ * STEP;

      sr.reveal(el, { delay });
    });
  }

  // delay for the code card in the main section: on desktop it sits beside
  // the hero card, on narrow screens it waits for the hero card's own pieces
  const heroSideBase = matchMedia('(min-width: 1024px)').matches ? 150 : 800;

  // home: each piece on its own
  reveal('.hero-card > *', { base: 50, inOrder: true });
  reveal('.hero-side > *', { base: heroSideBase, inOrder: true });

  // section titles
  reveal('.title');

  // about, services, projects, certificates, contact
  reveal('.split > *');
  reveal('.cards3 > .card');
  reveal('.proj-grid > .card');
  reveal('.certs-head');
  reveal('.cert');
}
