/**
 * FloatingImageCollage — vanilla JS / GSAP implementation
 * Mirrors the "floating cards" pattern from modern AI/design tool landing pages.
 *
 * Behaviour:
 *  - Cards scatter randomly on load, then spring into a loose overlapping cluster
 *  - Each card continuously floats (Y-axis drift + rotation) with organic timing
 *  - Parallax: mouse movement shifts cards on the X-axis by depth layer
 *  - Hover: hovered card lifts & scales; others nudge away on X and dim slightly
 */
(function () {
  'use strict';

  /* ── Image data ─────────────────────────────────────────────────────────── */
  const CARDS = [
    { src: './assets/broskiforan.jpg',    alt: 'Broski foran',   w: 200, h: 260 },
    { src: './assets/plakat_mockup.jpg',  alt: 'Plakat mockup',  w: 230, h: 165 },
    { src: './assets/reinalys.webp',      alt: 'Reina Lys',      w: 210, h: 155 },
    { src: './assets/wenettside.png',     alt: 'We nettside',    w: 260, h: 170 },
    { src: './assets/norvaldiphone.webp', alt: 'Norval iPhone',  w: 178, h: 212 },
  ];

  /*
   * ── Cluster target positions (offset from scene centre, degrees, z-layer) ──
   *
   * 3 cards on the LEFT wing, 2 on the RIGHT — all kept well outside the
   * centre text column (innermost edges ≥ 185 px from centre).
   */
  const TARGETS = [
    { x: -300, y: -140, rot:  -8, z: 3 },  // left  wing, upper
    { x: -210, y:   30, rot:   6, z: 5 },  // left  wing, mid (innermost)
    { x: -295, y:  185, rot:  -4, z: 2 },  // left  wing, lower
    { x:  260, y: -130, rot:  -6, z: 4 },  // right wing, upper
    { x:  215, y:  145, rot:   8, z: 3 },  // right wing, lower (innermost)
  ];

  /* ── Module state ───────────────────────────────────────────────────────── */
  let cardEls    = [];
  let floatTweens = [];

  /* ── Init ───────────────────────────────────────────────────────────────── */
  function init() {
    const scene = document.getElementById('collage-scene');
    if (!scene || typeof gsap === 'undefined') return;

    CARDS.forEach(function (c, i) {
      const t  = TARGETS[i];
      const el = document.createElement('div');
      el.className          = 'collage-card';
      el.style.width        = c.w + 'px';
      el.style.height       = c.h + 'px';
      el.style.left         = 'calc(50% - ' + (c.w / 2) + 'px)';
      el.style.top          = 'calc(50% - ' + (c.h / 2) + 'px)';

      const img     = document.createElement('img');
      img.src       = c.src;
      img.alt       = c.alt;
      img.loading   = 'lazy';
      img.draggable = false;
      el.appendChild(img);
      scene.appendChild(el);
      cardEls.push(el);

      /* Initial scatter — distributed around a circle, slightly randomised */
      const angle = (Math.PI * 2 / CARDS.length) * i + (Math.random() - 0.5) * 0.6;
      const dist  = 560 + Math.random() * 280;
      gsap.set(el, {
        x:        Math.cos(angle) * dist,
        y:        Math.sin(angle) * dist,
        rotation: (Math.random() - 0.5) * 55,
        scale:    0.35 + Math.random() * 0.2,
        opacity:  0,
        zIndex:   t.z,
      });

      /* Spring entry — staggered with elastic ease */
      gsap.to(el, {
        x:        t.x,
        y:        t.y,
        rotation: t.rot,
        scale:    1,
        opacity:  1,
        duration: 1.45 + Math.random() * 0.25,
        delay:    0.12 + i * 0.09,
        ease:     'elastic.out(1, 0.72)',
        onComplete: function () { startFloat(el, i); },
      });

      el.addEventListener('mouseenter', function () { onHover(i); });
      el.addEventListener('mouseleave', function () { onLeave(i); });
    });

    /* Parallax — mouse over the whole scene shifts cards on X by depth layer */
    scene.addEventListener('mousemove', onMouseMove);
    scene.addEventListener('mouseleave', onSceneLeave);
  }

  /* ── Continuous float ───────────────────────────────────────────────────── */
  function startFloat(el, idx) {
    const t    = TARGETS[idx];
    const yAmp = 9  + Math.random() * 13;
    const rAmp = 1.6 + Math.random() * 2.4;
    const dur  = 2.6 + Math.random() * 2.2;
    const sY   = idx % 2 === 0 ?  1 : -1;
    const sR   = idx % 3 === 0 ?  1 : -1;

    /*
     * fromTo keeps the oscillation anchored to the exact cluster position so
     * restarting after a hover never causes a visual jump.
     */
    floatTweens[idx] = gsap.fromTo(
      el,
      { y: t.y,                  rotation: t.rot },
      { y: t.y + yAmp * sY,      rotation: t.rot + rAmp * sR,
        ease: 'sine.inOut', yoyo: true, repeat: -1, duration: dur }
    );
  }

  /* ── Hover ──────────────────────────────────────────────────────────────── */
  function onHover(idx) {
    /* Pause float for hovered card — we're taking full control of its y */
    if (floatTweens[idx]) floatTweens[idx].pause();

    const t = TARGETS[idx];

    gsap.to(cardEls[idx], {
      y:         t.y - 22,
      scale:     1.08,
      rotation:  t.rot * 0.35,
      zIndex:    20,
      duration:  0.35,
      ease:      'power3.out',
      overwrite: true,
    });

    /* Nudge all others slightly away on X-axis (no conflict with float/Y) */
    cardEls.forEach(function (other, j) {
      if (j === idx) return;
      const dx  = TARGETS[j].x - TARGETS[idx].x;
      const dy  = TARGETS[j].y - TARGETS[idx].y;
      const d   = Math.sqrt(dx * dx + dy * dy) || 1;
      const pushX = (dx / d) * 28;

      gsap.to(other, {
        x:         TARGETS[j].x + pushX,
        opacity:   0.78,
        duration:  0.4,
        ease:      'power2.out',
        overwrite: 'auto',
      });
    });
  }

  function onLeave(idx) {
    const t = TARGETS[idx];

    gsap.to(cardEls[idx], {
      y:         t.y,
      scale:     1,
      rotation:  t.rot,
      duration:  0.45,
      ease:      'power2.inOut',
      overwrite: true,
      onComplete: function () {
        gsap.set(cardEls[idx], { zIndex: t.z });
        if (floatTweens[idx]) floatTweens[idx].restart();
      },
    });

    /* Restore others */
    cardEls.forEach(function (other, j) {
      if (j === idx) return;
      gsap.to(other, {
        x:         TARGETS[j].x,
        opacity:   1,
        duration:  0.55,
        ease:      'power2.out',
        overwrite: 'auto',
      });
    });
  }

  /* ── Parallax ───────────────────────────────────────────────────────────── */
  function onMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const dx   = (e.clientX - cx) / (rect.width  / 2); // normalised –1 … 1

    cardEls.forEach(function (el, i) {
      /* Each depth layer moves a different amount — creates parallax illusion */
      const depth = 0.28 + (i % 3) * 0.36;
      gsap.to(el, {
        x:         TARGETS[i].x + dx * depth * 24,
        duration:  1.3,
        ease:      'power2.out',
        overwrite: 'auto',
      });
    });
  }

  function onSceneLeave() {
    cardEls.forEach(function (el, i) {
      gsap.to(el, {
        x:         TARGETS[i].x,
        duration:  1.6,
        ease:      'power2.out',
        overwrite: 'auto',
      });
    });
  }

  /* ── Bootstrap ──────────────────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
