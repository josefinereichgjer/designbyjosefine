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

// Tool strip
const TOOLS = [
  { label: "Illustrator", src: "./assets/illustrator.webp" },
  { label: "Photoshop",   src: "./assets/photoshop.webp"   },
  { label: "InDesign",    src: "./assets/indesign.webp"    },
  { label: "Glyphs",      src: "./assets/glyphs.webp"      },
  { label: "Acrobat",     src: "./assets/acrobat.webp"     },
  { label: "Figma",       src: "./assets/figma.png" },
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

