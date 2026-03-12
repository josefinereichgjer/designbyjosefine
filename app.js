const grid = document.getElementById("grid");
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

const sidebarToggle = document.getElementById("sidebarToggle");
sidebarToggle?.addEventListener("click", () => {
  const sidebar = document.getElementById("sidebar");
  const isOpen = sidebar.classList.toggle("sidebar--open");
  sidebarToggle.setAttribute("aria-expanded", String(isOpen));
});

const projects = window.PROJECTS || [];

function cardHTML(p){
  return `
    <a class="card" href="./project.html?id=${encodeURIComponent(p.id)}">
      <img class="card__img" src="${p.cover}" alt="${p.title}" loading="lazy" decoding="async">
      <div class="card__caption">
        <p class="card__title">${p.title}</p>
        <p class="card__tags">${p.tags[0] || ""}</p>
      </div>
    </a>
  `;
}

grid.innerHTML = projects.map(cardHTML).join("") || `<p class="muted">Ingen prosjekter funnet.</p>`;

// Tool strip
const TOOLS = [
  { label: "Illustrator", src: "./assets/illustrator.png" },
  { label: "Photoshop",   src: "./assets/photoshop.png"   },
  { label: "InDesign",    src: "./assets/indesign.png"    },
  { label: "Glyphs",      src: "./assets/glyphs.png"      },
  { label: "Acrobat",     src: "./assets/acrobat.png"     },
];

const track = document.getElementById("toolsTrack");
if (track) {
  track.innerHTML = [...TOOLS, ...TOOLS]
    .map(t => `<div class="tool-pill">
      <img class="tool-icon-img" src="${t.src}" alt="${t.label}">
      ${t.label}
    </div>`).join("");
}

