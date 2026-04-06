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
    { x:  198, y:    2, rot:  -9, z: 7 },
    { x:  348, y:  -22, rot:  13, z: 6 },
    { x:  212, y:  -52, rot:  -5, z: 5 },
    { x:  338, y:   14, rot: -12, z: 4 },
    { x:  172, y:  -16, rot:   8, z: 3 },
    { x:  314, y:  -50, rot: -15, z: 2 },
    { x:  248, y:   22, rot:  10, z: 1 },
  ];

  let cardEls    = [];
  let floatTweens = [];
  let yShift = 0;

  function init() {
    const scene = document.getElementById('collage-scene');
    if (!scene || typeof gsap === 'undefined') return;

    /* On mobile, fewer cards + simpler easing for performance */
    const isMobile = window.innerWidth <= 600;
    const xShift   = isMobile ? 267 : 0;
    yShift         = isMobile ? 0 : 15;
    const cards    = isMobile ? CARDS.slice(0, 5) : CARDS;

    cards.forEach(function (c, i) {
      const isMe = i === 0;
      const cW = isMe ? W : Math.round(W * 0.78);
      const cH = isMe ? H : Math.round(H * 0.78);

      const t  = { x: TARGETS[i].x - xShift, y: TARGETS[i].y + yShift, rot: TARGETS[i].rot, z: TARGETS[i].z };
      const el = document.createElement('a');
      el.href        = './projects.html';
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
        opacity:  1,
        duration: isMe
          ? (isMobile ? 2.0 : 3.2)
          : (isMobile ? 1.1 + Math.random() * 0.2 : 1.9 + Math.random() * 0.35),
        delay:    0.08 + i * 0.13,
        ease:     isMe ? 'expo.out' : (isMobile ? 'power3.out' : 'expo.out'),
        onComplete: function () {
          if (isMe) {
            /* 3D pulse: drift forward then ease back */
            gsap.timeline({ delay: 0.4, onComplete: function () { gsap.set(el, { z: 0 }); startFloat(el, i); } })
              .to(el, { scale: 1.06, z: 36, transformPerspective: 1000, duration: 2.2, ease: 'sine.inOut' })
              .to(el, { scale: 1.0,  z: 0,  transformPerspective: 1000, duration: 2.2, ease: 'sine.inOut' });
          } else {
            startFloat(el, i);
          }
        },
      });

      el.addEventListener('mouseenter', function () { onHover(i); });
      el.addEventListener('mouseleave', function () { onLeave(i); });
    });

    /* Fade in UI text after cards begin settling */
    var brand   = document.querySelector('.landing__brand');
    var topleft = document.querySelector('.landing__topleft');
    if (brand) {
      gsap.set(brand, { opacity: 1 });
    }
    if (topleft) {
      gsap.set(topleft, { opacity: 1 });

      /* ── Char-split "PORTFOLIO" ── */
      var portLink = topleft.querySelector('.landing__portfolio-link');
      if (portLink) {
        var textNode = null;
        for (var ni = 0; ni < portLink.childNodes.length; ni++) {
          if (portLink.childNodes[ni].nodeType === 3 && portLink.childNodes[ni].nodeValue.trim()) {
            textNode = portLink.childNodes[ni]; break;
          }
        }
        if (textNode) {
          var rawText = textNode.nodeValue;
          var frag = document.createDocumentFragment();
          var charEls = [];
          for (var ci = 0; ci < rawText.length; ci++) {
            var clip = document.createElement('span');
            clip.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:bottom;';
            var ch = document.createElement('span');
            ch.textContent = rawText[ci] === ' ' ? '\u00A0' : rawText[ci];
            ch.style.cssText = 'display:inline-block;';
            clip.appendChild(ch);
            frag.appendChild(clip);
            charEls.push(ch);
          }
          portLink.insertBefore(frag, textNode);
          portLink.removeChild(textNode);
          gsap.fromTo(charEls,
            { y: '110%', opacity: 0 },
            { y: '0%', opacity: 1, duration: 1.0, ease: 'expo.out', stagger: 0.05, delay: 0.3 }
          );
        }
      }

    }

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
    var bioResultFull  = splitCharReveal(bioFull,  BIO_SEGMENTS_FULL,  0.9, 0.03, 1.2, '#b48de8', 'rgba(255,255,255,0.75)');
    var bioResultShort = splitCharReveal(bioShort, BIO_SEGMENTS_SHORT, 0.9, 0.03, 1.2, '#b48de8', 'rgba(255,255,255,0.75)');

    /* after full text settles: color breath + float on "grafisk designer" */
    /* bio has ~88 chars × 0.03s stagger + 0.9s delay + 1.2s dur ≈ 4.7s total */
    var bioSettleDelay = 4.8;
    [bioResultFull, bioResultShort].forEach(function (result) {
      if (!result) return;
      if (result.chars.length) {
        gsap.to(result.chars, {
          color: '#c8a4f5',
          duration: 3.5,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: bioSettleDelay,
        });
      }
      if (result.wclips.length) {
        gsap.to(result.wclips, {
          y: -4,
          duration: 6.5,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: bioSettleDelay,
        });
      }
    });


    /* ── Roll-up: CTA label ── */
    var ctaFull  = document.querySelector('.landing__cta-label--full');
    var ctaShort = document.querySelector('.landing__cta-label--short');
    var ctaFullText  = ctaFull  ? ctaFull.textContent  : '';
    var ctaShortText = ctaShort ? ctaShort.textContent : '';
    splitCharReveal(ctaFull,  ctaFullText,  0.9, 0.05, 1.2);
    splitCharReveal(ctaShort, ctaShortText, 0.9, 0.05, 1.2);

    var ctaArrow = document.querySelector('.landing__cta-arrow-track');
    if (ctaArrow) {
      gsap.set(ctaArrow, { opacity: 0, x: -window.innerWidth, color: '#b48de8' });
      gsap.to(ctaArrow, { opacity: 1, x: 0, duration: 1.4, ease: 'expo.out', delay: 1.8 });
    }

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
    const adjY = t.y + yShift;
    const yAmp = 10 + Math.random() * 12;
    const rAmp = 0.8 + Math.random() * 1.2;
    const yDur = 4.5 + Math.random() * 3.0;
    const rDur = 6.0 + Math.random() * 4.0;
    const sY   = idx % 2 === 0 ? 1 : -1;
    const sR   = idx % 3 === 0 ? 1 : -1;

    floatTweens[idx] = {
      y: gsap.fromTo(el,
        { y: adjY },
        { y: adjY + yAmp * sY, ease: 'sine.inOut', yoyo: true, repeat: -1, duration: yDur }),
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
      y:        t.y + yShift,
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
