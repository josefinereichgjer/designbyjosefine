/**
 * StackedImageCollage — centered pile of cards, me.webp on top
 */
(function () {
  'use strict';

  const W = Math.min(330, Math.floor(window.innerWidth * 0.82));
  const H = Math.round(W * (435 / 330));

  /* me.webp first → highest z-index → on top of pile */
  const CARDS = [
    { src: './assets/me.webp',                                      alt: 'Me'            },
    { src: './assets/tilforside.webp',                              alt: 'Til forside'   },
    { src: './assets/norvald/norvald.webp',                         alt: 'Norval iPhone' },
    { src: './assets/reinategning.webp',                            alt: 'Reina tegning' },
    { src: './assets/scenebok.webp',                                alt: 'Scene bok'     },
    { src: './assets/srhbrosk.webp',      alt: 'SRH brosjyre'  },
    { src: './assets/plakat_mockup.webp', alt: 'Plakat mockup' },
    { src: './assets/closebook.webp',     alt: 'Bokomslag'     },
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
      const el = document.createElement('a');
      el.href        = './projects.html';
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
        duration: isMobile ? 1.1 + Math.random() * 0.2 : 1.9 + Math.random() * 0.35,
        delay:    0.08 + i * 0.13,
        ease:     isMobile ? 'power3.out' : 'expo.out',
        onComplete: function () { startFloat(el, i); },
      });

      el.addEventListener('mouseenter', function () { onHover(i); });
      el.addEventListener('mouseleave', function () { onLeave(i); });
    });

    /* Fade in UI text after cards begin settling */
    var brand   = document.querySelector('.landing__brand');
    var topleft = document.querySelector('.landing__topleft');
    if (brand) {
      gsap.fromTo(brand,
        { opacity: 0, y: 14 },
        { opacity: 0.9, y: 0, duration: 1.4, delay: 0.7, ease: 'power2.out' }
      );
    }
    if (topleft) {
      gsap.fromTo(topleft,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 1.2, delay: 0.5, ease: 'power2.out' }
      );
    }

    /* Typewriter effect on CTA label */
    var twStyle = document.createElement('style');
    twStyle.textContent = [
      '.tw-cursor{',
        'display:inline-block;width:2px;height:0.85em;',
        'background:currentColor;margin-left:2px;',
        'vertical-align:middle;',
        'animation:tw-blink 0.7s step-end infinite;',
      '}',
      '@keyframes tw-blink{0%,100%{opacity:1}50%{opacity:0}}',
    ].join('');
    document.head.appendChild(twStyle);

    /* Inject bio-big style */
    var bioBigStyle = document.createElement('style');
    bioBigStyle.textContent = [
      '.bio-big{font-size:1.5em;line-height:1;letter-spacing:0.01em;font-weight:400;',
        'display:inline-block;position:relative;',
        'transition:font-size 0.5s ease,letter-spacing 0.4s ease;}',
      '.bio-sparkle{position:absolute;width:7px;height:7px;pointer-events:none;opacity:0;}',
      '.bio-sparkle::before{content:"";display:block;width:100%;height:100%;background:#fff;',
        'clip-path:polygon(50% 0%,56% 44%,100% 50%,56% 56%,50% 100%,44% 56%,0% 50%,44% 44%);}',
      '@keyframes sparkle-twinkle{',
        '0%{opacity:0;transform:scale(0) rotate(0deg)}',
        '25%{opacity:1;transform:scale(1.3) rotate(20deg)}',
        '60%{opacity:0.7;transform:scale(0.85) rotate(-10deg)}',
        '80%{opacity:1;transform:scale(1.1) rotate(15deg)}',
        '100%{opacity:0;transform:scale(0.5) rotate(30deg)}}',
    ].join('');
    document.head.appendChild(bioBigStyle);

    /* Segment-aware typewriter — segments: [{text, cls}] */
    function typewriter(el, segments, speed) {
      el.innerHTML = '';
      var cursor = document.createElement('span');
      cursor.className = 'tw-cursor';
      el.appendChild(cursor);

      var si = 0, ci = 0, span = null;

      function tick() {
        if (si >= segments.length) {
          setTimeout(function () {
            if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
          }, 600);
          return;
        }
        var seg = segments[si];
        if (ci === 0) {
          span = document.createElement('span');
          if (seg.cls) span.className = seg.cls;
          /* use a dedicated text node so sparkles aren't wiped */
          span._textNode = document.createTextNode('');
          span.appendChild(span._textNode);
          el.insertBefore(span, cursor);
          /* spawn sparkles when highlighted segment begins */
          if (seg.cls === 'bio-big') {
            var sparklePositions = [
              { top: '-12px', left: '2%' },
              { top: '-14px', left: '40%' },
              { top: '-11px', left: '80%' },
              { bottom: '-12px', left: '12%' },
              { bottom: '-11px', left: '60%' },
              { top: '0%',      left: '103%' },
            ];
            var activeSparkles = [];
            sparklePositions.forEach(function (pos, idx) {
              var s = document.createElement('span');
              s.className = 'bio-sparkle';
              Object.keys(pos).forEach(function (k) { s.style[k] = pos[k]; });
              s.style.animationName = 'sparkle-twinkle';
              s.style.animationDuration = (550 + idx * 90) + 'ms';
              s.style.animationDelay = (idx * 110) + 'ms';
              s.style.animationIterationCount = 'infinite';
              s.style.animationFillMode = 'both';
              span.appendChild(s);
              activeSparkles.push(s);
            });
            span._sparkles = activeSparkles;
          }
        }
        span._textNode.nodeValue += seg.text[ci];
        ci++;
        if (ci >= seg.text.length) {
          if (seg.cls && span) {
            var doneSpan = span;
            setTimeout(function () {
              doneSpan.style.fontSize = '1em';
              doneSpan.style.letterSpacing = 'inherit';
              if (doneSpan._sparkles) {
                doneSpan._sparkles.forEach(function (s) {
                  s.style.animationIterationCount = '1';
                });
              }
            }, 80);
          }
          si++; ci = 0;
        }
        setTimeout(tick, speed);
      }
      tick();
    }

    var BIO_SEGMENTS_FULL = [
      { text: 'Hei! Jeg er Josefine, en ',  cls: null },
      { text: 'grafisk designer',            cls: 'bio-big' },
      { text: ' som drives\u00A0av å løse problemer gjennom visuell kommunikasjon. Mine styrker ligger i typografi, merkevarebygging og UI/UX. Mitt mål er alltid å designe løsninger som ikke bare ser bra ut, men som faktisk fungerer.', cls: null },
    ];
    var BIO_SEGMENTS_SHORT = [
      { text: 'Hei! Jeg er Josefine, en ',  cls: null },
      { text: 'grafisk designer',            cls: 'bio-big' },
      { text: ' som drives\u00A0av å løse problemer gjennom visuell kommunikasjon.', cls: null },
    ];

    var bioFull  = document.querySelector('.landing__bio--full');
    var bioShort = document.querySelector('.landing__bio--short');
    var TW_DELAY = 1600;
    var TW_SPEED = 32;

    setTimeout(function () {
      if (bioFull)  typewriter(bioFull,  BIO_SEGMENTS_FULL,  TW_SPEED);
      if (bioShort) typewriter(bioShort, BIO_SEGMENTS_SHORT, TW_SPEED);
    }, TW_DELAY);

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
