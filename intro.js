(function () {
  'use strict';

  /* Final rotation for each letter J-O-S-E-F-I-N-E */
  var ROTATIONS = [-6, 7, -12, 5, 4, -5, 13, -3];

  function run() {
    var overlay = document.getElementById('intro');
    var els     = overlay ? Array.from(overlay.querySelectorAll('.intro-letter')) : [];
    if (!els.length || typeof gsap === 'undefined') return;

    var W = window.innerWidth;
    var H = window.innerHeight;

    /* Entry vectors — each letter arrives from a different edge */
    var FROM = [
      { x: -0.85*W, y: -0.55*H },   // J  top-left
      { x: -0.20*W, y: -0.95*H },   // O  top
      { x:  0.60*W, y: -0.70*H },   // S  top-right
      { x:  0.95*W, y: -0.40*H },   // E  right
      { x: -0.90*W, y:  0.65*H },   // F  bottom-left
      { x:  0.05*W, y:  1.05*H },   // I  bottom
      { x:  0.65*W, y:  0.80*H },   // N  bottom-right
      { x:  0.90*W, y:  0.45*H },   // E  right
    ];

    var tl = gsap.timeline();

    /* Phase 1 — letters fly in from off-screen, one after the other */
    els.forEach(function (el, i) {
      tl.fromTo(el,
        {
          x:        FROM[i].x,
          y:        FROM[i].y,
          scale:    0.04,
          opacity:  0,
          rotation: ROTATIONS[i] + (i % 2 === 0 ? 30 : -30),
        },
        {
          x:        0,
          y:        0,
          scale:    1,
          opacity:  1,
          rotation: ROTATIONS[i],
          duration: 0.40,
          ease:     'expo.out',
        },
        i * 0.04   /* stagger start time */
      );
    });

    /* Phase 2 — hold, fire reveal event, then curtain wipes up */
    tl.call(function () {
      document.dispatchEvent(new CustomEvent('intro:reveal'));
    }, null, '+=0.16');

    tl.to(overlay, {
      yPercent:   -100,
      duration:    0.62,
      ease:        'power3.inOut',
      onComplete:  function () { overlay.style.display = 'none'; },
    }, '<0.02');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
