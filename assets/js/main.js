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

/*=============== SCROLL REVEAL ANIMATION ===============*/
