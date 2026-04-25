const grid = document.getElementById("grid");
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

const sidebarToggle = document.getElementById("sidebarToggle");
sidebarToggle?.addEventListener("click", () => {
  const sidebar = document.getElementById("sidebar");
  const isOpen = sidebar.classList.toggle("sidebar--open");
  sidebarToggle.setAttribute("aria-expanded", String(isOpen));
});

// Close menu when a nav link is tapped
document.querySelectorAll(".nav .nav__link").forEach(link => {
  link.addEventListener("click", () => {
    const sidebar = document.getElementById("sidebar");
    if (sidebar) sidebar.classList.remove("sidebar--open");
    if (sidebarToggle) sidebarToggle.setAttribute("aria-expanded", "false");
  });
});

const projects = (window.PROJECTS || []).filter(p => !p.personal);

function cardHTML(p){
  const tag = p.subtitle || p.tags[0] || "";
  const mediaStyle = (p.coverPosition || p.coverFilter || p.coverScale)
    ? ` style="${p.coverPosition ? `object-position:${p.coverPosition};` : ""}${p.coverFilter ? `filter:${p.coverFilter};` : ""}${p.coverScale ? `transform:scale(${p.coverScale});` : ""}"`
    : "";
  const media = p.comingSoon
    ? `<div class="card__coming-soon">Coming soon</div>`
    : (p.coverVideo
      ? `<video class="card__img" src="${p.coverVideo}" autoplay muted loop playsinline${mediaStyle}></video>`
      : `<img class="card__img" src="${p.cover}" alt="${p.title}" loading="lazy" decoding="async"${mediaStyle}>`);
  return `
    <a class="card" href="./${p.id}.html">
      <div class="card__img-wrap">
        ${media}
        <div class="card__overlay"><span>${p.title}${tag ? ` — ${tag}` : ""}</span></div>
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

grid.querySelectorAll("video.card__img").forEach(v => { v.playbackRate = 0.25; });


// Tool strip
const TOOLS = [
  { label: "Illustrator", src: "./assets/illustrator.webp" },
  { label: "Photoshop",   src: "./assets/photoshop.webp"   },
  { label: "InDesign",    src: "./assets/indesign.webp"    },
  { label: "Glyphs",      src: "./assets/glyphs.webp"      },
  { label: "Acrobat",     src: "./assets/acrobat.webp"     },
  { label: "Figma",       src: "./srh-open-day-3/assets/img/figma.png" },
];

const track = document.getElementById("toolsTrack");
if (track) {
  track.innerHTML = [...TOOLS, ...TOOLS]
    .map(t => `<div class="tool-pill">
      <img class="tool-icon-img" src="${t.src}" alt="${t.label}">
    </div>`).join("");
}

// Typewriter for about pull-quote — triggers when scrolled into view
(function () {
  var el = document.querySelector('.about-pullquote');
  if (!el) return;
  var fullText = el.textContent;
  el.textContent = '';
  var started = false;

  function type() {
    var i = 0;
    function tick() {
      if (i < fullText.length) {
        var span = document.createElement('span');
        span.textContent = fullText[i];
        span.style.color = '#b48de8';
        el.appendChild(span);
        /* transition to white after char is painted */
        setTimeout(function (s) {
          s.style.transition = 'color 1.4s ease';
          s.style.color = 'rgba(255,255,255,0.9)';
        }, 50, span);
        i++;
        setTimeout(tick, 45 + Math.random() * 20);
      }
    }
    tick();
  }

  var observer = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting && !started) {
      started = true;
      setTimeout(type, 200);
      observer.disconnect();
    }
  }, { threshold: 0.3 });

  observer.observe(el);
})();

