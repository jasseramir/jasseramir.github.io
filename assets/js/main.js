/*=============== SHOW MENU ===============*/
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.add('show-menu');
  });
}

if (navClose) {
  navClose.addEventListener('click', () => {
    navMenu.classList.remove('show-menu');
  });
}

/*=============== REMOVE MENU MOBILE ===============*/
const navLinks = document.querySelectorAll('.nav__link');

navLinks.forEach((navLink) =>
  navLink.addEventListener('click', () => {
    navMenu.classList.contains('show-menu') &&
      navMenu.classList.remove('show-menu');
  }),
);

/*=============== SHADOW HEADER ===============*/
const header = document.getElementById('header');

window.addEventListener('scroll', function () {
  header.classList.toggle('shadow-header', this.scrollY >= 50);
});

/*=============== RENDER PROJECTS ===============*/
const projectsContainer = document.getElementById('projects-container');
const projects = [
  {
    projectImgSrc: 'project-1.jpg',
    projectImgAlt: 'Tior Al-Fath website preview on a laptop screen',
    projectLink: 'https://tior-alfath.netlify.app',
    projectType: 'Website',
    projectTitle: 'Poultry Shop',
    projectDescription:
      'A modern and user-friendly front-end website designed for a poultry shop, featuring a clean layout to showcase products, daily prices, and seamless navigation for customers.',
    projectGithubSrc: 'https://github.com/jasseramir/tior-alfath',
  },
  {
    projectImgSrc: 'project-2.jpg',
    projectImgAlt:
      'A notebook wireframe sketch showing the layout design for the Roman Numeral Game project',
    projectLink: 'https://jasseramir.github.io/roman-numeral-teacher/',
    projectType: 'Website',
    projectTitle: 'Roman Numeral Game',
    projectDescription:
      'An engaging and educational puzzle game designed to master Roman numerals, featuring interactive challenges, progress tracking, and a sleek layout for an immersive learning experience.',
    projectGithubSrc: 'https://github.com/jasseramir/roman-numeral-teacher',
  },
];
let projectsHTML = '';

for (const project of projects) {
  projectsHTML += `
    <article class="projects__card">
      <div class="projects__image">
        <img src="assets/img/projects/${project.projectImgSrc}" alt="${project.projectImgAlt}" class="projects__img">

        <a href="${project.projectLink}" class="button projects__button">
          <i class="ri-arrow-right-up-line"></i>
        </a>
      </div>

      <div class="projects__content">
        <h3 class="projects__subtitle">${project.projectType}</h3>
        <h2 class="projects__title">${project.projectTitle}</h2>

        <p class="projects__description">${project.projectDescription}</p>
      </div>

      <div class="projects__buttons">
        <a href="${project.projectGithubSrc}" target="_blank" class="projects__link">
          <i class="ri-github-line"></i> View
        </a>
      </div>
    </article>
    `;
}

projectsContainer.innerHTML = projectsHTML;

/*=============== RENDER CERTIFICATES ===============*/
// The monthes are written in letters

const certificatesContainer = document.getElementById('certificates-container');
const certificates = [
  {
    organization: 'freeCodeCamp',
    certificateTitle: 'Web Design',
    dateDay: '16',
    dateMonth: 'Feb',
    dateYear: '2026',
    certificateLink:
      'https://freecodecamp.org/certification/jasseramir/responsive-web-design-v9',
  },
  {
    organization: 'freeCodeCamp',
    certificateTitle: 'JavaScript',
    dateDay: '5',
    dateMonth: 'Mar',
    dateYear: '2026',
    certificateLink:
      'https://freecodecamp.org/certification/jasseramir/javascript-v9',
  },
];
let certificatesHTML = '';

for (const certificate of certificates) {
  certificatesHTML += `
      <article class="certificates__card">
        <h3 class="certificates__subtitle">${certificate.organization}</h3>
        <h2 class="certificates__title">${certificate.certificateTitle}</h2>

        <p class="certificates__date">
          <i class="ri-award-fill"></i> ${certificate.dateDay} ${certificate.dateMonth}, ${certificate.dateYear}
        </p>

        <a href="${certificate.certificateLink}" class="button certificates__button">
          <i class="ri-arrow-right-up-line"></i> View Certificate
        </a>

        <div class="geometric-box"></div>
      </article>
    `;
}

certificatesContainer.innerHTML = certificatesHTML;

/*=============== EMAIL JS ===============*/
const contactForm = document.getElementById('contact-form');
const contactMessage = document.getElementById('contact-message');
const contactBtn = document.getElementById('contact-button');

let timeId = null;

async function sendEmail() {
  if (timeId) clearTimeout(timeId);

  try {
    contactBtn.disabled = true;
    contactMessage.style.display = 'block';
    contactMessage.textContent = 'Sending... 🔄';

    const email = await emailjs.sendForm(
      'service_3pl6sg8',
      'template_s26dkmr',
      contactForm,
      '8-3MlNU4tu0G6NJrt',
    );

    contactMessage.textContent = 'Sent successfully ✅';
    contactForm.reset();
  } catch (err) {
    console.log(err);
    contactMessage.textContent = 'Failed to send ❌';
  } finally {
    contactBtn.disabled = false;
    timeId = setTimeout(() => {
      contactMessage.style.display = 'none';
    }, 3000);
  }
}

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  sendEmail();
});

/*=============== SHOW SCROLL UP ===============*/
const scrollup = document.getElementById('scroll-up');

window.addEventListener('scroll', function () {
  this.scrollY >= 350
    ? scrollup.classList.add('show-scroll')
    : scrollup.classList.remove('show-scroll');
});

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', function () {
  const scrollDown = this.scrollY;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 56;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    const sectionLink = document.querySelector(
      `.nav__menu a[href*="${sectionId}"]`,
    );

    if (sectionLink) {
      const isActive =
        scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight;
      sectionLink.classList.toggle('active-link', isActive);
    }
  });
});

/*=============== SCROLL REVEAL ANIMATION ===============*/
const sr = ScrollReveal({
  origin: 'top',
  distance: '60px',
  duration: 2500,
  delay: 400,
});

sr.reveal('.home__perfil, .about__image, .contact__mail', { origin: 'right' });
sr.reveal(
  '.home__name, .home__info, .about__container .section__title-1, .about__info, .about__button, .contact__social, .contact__data',
  { origin: 'left' },
);
sr.reveal('.services__card, .projects__card, .certificates__container', { interval: 100 });
