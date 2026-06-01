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

/*=============== EMAIL JS ===============*/

/*=============== SHOW SCROLL UP ===============*/

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
