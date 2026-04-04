const grid = document.getElementById("grid");
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

const sidebarToggle = document.getElementById("sidebarToggle");
sidebarToggle?.addEventListener("click", () => {
  const sidebar = document.getElementById("sidebar");
  const isOpen = sidebar.classList.toggle("sidebar--open");
  sidebarToggle.setAttribute("aria-expanded", String(isOpen));
});

const projects = (window.PROJECTS || []).filter(p => !p.personal);

function cardHTML(p){
  const overlayLabel = [p.title, p.subtitle || p.tags[0] || ""].filter(Boolean).join(" — ");
  return `
    <a class="card" href="./${p.id}.html">
      <div class="card__img-wrap">
        <img class="card__img" src="${p.cover}" alt="${p.title}" loading="lazy" decoding="async"${(p.coverPosition || p.coverFilter || p.coverScale) ? ` style="${p.coverPosition ? `object-position:${p.coverPosition};` : ""}${p.coverFilter ? `filter:${p.coverFilter};` : ""}${p.coverScale ? `transform:scale(${p.coverScale});` : ""}"` : ""}>
        <div class="card__overlay"><span>${overlayLabel}</span></div>
      </div>
      <div class="card__caption">
        <p class="card__title">${p.title}</p>
        <p class="card__tags">${p.subtitle || p.tags[0] || ""}</p>
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

// Tap-to-reveal overlay on touch devices (mobile + tablet)
if (window.matchMedia('(hover: none)').matches) {
  document.addEventListener('click', function(e) {
    const card = e.target.closest('#grid .card');
    const activeCards = document.querySelectorAll('#grid .card--touch-active');

    if (!card) {
      activeCards.forEach(c => c.classList.remove('card--touch-active'));
      return;
    }

    if (!card.classList.contains('card--touch-active')) {
      e.preventDefault();
      activeCards.forEach(c => c.classList.remove('card--touch-active'));
      card.classList.add('card--touch-active');
    }
    // Second tap: allow navigation (default)
  });
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

