(() => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Hero Ken Burns zoom-out on load
  if (!prefersReducedMotion) {
    const heroBg = document.querySelector(".hero-bg");
    if (heroBg) setTimeout(() => heroBg.classList.add("loaded"), 60);
  } else {
    const heroBg = document.querySelector(".hero-bg");
    if (heroBg) heroBg.classList.add("loaded");
  }

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

  // Fade-up animations
  const fadeEls = Array.from(document.querySelectorAll(".fade-up"));

  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = Number(entry.target.getAttribute("data-delay") || "0");
            window.setTimeout(() => entry.target.classList.add("visible"), delay);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    fadeEls.forEach((el, i) => {
      el.setAttribute("data-delay", String((i % 3) * 120));
      observer.observe(el);
    });
  } else {
    fadeEls.forEach((el) => el.classList.add("visible"));
  }
})();