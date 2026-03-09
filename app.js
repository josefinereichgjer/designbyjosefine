const grid = document.getElementById("grid");
const chipsWrap = document.getElementById("filterChips");
const searchInput = document.getElementById("searchInput");
const resultsMeta = document.getElementById("resultsMeta");
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

const sidebarToggle = document.getElementById("sidebarToggle");
sidebarToggle?.addEventListener("click", () => {
  const sidebar = document.getElementById("sidebar");
  const isOpen = sidebar.classList.toggle("sidebar--open");
  sidebarToggle.setAttribute("aria-expanded", String(isOpen));
});

const projects = window.PROJECTS || [];

// Build tag list
const allTags = Array.from(
  new Set(projects.flatMap(p => p.tags))
).sort((a,b) => a.localeCompare(b));

let activeTag = "All";
let query = "";

function makeChip(label){
  const btn = document.createElement("button");
  btn.className = "chip";
  btn.type = "button";
  btn.textContent = label;
  btn.setAttribute("aria-pressed", label === activeTag ? "true" : "false");
  btn.addEventListener("click", () => {
    activeTag = label;
    [...chipsWrap.querySelectorAll(".chip")].forEach(c =>
      c.setAttribute("aria-pressed", String(c.textContent === activeTag))
    );
    render();
  });
  return btn;
}

function mountChips(){
  chipsWrap.innerHTML = "";
  chipsWrap.appendChild(makeChip("All"));
  allTags.forEach(t => chipsWrap.appendChild(makeChip(t)));
}

function matches(p){
  const tagOk = activeTag === "All" || p.tags.includes(activeTag);
  const q = query.trim().toLowerCase();
  const qOk =
    !q ||
    p.title.toLowerCase().includes(q) ||
    (p.subtitle || "").toLowerCase().includes(q) ||
    p.tags.join(" ").toLowerCase().includes(q);
  return tagOk && qOk;
}

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

function render(){
  const filtered = projects.filter(matches);

  const meta =
    activeTag === "All" && !query.trim()
      ? "Viser alle"
      : `Viser ${filtered.length} resultat${filtered.length === 1 ? "" : "er"}`;

  resultsMeta.textContent = meta;

  grid.innerHTML = filtered.map(cardHTML).join("") || `
    <p class="muted">Ingen prosjekter funnet.</p>
  `;
}

searchInput?.addEventListener("input", (e) => {
  query = e.target.value || "";
  render();
});

mountChips();
render();

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

