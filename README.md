# Jasser Amir — Personal Portfolio

A personal portfolio website built from scratch with vanilla HTML, CSS, and JavaScript. Designed to showcase my front-end development projects, skills, and services — with a focus on clean UI, smooth animations, and a fully responsive layout.

**Live site:** [jasseramir.github.io](https://jasseramir.github.io)

**Inspired by:** [Bedimcode](https://github.com/bedimcode)

---

## Features

- **Responsive design** — fluid layout that works seamlessly on mobile, tablet, and desktop
- **Scroll animations** — elements reveal on scroll using ScrollReveal.js
- **Active nav highlighting** — navigation link updates automatically as you scroll through sections
- **Sticky header** — shadow effect appears on scroll for visual depth
- **Working contact form** — sends emails directly via EmailJS, no backend needed
- **Dynamic project cards** — projects rendered from a JavaScript data array for easy updates
- **Scroll-to-top button** — appears after scrolling 350px down the page
- **SEO optimized** — meta tags, Open Graph, Twitter Card, JSON-LD structured data, and canonical URL
- **Favicon set** — 16×16, 32×32, 180×180 Apple touch icon, and `.ico` file

---

## Sections

| Section      | Description                                                     |
| ------------ | --------------------------------------------------------------- |
| **Home**     | Hero section with profile photo, name, and social links         |
| **About**    | Short bio, skills list, and a call-to-action button             |
| **Services** | Three service cards: Web Design, Development, Responsive Design |
| **Projects** | Cards with live demo links and GitHub source for each project   |
| **Contact**  | Email form powered by EmailJS + LinkedIn link                   |

---

## Projects Showcased

### Poultry Shop — Tior Al-Fath

A modern front-end website for a poultry shop, featuring a clean layout to display products, daily prices, and easy navigation.

- Live: [tior-alfath.netlify.app](https://tior-alfath.netlify.app)
- Source: [github.com/jasseramir/tior-alfath](https://github.com/jasseramir/tior-alfath)

### Roman Numeral Game

An educational puzzle game for learning Roman numerals, with interactive challenges, progress tracking, and an immersive UI.

- Live: [jasseramir.github.io/roman-numeral-teacher](https://jasseramir.github.io/roman-numeral-teacher/)
- Source: [github.com/jasseramir/roman-numeral-teacher](https://github.com/jasseramir/roman-numeral-teacher)

---

## Tech Stack

| Technology                                     | Purpose                                            |
| ---------------------------------------------- | -------------------------------------------------- |
| HTML5                                          | Structure and semantic markup                      |
| CSS3                                           | Styling, custom properties, grid & flexbox layout  |
| JavaScript (ES6+)                              | Interactivity, DOM manipulation, project rendering |
| [ScrollReveal.js](https://scrollrevealjs.org/) | Scroll-triggered entrance animations               |
| [EmailJS](https://www.emailjs.com/)            | Client-side email sending (no backend)             |
| [RemixIcons](https://remixicon.com/)           | Icon library via CDN                               |

---

## Project Structure

```
jasseramir.github.io/
├── index.html
├── favicon.ico
├── assets/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── main.js
│   │   └── scrollreveal.min.js
│   └── img/
│       ├── main/
│       │   ├── home-perfil.webp
│       │   └── about-perfil.webp
│       ├── projects/
│       │   ├── project-1.jpg
│       │   └── project-2.jpg
│       ├── design/
│       │   ├── curved-arrow.svg
│       │   └── random-lines.svg
│       └── logos/
│           ├── favicon-16x16.png
│           ├── favicon-32x32.png
│           ├── apple-touch-icon.png
│           └── preview.png
```

---

## Getting Started

No build tools or dependencies to install. Just clone and open.

```bash
git clone https://github.com/jasseramir/jasseramir.github.io.git
cd jasseramir.github.io
```

Then open `index.html` in your browser, or serve it locally:

```bash
# Using VS Code
# Install the "Live Server" extension, then right-click index.html → Open with Live Server

# Using Python
python -m http.server 3000
```

---

## Adding a New Project

Open `assets/js/main.js` and add a new object to the `projects` array:

```js
{
  projectImgSrc: 'project-3.jpg',          // place image in assets/img/projects/
  projectImgAlt: 'Description of image',
  projectLink: 'https://your-live-site.com',
  projectType: 'Website',
  projectTitle: 'Project Name',
  projectDescription: 'Short description of the project.',
  projectGithubSrc: 'https://github.com/jasseramir/your-repo',
}
```

The card will render automatically — no HTML changes needed.

---

## Contact

- **Email:** via the contact form on the live site
- **LinkedIn:** [linkedin.com/in/jasser-amir-37428a3b1](https://www.linkedin.com/in/jasser-amir-37428a3b1)
- **GitHub:** [github.com/jasseramir](https://github.com/jasseramir)

---

## License

This project is not licensed for reuse or redistribution.

---

Made by [Jasser Amir](https://jasseramir.github.io)
