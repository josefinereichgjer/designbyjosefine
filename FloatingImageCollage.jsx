/**
 * FloatingImageCollage.jsx
 * React + Framer Motion implementation of a floating image collage hero.
 *
 * Architecture:
 *   • Outer motion.div  ── parallax x-shift via spring motion value (style.x)
 *   • Inner motion.div  ── entry spring → float keyframes → whileHover override
 *
 * Keeping x (parallax) and y/rotate (float) on separate divs means they
 * never fight over the same transform property, so the float loop runs
 * independently of parallax without interruption.
 *
 * Usage:
 *   import FloatingImageCollage from './FloatingImageCollage';
 *   <FloatingImageCollage />
 *
 * Requires:
 *   npm install framer-motion   (v10 or v11)
 */

import { useState, useCallback, useRef } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';

/* ─────────────────────────────────── data ─────────────────────────────────── */

const CARDS = [
  { src: '/assets/mal1reina.webp',     alt: 'Reina emballasje 1', w: 240, h: 170 },
  { src: '/assets/mal2reina.webp',     alt: 'Reina emballasje 2', w: 210, h: 150 },
  { src: '/assets/reinajul.webp',      alt: 'Reina Jul',          w: 225, h: 162 },
  { src: '/assets/reinalys.webp',      alt: 'Reina Lys',          w: 200, h: 145 },
  { src: '/assets/reinastor.webp',     alt: 'Reina stor',         w: 252, h: 178 },
  { src: '/assets/cards_purple.webp',  alt: 'Cards purple',       w: 222, h: 157 },
  { src: '/assets/norvaldiphone.webp', alt: 'Norval iPhone',      w: 178, h: 212 },
  { src: '/assets/mal3reina.webp',     alt: 'Reina emballasje 3', w: 216, h: 154 },
];

/** Cluster target positions – offsets from scene centre (px), rotation (deg), z-layer */
const TARGETS = [
  { x: -248, y:  -82, rot:  -7, z: 2 },
  { x:   42, y: -138, rot:   4, z: 4 },
  { x:  238, y:  -48, rot:  -3, z: 3 },
  { x: -128, y:   88, rot:   9, z: 5 },
  { x:  158, y:   98, rot:  -6, z: 3 },
  { x: -285, y:   38, rot:   3, z: 1 },
  { x:  318, y:  -88, rot:   6, z: 2 },
  { x:   18, y:   58, rot:  -9, z: 6 },
];

/**
 * Deterministic float params (no Math.random → SSR-safe, no hydration mismatch).
 * Each card gets a unique phase, amplitude, and speed.
 */
const FLOAT = CARDS.map((_, i) => ({
  yAmp:  9  + (i * 1.7)  % 13,
  rAmp:  1.6 + (i * 0.5) % 2.4,
  dur:   2.6 + (i * 0.3) % 2.2,
  dirY:  i % 2 === 0 ?  1 : -1,
  dirR:  i % 3 === 0 ?  1 : -1,
  depth: 0.28 + (i % 3) * 0.36,   // parallax depth layer
}));

/** Initial scatter positions around a circle (deterministic) */
const SCATTER = CARDS.map((_, i) => {
  const angle = (Math.PI * 2 / CARDS.length) * i;
  const dist  = 560 + (i * 37) % 280;
  return {
    x:   Math.cos(angle) * dist,
    y:   Math.sin(angle) * dist,
    rot: (i - 3.5) * 9,
  };
});

/* ─────────────────────────────── main component ───────────────────────────── */

export default function FloatingImageCollage() {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const containerRef = useRef(null);

  /** Raw normalised mouse x: –1 (left) … 0 (centre) … +1 (right) */
  const rawMouseX = useMotionValue(0);

  /**
   * Spring-smoothed mouse x gives the parallax its organic, laggy feel.
   * Low stiffness + moderate damping = slow drift that never feels mechanical.
   */
  const mouseX = useSpring(rawMouseX, { stiffness: 55, damping: 22, mass: 0.8 });

  const handleMouseMove = useCallback((e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    rawMouseX.set((e.clientX - rect.left - rect.width / 2) / (rect.width / 2));
  }, [rawMouseX]);

  const handleMouseLeave = useCallback(() => {
    rawMouseX.set(0);
    setHoveredIdx(null);
  }, [rawMouseX]);

  return (
    <section
      ref={containerRef}
      className="fic-hero"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-label="Work preview collage"
    >
      <div className="fic-scene">
        {CARDS.map((card, i) => {
          const t   = TARGETS[i];
          const f   = FLOAT[i];
          const s   = SCATTER[i];
          const isHov = hoveredIdx === i;
          const anyHov = hoveredIdx !== null;

          /* Push-away X vector for non-hovered cards */
          let pushX = 0;
          if (anyHov && !isHov) {
            const dx = t.x - TARGETS[hoveredIdx].x;
            const dy = t.y - TARGETS[hoveredIdx].y;
            const d  = Math.sqrt(dx * dx + dy * dy) || 1;
            pushX = (dx / d) * 28;
          }

          return (
            <CollageCard
              key={i}
              card={card}
              scatter={s}
              target={t}
              float={f}
              index={i}
              isHovered={isHov}
              anyHovered={anyHov}
              pushX={pushX}
              mouseX={mouseX}
              onHover={() => setHoveredIdx(i)}
              onLeave={() => setHoveredIdx(null)}
            />
          );
        })}
      </div>
    </section>
  );
}

/* ─────────────────────────────── card component ───────────────────────────── */

function CollageCard({
  card, scatter, target, float: f, index,
  isHovered, anyHovered, pushX, mouseX, onHover, onLeave,
}) {
  /**
   * Parallax: useTransform maps the spring-smoothed mouse position to a pixel
   * offset. Each card's depth layer produces a slightly different shift,
   * creating the multi-plane parallax illusion.
   *
   * This lives in `style.x` on the OUTER div, completely independent of the
   * entry/float `animate` on the INNER div.
   */
  const parallaxX = useTransform(mouseX, [-1, 1], [-f.depth * 24, f.depth * 24]);

  /** Phase gate: prevents whileHover activating during the entry spring */
  const [phase, setPhase] = useState('enter');

  /* ── Entry animation (runs once) ── */
  const entryAnimate = {
    x:       pushX,          // relative to wrapper which is at target.x via CSS
    y:       0,
    rotate:  target.rot,
    scale:   1,
    opacity: 1,
  };
  const entryTransition = {
    type:      'spring',
    stiffness: 110,
    damping:   16,
    mass:      1,
    delay:     0.12 + index * 0.09,
    opacity:   { duration: 0.45, delay: 0.12 + index * 0.09, ease: 'easeOut' },
    rotate:    { type: 'spring', stiffness: 100, damping: 14, delay: 0.12 + index * 0.09 },
  };

  /* ── Continuous float (starts after entry completes) ── */
  const floatAnimate = {
    x:       pushX,
    y:       [0, f.yAmp * f.dirY, 0, -f.yAmp * f.dirY * 0.4, 0],
    rotate:  [target.rot, target.rot + f.rAmp * f.dirR, target.rot - f.rAmp * f.dirR * 0.5, target.rot],
    scale:   1,
    opacity: anyHovered && !isHovered ? 0.76 : 1,
  };
  const floatTransition = {
    x:       { type: 'spring', stiffness: 80, damping: 18 },
    y:       { duration: f.dur,       repeat: Infinity, ease: 'easeInOut' },
    rotate:  { duration: f.dur * 1.2, repeat: Infinity, ease: 'easeInOut' },
    scale:   { type: 'spring', stiffness: 200, damping: 25 },
    opacity: { duration: 0.3 },
  };

  /* ── Hover override (whileHover has priority over animate) ── */
  const hoverAnimate = {
    scale:  1.08,
    y:      -22,
    rotate: target.rot * 0.38,
  };
  const hoverTransition = {
    type:      'spring',
    stiffness: 300,
    damping:   24,
  };

  return (
    /**
     * OUTER div: absolute-positioned at cluster location via CSS.
     * style.x = parallaxX motion value.  Never touches animate.
     */
    <motion.div
      style={{
        position: 'absolute',
        width:    card.w,
        height:   card.h,
        // Centre the card, then shift to its cluster slot
        left:     `calc(50% - ${card.w / 2}px + ${target.x}px)`,
        top:      `calc(50% - ${card.h / 2}px + ${target.y}px)`,
        x:        parallaxX,
        zIndex:   isHovered ? 20 : target.z,
        pointerEvents: 'none',      // outer is transparent to pointer
      }}
    >
      {/**
       * INNER div: handles all non-parallax motion.
       * Initial x/y = scatter offset FROM the outer div's cluster location.
       * Animate x/y = 0 (cluster) with spring entry, then float loop.
       */}
      <motion.div
        className="fic-card"
        style={{
          width:         '100%',
          height:        '100%',
          pointerEvents: 'all',
          cursor:        'pointer',
        }}
        initial={{
          x:       scatter.x - target.x,  // scatter offset relative to cluster slot
          y:       scatter.y - target.y,
          rotate:  scatter.rot,
          scale:   0.38,
          opacity: 0,
        }}
        animate={phase === 'enter' ? entryAnimate : floatAnimate}
        transition={phase === 'enter' ? entryTransition : floatTransition}
        whileHover={phase !== 'enter' ? hoverAnimate : undefined}
        // @ts-ignore – framer-motion type quirk for whileHover transition
        whileTap={{ scale: 0.97 }}
        onHoverStart={onHover}
        onHoverEnd={onLeave}
        onAnimationComplete={() => {
          if (phase === 'enter') setPhase('float');
        }}
        // Pass through the hover spring config
        variants={{
          hovered: hoverAnimate,
        }}
        custom={hoverTransition}
      >
        <img
          src={card.src}
          alt={card.alt}
          draggable={false}
          style={{
            width:      '100%',
            height:     '100%',
            objectFit:  'cover',
            display:    'block',
            userSelect: 'none',
          }}
        />
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────── companion CSS (inline) ───────────────────────── */
/**
 * Paste this into your global stylesheet, or import a .css / .module.css file.
 *
 * .fic-hero {
 *   position: relative;
 *   height: 80vh;
 *   min-height: 520px;
 *   overflow: hidden;
 *   display: flex;
 *   align-items: center;
 *   justify-content: center;
 *   border-radius: 20px;
 *   background: linear-gradient(145deg, #f9f9f7, #f2f1ee);
 * }
 *
 * .fic-hero::before,
 * .fic-hero::after {
 *   content: '';
 *   position: absolute;
 *   top: 0; bottom: 0;
 *   width: 100px;
 *   z-index: 5;
 *   pointer-events: none;
 * }
 * .fic-hero::before { left: 0;  background: linear-gradient(to right, #f9f9f7, transparent); }
 * .fic-hero::after  { right: 0; background: linear-gradient(to left,  #f2f1ee, transparent); }
 *
 * .fic-scene {
 *   position: absolute;
 *   inset: 0;
 * }
 *
 * .fic-card {
 *   border-radius: 14px;
 *   overflow: hidden;
 *   box-shadow:
 *     0 2px  6px  rgba(0,0,0,.07),
 *     0 8px  24px rgba(0,0,0,.10),
 *     0 20px 50px rgba(0,0,0,.08);
 *   transition: box-shadow .3s ease;
 *   will-change: transform, opacity;
 * }
 * .fic-card:hover {
 *   box-shadow:
 *     0 4px  10px rgba(0,0,0,.10),
 *     0 16px 40px rgba(0,0,0,.16),
 *     0 32px 72px rgba(0,0,0,.12);
 * }
 */
