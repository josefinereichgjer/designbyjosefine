/**
 * StackedImageCollage — centered pile of cards, me.webp on top
 */
(function () {
  'use strict';

  const W = 330, H = 435;   // uniform card size

  /* me.webp first → highest z-index → on top of pile */
  const CARDS = [
    { src: './assets/me.webp',                                      alt: 'Me'            },
    { src: './assets/tilforside.webp',                              alt: 'Til forside'   },
    { src: './assets/norvald/norvald.jpeg',                         alt: 'Norval iPhone' },
    { src: './assets/reinategning.webp',                            alt: 'Reina tegning' },
    { src: './assets/scenebok.webp',                                alt: 'Scene bok'     },
    { src: './stoppestedet/stoppestedet/images/staff_skjorte.jpg',  alt: 'Staff skjorte' },
    { src: './assets/plakat_mockup.webp',                           alt: 'Plakat mockup' },
    { src: './stoppestedet/stoppestedet/images/outsidestopp.png',   alt: 'Outside Stopp' },
  ];

  /* Small x/y offsets + rotations — tight pile, me.webp top layer */
  const TARGETS = [
    { x:  270, y:  -20, rot:   2, z: 8 },  // me.webp  — top
    { x:  220, y:  -10, rot:  -9, z: 7 },
    { x:  320, y:  -15, rot:  13, z: 6 },
    { x:  235, y:  -30, rot:  -5, z: 5 },
    { x:  310, y:   -5, rot: -12, z: 4 },
    { x:  205, y:  -18, rot:   8, z: 3 },
    { x:  295, y:  -25, rot: -15, z: 2 },
    { x:  250, y:   -8, rot:  10, z: 1 },
  ];

  let cardEls    = [];
  let floatTweens = [];

  function init() {
    const scene = document.getElementById('collage-scene');
    if (!scene || typeof gsap === 'undefined') return;

    /* On mobile, fewer cards + simpler easing for performance */
    const isMobile = window.innerWidth <= 600;
    const xShift   = isMobile ? 267 : 0;
    const cards    = isMobile ? CARDS.slice(0, 5) : CARDS;

    cards.forEach(function (c, i) {
      const t  = { x: TARGETS[i].x - xShift, y: TARGETS[i].y, rot: TARGETS[i].rot, z: TARGETS[i].z };
      const el = document.createElement('div');
      el.className   = 'collage-card';
      el.style.width  = W + 'px';
      el.style.height = H + 'px';
      el.style.left   = 'calc(50% - ' + (W / 2) + 'px)';
      el.style.top    = 'calc(50% - ' + (H / 2) + 'px)';

      const img          = document.createElement('img');
      img.src            = c.src;
      img.alt            = c.alt;
      img.loading        = 'eager';
      img.decoding       = 'async';
      img.draggable      = false;
      el.appendChild(img);
      scene.appendChild(el);
      cardEls.push(el);

      /* Start scattered, spring into pile */
      const angle = (Math.PI * 2 / cards.length) * i + (Math.random() - 0.5) * 0.6;
      const dist  = 520 + Math.random() * 220;
      gsap.set(el, {
        x:        Math.cos(angle) * dist,
        y:        Math.sin(angle) * dist,
        rotation: (Math.random() - 0.5) * 60,
        scale:    0.35 + Math.random() * 0.2,
        opacity:  0,
        zIndex:   t.z,
      });

      gsap.to(el, {
        x:        t.x,
        y:        t.y,
        rotation: t.rot,
        scale:    1,
        opacity:  1,
        duration: isMobile ? 0.9 + Math.random() * 0.2 : 1.45 + Math.random() * 0.25,
        delay:    0.1 + i * 0.08,
        ease:     isMobile ? 'power2.out' : 'elastic.out(1, 0.72)',
        onComplete: function () { startFloat(el, i); },
      });

      el.addEventListener('mouseenter', function () { onHover(i); });
      el.addEventListener('mouseleave', function () { onLeave(i); });
    });
  }

  function startFloat(el, idx) {
    const t    = TARGETS[idx];
    const yAmp = 10 + Math.random() * 12;
    const rAmp = 0.8 + Math.random() * 1.2;
    const yDur = 4.5 + Math.random() * 3.0;
    const rDur = 6.0 + Math.random() * 4.0;
    const sY   = idx % 2 === 0 ? 1 : -1;
    const sR   = idx % 3 === 0 ? 1 : -1;

    floatTweens[idx] = {
      y: gsap.fromTo(el,
        { y: t.y },
        { y: t.y + yAmp * sY, ease: 'sine.inOut', yoyo: true, repeat: -1, duration: yDur }),
      r: gsap.fromTo(el,
        { rotation: t.rot },
        { rotation: t.rot + rAmp * sR, ease: 'sine.inOut', yoyo: true, repeat: -1, duration: rDur }),
    };
  }

  function onHover(idx) {
    if (floatTweens[idx]) {
      floatTweens[idx].y.kill();
      floatTweens[idx].r.kill();
      floatTweens[idx] = null;
    }
    const t = TARGETS[idx];
    gsap.to(cardEls[idx], {
      y:        t.y - 28,
      scale:    1.1,
      rotation: t.rot * 0.3,
      zIndex:   20,
      duration: 0.35,
      ease:     'power3.out',
      overwrite: 'auto',
    });
  }

  function onLeave(idx) {
    const t = TARGETS[idx];
    gsap.to(cardEls[idx], {
      y:        t.y,
      scale:    1,
      rotation: t.rot,
      duration: 0.45,
      ease:     'power2.inOut',
      overwrite: 'auto',
      onComplete: function () {
        gsap.set(cardEls[idx], { zIndex: t.z });
        startFloat(cardEls[idx], idx);
      },
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
