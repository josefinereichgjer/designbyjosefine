(() => {
  // Hero background — no animation
  const heroBg = document.querySelector(".hero-bg");
  if (heroBg) heroBg.classList.add("loaded");

  // Year in footer
  const y = document.querySelector("#year");
  if (y) y.textContent = String(new Date().getFullYear());

  // Mobile nav
  const btn = document.querySelector(".nav-toggle");
  const nav = document.querySelector("#primary-nav");

  const setOpen = (open) => {
    if (!nav || !btn) return;
    nav.classList.toggle("is-open", open);
    btn.setAttribute("aria-expanded", String(open));
  };

  if (btn && nav) {
    btn.addEventListener("click", () => {
      setOpen(!nav.classList.contains("is-open"));
    });

    nav.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      setOpen(false);
    });

    document.addEventListener("click", (e) => {
      if (!nav.classList.contains("is-open")) return;
      if (nav.contains(e.target) || btn.contains(e.target)) return;
      setOpen(false);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setOpen(false);
    });
  }

  // Back to top
  document.querySelectorAll('a[href="#top"]').forEach(a => {
    a.addEventListener("click", e => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  // No fade-up animations — make all visible immediately
  document.querySelectorAll(".fade-up").forEach(el => el.classList.add("visible"));
})();