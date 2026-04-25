/**
 * StackedImageCollage — centered pile of cards, me.webp on top
 */
(function () {
  'use strict';

  const maxW = window.innerWidth >= 1440 ? 400 : 340;
  const W = Math.min(maxW, Math.floor(window.innerWidth * 0.82));
  const H = Math.round(W * (435 / 330));

  /* me.webp first → highest z-index → on top of pile */
  const CARDS = [
    { src: './assets/me.webp',                             alt: 'Josefine',             href: './projects.html',             opacity: 1    },
    { src: './assets/reinalys.webp',                       alt: 'Reina Fruktgård',       href: './reina-fruktgard.html',       opacity: 0.62 },
    { src: './assets/lillawenettside.webp',                alt: 'Stiftelsen WE',         href: './we-visuell-profil.html',     opacity: 0.62 },
    { src: './assets/scenebok.webp',                       alt: 'Bokomslag',             href: './bokomslag.html',             opacity: 0.62 },
    { src: './assets/poster-srh.webp',                     alt: 'Flerkanalspublisering', href: './flerkanalspublisering.html', opacity: 0.62 },
    { src: './assets/tjonnipadiphone.webp',                alt: 'Tjønnås og Norvald',    href: './ansatts-portal.html',        opacity: 0.62 },
    { src: './stoppestedet/images/storefrontstoppis.webp', alt: 'Stoppestedet',          href: './stoppestedet.html',          opacity: 0.62 },
    { src: './assets/krit.webp',                           alt: 'Tidsskrift',            href: './tidsskrift.html',            opacity: 0.62 },
  ];

  /* Moderate spread — cards fan out to both sides of me.webp */
  const TARGETS = [
    { x:  120, y:   20, rot:   2, z: 8 },  // me.webp — center
    { x: -100, y:  -40, rot:  -9, z: 7 },  // left, up
    { x:  280, y:  -25, rot:  13, z: 6 },  // right, up
    { x:  -50, y:   85, rot:  -5, z: 5 },  // left, lower
    { x:  250, y:   95, rot: -11, z: 4 },  // right, lower
    { x: -150, y:   30, rot:   8, z: 3 },  // left, middle
    { x:  320, y:    5, rot: -14, z: 2 },  // right, middle
    { x:  160, y:  -80, rot:   6, z: 1 },  // up-right
  ];

  let cardEls    = [];
  let floatTweens = [];
  let yShift = 0;

  function init() {
    const scene = document.getElementById('collage-scene');
    if (!scene || typeof gsap === 'undefined') return;

    /* On mobile, fewer cards + simpler easing for performance */
    const isTiny   = window.innerWidth < 480;
    const isMobile = window.innerWidth < 768;
    const showShort = isMobile;
    /* Push pile right of centre on mobile so left-side text stays clear.
       Pull it up on mobile so it doesn't sit on the brand text at the bottom. */
    const xShift = isMobile ? 200 : 0;
    yShift       = isMobile ? -50 : 15;
    const cards  = isTiny ? CARDS.slice(0, 4) : (isMobile ? CARDS.slice(0, 5) : CARDS);

    cards.forEach(function (c, i) {
      const isMe = i === 0;
      const cW = isMe ? W : Math.round(W * 0.78);
      const cH = isMe ? H : Math.round(H * 0.78);

      const t  = { x: TARGETS[i].x - xShift, y: TARGETS[i].y + yShift, rot: TARGETS[i].rot, z: TARGETS[i].z };
      const el = document.createElement('a');
      el.href        = c.href || './projects.html';
      el.className   = 'collage-card';
      el.style.width  = cW + 'px';
      el.style.height = cH + 'px';
      el.style.left   = 'calc(50% - ' + (cW / 2) + 'px)';
      el.style.top    = 'calc(50% - ' + (cH / 2) + 'px)';

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
        opacity:  c.opacity,
        duration: isMe
          ? (isMobile ? 0.9 : 1.3)
          : (isMobile ? 0.55 + Math.random() * 0.1 : 0.8 + Math.random() * 0.15),
        delay:    0.04 + i * 0.055,
        ease:     isMe ? 'expo.out' : (isMobile ? 'power3.out' : 'expo.out'),
        onComplete: function () { startFloat(el, i); },
      });

      el.addEventListener('mouseenter', function () { onHover(i); });
      el.addEventListener('mouseleave', function () { onLeave(i); });
    });

    /* Set UI text visible immediately */
    var brand   = document.querySelector('.landing__brand');
    var topleft = document.querySelector('.landing__topleft');
    if (brand)   gsap.set(brand,   { opacity: 1 });
    if (topleft) gsap.set(topleft, { opacity: 1 });

    var BIO_SEGMENTS_FULL = [
      { text: 'Hei! Josefine her; en ' },
      { text: 'grafisk designer', keepColor: true },
      { text: ' som løser problemer gjennom visuell kommunikasjon!' },
    ];
    var BIO_SEGMENTS_SHORT = [
      { text: 'Hei! Josefine her; en ' },
      { text: 'grafisk designer', keepColor: true },
      { text: ' som løser problemer gjennom visuell kommunikasjon!' },
    ];

    /* ── Roll-up: letter-by-letter, word-level clip so lines break naturally ── */
    /* textOrSegments: string OR [{text, fontFamily?, fontWeight?, fontSize?, keepColor?}] */
    /* keepColor:true — those chars stay at fromColor; function returns them for external use */
    function splitCharReveal(el, textOrSegments, delay, staggerTime, dur, fromColor, toColor) {
      if (!el || !textOrSegments) return { chars: [], wclips: [] };
      el.innerHTML = '';
      var allCharEls = [];
      var keepCharEls = [];
      var keepWclipEls = [];
      var segments = typeof textOrSegments === 'string'
        ? [{ text: textOrSegments }]
        : textOrSegments;
      segments.forEach(function (seg) {
        var tokens = seg.text.split(/(\s+)/);
        tokens.forEach(function (tok) {
          if (/^\s+$/.test(tok)) {
            el.appendChild(document.createTextNode(' '));
          } else {
            var wclip = document.createElement('span');
            wclip.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:bottom;';
            if (seg.keepColor) keepWclipEls.push(wclip);
            for (var j = 0; j < tok.length; j++) {
              var cspan = document.createElement('span');
              cspan.textContent = tok[j];
              cspan.style.cssText = 'display:inline-block;';
              if (seg.fontFamily) cspan.style.fontFamily = seg.fontFamily;
              if (seg.fontWeight) cspan.style.fontWeight = seg.fontWeight;
              if (seg.fontSize)   cspan.style.fontSize   = seg.fontSize;
              wclip.appendChild(cspan);
              allCharEls.push(cspan);
              if (seg.keepColor) keepCharEls.push(cspan);
            }
            el.appendChild(wclip);
          }
        });
      });
      if (!allCharEls.length) return { chars: keepCharEls, wclips: keepWclipEls };

      if (fromColor) allCharEls.forEach(function (c) { c.style.color = fromColor; });

      gsap.fromTo(allCharEls,
        { y: '110%', opacity: 0 },
        { y: '0%', opacity: 1, duration: dur || 0.55, ease: 'expo.out', stagger: staggerTime || 0.018, delay: delay }
      );

      /* color fade only for chars that don't keepColor */
      var transitionChars = keepCharEls.length
        ? allCharEls.filter(function (c) { return keepCharEls.indexOf(c) === -1; })
        : allCharEls;
      if (fromColor && toColor && transitionChars.length) {
        gsap.to(transitionChars, {
          color: toColor,
          duration: (dur || 0.55) * 1.1,
          ease: 'power1.inOut',
          stagger: staggerTime || 0.018,
          delay: delay + (dur || 0.55) * 0.4,
        });
      }

      return { chars: keepCharEls, wclips: keepWclipEls };
    }

    var bioFull  = document.querySelector('.landing__bio--full');
    var bioShort = document.querySelector('.landing__bio--short');
    var BIO_TEXT = BIO_SEGMENTS_FULL.map(function (s) { return s.text; }).join('');
    if (!showShort && bioFull)  bioFull.textContent  = BIO_TEXT;
    if ( showShort && bioShort) bioShort.textContent = BIO_TEXT;

    /* Arrow shoots off on CTA click, then navigate */
    var cta = document.querySelector('.landing__cta');
    if (cta) {
      cta.addEventListener('click', function (e) {
        e.preventDefault();
        var href = cta.getAttribute('href');
        cta.classList.add('is-leaving');
        setTimeout(function () { window.location.href = href; }, 420);
      });
    }
  }

  function startFloat(el, idx) {
    if (window.innerWidth < 768) return;
    const t    = TARGETS[idx];
    const adjX = t.x;
    const adjY = t.y + yShift;

    /* Three independent cycles → organic Lissajous-style drift */
    const yAmp = 10 + Math.random() * 8;    // 10–18 px vertical
    const xAmp =  4 + Math.random() * 5;    //  4–9 px horizontal
    const rAmp =  1.6 + Math.random() * 2;  // 1.6–3.6° rotation

    /* Long, mismatched periods so peaks never line up */
    const yDur = 6.0 + Math.random() * 4.0;  // 6–10 s
    const xDur = 8.0 + Math.random() * 5.0;  // 8–13 s
    const rDur = 7.5 + Math.random() * 5.5;  // 7.5–13 s

    const sY = idx % 2 === 0 ? 1 : -1;
    const sX = idx % 3 === 0 ? 1 : -1;
    const sR = idx % 3 === 0 ? 1 : -1;

    floatTweens[idx] = {
      y: gsap.fromTo(el,
        { y: adjY },
        { y: adjY + yAmp * sY, ease: 'sine.inOut', yoyo: true, repeat: -1, duration: yDur }),
      x: gsap.fromTo(el,
        { x: adjX },
        { x: adjX + xAmp * sX, ease: 'sine.inOut', yoyo: true, repeat: -1, duration: xDur }),
      r: gsap.fromTo(el,
        { rotation: t.rot },
        { rotation: t.rot + rAmp * sR, ease: 'sine.inOut', yoyo: true, repeat: -1, duration: rDur }),
    };
  }

  function onHover(idx) {
    const ft = floatTweens[idx];
    if (ft) {
      ft.y.kill(); ft.x.kill(); ft.r.kill();
      floatTweens[idx] = null;
    }
    const t = TARGETS[idx];
    gsap.to(cardEls[idx], {
      x:        t.x,
      y:        t.y + yShift - 28,
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
      x:        t.x,
      y:        t.y + yShift,
      scale:    1,
      rotation: t.rot,
      duration: 0.55,
      ease:     'power2.inOut',
      overwrite: 'auto',
      onComplete: function () {
        gsap.set(cardEls[idx], { zIndex: t.z });
        startFloat(cardEls[idx], idx);
      },
    });
  }

  /* Start on intro:reveal event; fallback after 4s if intro is absent */
  var _started = false;
  function _start() {
    if (_started) return;
    _started = true;
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }
  document.addEventListener('intro:reveal', _start, { once: true });
  setTimeout(_start, 4000);
})();
