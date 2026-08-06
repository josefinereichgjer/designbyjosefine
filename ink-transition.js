/*
  Ink page-transition.
  This is a static multi-page site (no client-side router), so "the next page
  is already loaded underneath" is achieved with the classic cover -> navigate
  -> reveal trick: the ink fully covers the viewport, a real browser navigation
  happens while hidden behind it, then the ink dissolves on the new page.

  Drop `<script src="./ink-transition.js"></script>` immediately after
  `<meta charset>` in <head> (before any other markup) on every page that
  should take part. Running this early — and falling back to
  document.documentElement before <body> exists — lets the "already covered"
  state paint before the destination page's own content, so there's no flash.
*/
(function () {
  'use strict';

  var STORAGE_KEY = 'inkTransitionPending';
  var STALE_MS = 4000; // ignore a leftover flag from a navigation that didn't land here (e.g. into a page without this script)
  var GSAP_SRC = 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js';
  var SKIP_EXT = /\.(pdf|zip|png|jpe?g|webp|gif|svg|mp4|mov|mp3|csv|docx?|xlsx?)$/i;

  var INK_INNER = '#1d3564';
  var INK_OUTER = '#0a0f28';

  var COVER_DURATION = 0.46;
  var COVER_HOLD = 0.05;
  var REVEAL_DURATION = 0.36;

  var reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  var pending = null;
  try {
    var raw = sessionStorage.getItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
    if (raw) {
      var parsed = JSON.parse(raw);
      if (parsed && typeof parsed.ts === 'number' && Date.now() - parsed.ts < STALE_MS) {
        pending = parsed;
      }
    }
  } catch (e) {}

  if (reduceMotion) return; // plain, instant navigation — no overlay, no interception

  var NS = 'http://www.w3.org/2000/svg';
  var uid = 'ink' + Math.random().toString(36).slice(2, 8);
  var overlay, circle, feDisp;

  function viewportDiagonal() {
    return Math.ceil(Math.sqrt(window.innerWidth * window.innerWidth + window.innerHeight * window.innerHeight)) + 40;
  }

  function buildOverlay() {
    overlay = document.createElement('div');
    overlay.id = 'ink-transition-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.style.cssText =
      'position:fixed;inset:0;width:100vw;height:100vh;z-index:2147483000;pointer-events:none;opacity:1;';

    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.style.cssText = 'position:absolute;inset:0;display:block;';

    var defs = document.createElementNS(NS, 'defs');

    var grad = document.createElementNS(NS, 'radialGradient');
    grad.setAttribute('id', uid + '-grad');
    var stop1 = document.createElementNS(NS, 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', INK_INNER);
    var stop2 = document.createElementNS(NS, 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', INK_OUTER);
    grad.appendChild(stop1);
    grad.appendChild(stop2);

    var filterEl = document.createElementNS(NS, 'filter');
    filterEl.setAttribute('id', uid + '-filter');
    filterEl.setAttribute('x', '-40%');
    filterEl.setAttribute('y', '-40%');
    filterEl.setAttribute('width', '180%');
    filterEl.setAttribute('height', '180%');
    filterEl.setAttribute('color-interpolation-filters', 'sRGB');

    var feTurb = document.createElementNS(NS, 'feTurbulence');
    feTurb.setAttribute('type', 'fractalNoise');
    feTurb.setAttribute('baseFrequency', '0.010 0.017');
    feTurb.setAttribute('numOctaves', '2');
    feTurb.setAttribute('seed', '7');
    feTurb.setAttribute('result', 'noise');

    feDisp = document.createElementNS(NS, 'feDisplacementMap');
    feDisp.setAttribute('in', 'SourceGraphic');
    feDisp.setAttribute('in2', 'noise');
    feDisp.setAttribute('scale', '16');
    feDisp.setAttribute('xChannelSelector', 'R');
    feDisp.setAttribute('yChannelSelector', 'G');

    filterEl.appendChild(feTurb);
    filterEl.appendChild(feDisp);
    defs.appendChild(grad);
    defs.appendChild(filterEl);

    circle = document.createElementNS(NS, 'circle');
    circle.setAttribute('cx', '50%');
    circle.setAttribute('cy', '50%');
    circle.setAttribute('r', '0');
    circle.setAttribute('fill', 'url(#' + uid + '-grad)');
    circle.setAttribute('filter', 'url(#' + uid + '-filter)');

    svg.appendChild(defs);
    svg.appendChild(circle);
    overlay.appendChild(svg);
    (document.body || document.documentElement).appendChild(overlay);
  }

  // Arriving via a transition: paint the "fully covered" state instantly, before
  // this page's own content has a chance to flash into view.
  if (pending) {
    buildOverlay();
    var ox = typeof pending.x === 'number' ? pending.x : 50;
    var oy = typeof pending.y === 'number' ? pending.y : 50;
    circle.setAttribute('cx', ox + '%');
    circle.setAttribute('cy', oy + '%');
    circle.setAttribute('r', String(viewportDiagonal()));
    feDisp.setAttribute('scale', '64');
  }

  // Reset if this exact DOM gets restored from bfcache (back/forward) instead
  // of re-executing — otherwise a "fully covered" frozen frame could get stuck.
  window.addEventListener('pageshow', function (e) {
    if (e.persisted && overlay) {
      overlay.style.opacity = '0';
      circle.setAttribute('r', '0');
    }
  });

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  function loadGsap(cb) {
    if (window.gsap) { cb(); return; }
    var s = document.createElement('script');
    s.src = GSAP_SRC;
    s.onload = cb;
    s.onerror = cb;
    document.head.appendChild(s);
  }

  ready(function () {
    if (!overlay) buildOverlay();

    loadGsap(function () {
      if (!window.gsap) {
        // No animation engine available — fail open by just clearing any stuck cover.
        if (pending && overlay) {
          overlay.style.transition = 'opacity .3s ease';
          overlay.style.opacity = '0';
          setTimeout(function () { overlay && overlay.remove(); }, 320);
        }
        return;
      }

      if (pending) {
        gsap.to(circle, { attr: { r: 0 }, duration: REVEAL_DURATION, ease: 'power2.inOut' });
        gsap.to(feDisp, { attr: { scale: 34 }, duration: REVEAL_DURATION * 0.85, ease: 'power1.out' });
        gsap.to(overlay, {
          opacity: 0,
          duration: REVEAL_DURATION * 0.55,
          delay: REVEAL_DURATION * 0.5,
          ease: 'power1.in',
          onComplete: function () { overlay && overlay.remove(); }
        });
      }

      attachLinkHandler();
    });
  });

  function attachLinkHandler() {
    document.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target.closest && e.target.closest('a[href]');
      if (!a) return;
      if (a.target && a.target !== '_self') return;
      if (a.hasAttribute('download') || a.hasAttribute('data-no-transition')) return;

      var href = a.getAttribute('href');
      if (!href || href.charAt(0) === '#') return;
      if (/^(mailto:|tel:|javascript:)/i.test(href)) return;

      var url;
      try { url = new URL(href, window.location.href); } catch (err) { return; }
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.hash) return; // same-page anchor
      if (SKIP_EXT.test(url.pathname)) return; // let files/downloads open normally

      e.preventDefault();
      var xPct = (e.clientX / window.innerWidth) * 100;
      var yPct = (e.clientY / window.innerHeight) * 100;
      if (!isFinite(xPct) || !isFinite(yPct)) { xPct = 50; yPct = 50; }

      playCoverThenNavigate(xPct, yPct, url.href);
    }, true);
  }

  function playCoverThenNavigate(xPct, yPct, destHref) {
    circle.setAttribute('cx', xPct + '%');
    circle.setAttribute('cy', yPct + '%');
    circle.setAttribute('r', '0');
    feDisp.setAttribute('scale', '12');
    overlay.style.opacity = '1';

    var dx = Math.max(xPct, 100 - xPct) / 100 * window.innerWidth;
    var dy = Math.max(yPct, 100 - yPct) / 100 * window.innerHeight;
    var radius = Math.ceil(Math.sqrt(dx * dx + dy * dy)) + 60;

    var navigated = false;
    function go() {
      if (navigated) return;
      navigated = true;
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ x: xPct, y: yPct, ts: Date.now() }));
      } catch (e) {}
      window.location.href = destHref;
    }

    var tl = gsap.timeline({ onComplete: go });
    tl.to(circle, { attr: { r: radius }, duration: COVER_DURATION, ease: 'power4.out' }, 0);
    tl.to(feDisp, { attr: { scale: 78 }, duration: COVER_DURATION * 0.85, ease: 'power1.out' }, 0);
    tl.to({}, { duration: COVER_HOLD });

    setTimeout(go, 2500); // safety net in case navigation is ever prevented elsewhere
  }
})();
