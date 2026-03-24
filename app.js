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
    <a class="card" href="./${p.id}.html">
      <img class="card__img" src="${p.cover}" alt="${p.title}" loading="lazy" decoding="async"${(p.coverPosition || p.coverFilter) ? ` style="${p.coverPosition ? `object-position:${p.coverPosition};` : ""}${p.coverFilter ? `filter:${p.coverFilter};` : ""}"` : ""}>
      <div class="card__caption">
        <p class="card__title">${p.title}</p>
        <p class="card__tags">${p.tags[0] || ""}</p>
      </div>
    </a>
  `;
}

const isMobile = window.innerWidth <= 860;
const INITIAL   = 4;

if (!projects.length) {
  grid.innerHTML = `<p class="muted">Ingen prosjekter funnet.</p>`;
} else if (isMobile && projects.length > INITIAL) {
  grid.innerHTML = projects.slice(0, INITIAL).map(cardHTML).join("");

  const moreBtn = document.createElement("button");
  moreBtn.className   = "show-more-btn";
  moreBtn.textContent = "Mer";
  let expanded = false;
  moreBtn.addEventListener("click", function () {
    expanded = !expanded;
    grid.innerHTML = expanded
      ? projects.map(cardHTML).join("")
      : projects.slice(0, INITIAL).map(cardHTML).join("");
    moreBtn.textContent = expanded ? "−" : "Mer";
    if (!expanded) {
      const lastCard = grid.querySelectorAll(".card")[INITIAL - 1];
      if (lastCard) lastCard.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  });
  grid.insertAdjacentElement("afterend", moreBtn);
} else {
  grid.innerHTML = projects.map(cardHTML).join("");
}

// Tool strip
const TOOLS = [
  { label: "Illustrator", src: "./assets/illustrator.webp" },
  { label: "Photoshop",   src: "./assets/photoshop.webp"   },
  { label: "InDesign",    src: "./assets/indesign.webp"    },
  { label: "Glyphs",      src: "./assets/glyphs.webp"      },
  { label: "Acrobat",     src: "./assets/acrobat.webp"     },
];

const track = document.getElementById("toolsTrack");
if (track) {
  track.innerHTML = [...TOOLS, ...TOOLS]
    .map(t => `<div class="tool-pill">
      <img class="tool-icon-img" src="${t.src}" alt="${t.label}">
      ${t.label}
    </div>`).join("");
}

