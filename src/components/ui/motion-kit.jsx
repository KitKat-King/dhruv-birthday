"use client";

import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useAnimationFrame,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { EASE } from "@/lib/motion";
import { drawPaths } from "@/lib/flower-draw";
import { cn } from "@/lib/cn";

/* ── Scrolling reveal ─────────────────────────────────────────── */
export function Reveal({ children, delay = 0, y = 40, className = "", once = true }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: "blur(12px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once, amount: 0.18 }}
      transition={{ duration: 0.9, delay, ease: EASE.out }}
    >
      {children}
    </motion.div>
  );
}

/* ── Per-letter kinetic text ──────────────────────────────────── */
export function KineticLetters({ text, className = "", delay = 0, as = "span" }) {
  const Tag = as;
  return (
    <Tag className={`kinetic ${className}`} aria-label={text}>
      {Array.from(text).map((char, i) => (
        <span className="kinetic-letter" key={`${char}-${i}`} aria-hidden="true">
          <motion.span
            className="kinetic-inner"
            initial={{ y: "110%", rotate: 7, opacity: 0 }}
            whileInView={{ y: "0%", rotate: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: delay + i * 0.045, duration: 0.85, ease: EASE.out }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/* ── Scroll-velocity reactive marquee ─────────────────────────── */
export function VelocityMarquee({ children, className = "", base = 55 }) {
  const x = useMotionValue(0);
  const trackRef = useRef(null);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 60, stiffness: 420 });
  const [boost, setBoost] = useState(0);

  useEffect(() => {
    const unsubscribe = velocity.on("change", (v) => {
      setBoost(Math.min(420, Math.abs(v) * 0.5));
    });
    return unsubscribe;
  }, [velocity]);

  useAnimationFrame((_, delta) => {
    const track = trackRef.current;
    if (!track) return;
    const half = track.scrollWidth / 2 || 1;
    let next = x.get() - ((base + boost) * Math.min(delta, 48)) / 1000;
    if (next <= -half) next += half;
    x.set(next);
  });

  return (
    <div className={cn("marquee", className)}>
      <motion.div ref={trackRef} className="marquee-track" style={{ x }}>
        <span className="marquee-inner">{children}</span>
        <span className="marquee-inner" aria-hidden="true">{children}</span>
      </motion.div>
    </div>
  );
}

/* ── Pointer-tracked 3D tilt + glare ──────────────────────────── */
export function TiltCard({ children, className = "", max = 9, glare = true }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [max, -max]), {
    stiffness: 260,
    damping: 22,
  });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-max, max]), {
    stiffness: 260,
    damping: 22,
  });
  const glareBg = useMotionTemplate`radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,.32), rgba(255,255,255,0) 52%)`;

  function move(event) {
    const box = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - box.left) / box.width;
    const py = (event.clientY - box.top) / box.height;
    mx.set(px - 0.5);
    my.set(py - 0.5);
    gx.set(px * 100);
    gy.set(py * 100);
  }

  function leave() {
    mx.set(0);
    my.set(0);
    gx.set(50);
    gy.set(50);
  }

  return (
    <motion.div
      className={cn("tilt", className)}
      style={{ rotateX, rotateY }}
      onPointerMove={move}
      onPointerLeave={leave}
    >
      {children}
      {glare && <motion.span className="tilt-glare" style={{ background: glareBg }} aria-hidden="true" />}
    </motion.div>
  );
}

/* ── Sunflower mark ────────────────────────────────────────────────── */
export function Sunflower({ className = "", stroke = true, draw = false }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });

  useEffect(() => {
    if (!draw || !inView || !ref.current) return;
    const controls = drawPaths(ref.current, { duration: 1700, delay: 55 });
    return () => {
      try {
        controls?.pause?.();
      } catch {
        /* animation cleanup is best-effort */
      }
    };
  }, [draw, inView]);

  return (
    <svg
      ref={ref}
      className={`sunflower ${className}`}
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
    >
      <g
        stroke={stroke ? "currentColor" : "none"}
        fill={stroke ? "none" : "currentColor"}
        strokeWidth="1.4"
        strokeLinecap="round"
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <path
            key={i}
            d="M60 52C51 43 48.5 29 54 18C56.5 12.5 63.5 12.5 66 18C71.5 29 69 43 60 52"
            transform={`rotate(${i * 30} 60 58)`}
          />
        ))}
        <circle cx="60" cy="58" r="10.5" />
        <path d="M60 69V104" />
        <path d="M60 82C52 74 43 72 34 76" />
        <path d="M60 90C68 82 78 80 86 84" />
      </g>
      <g fill="currentColor" opacity=".72">
        {[
          [60, 54], [55.5, 59], [64.5, 59], [58, 63], [62, 63],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.15" />
        ))}
      </g>
    </svg>
  );
}

/* ── Drop-in image with graceful fallback ─────────────────────── */
export function SmartImage({ src, fallback, alt = "", className = "", ...props }) {
  const [source, setSource] = useState(src);

  useEffect(() => {
    setSource(src);
  }, [src]);

  return (
    <img
      {...props}
      src={source}
      alt={alt}
      className={className}
      onError={() => {
        if (fallback && source !== fallback) setSource(fallback);
      }}
    />
  );
}

/* ── Portrait slot — drop /media/dp.jpg in to replace the placeholder ── */
export function Portrait({ className = "", alt = "Dhruv Kaushal" }) {
  return (
    <div className={`portrait ${className}`}>
      <SmartImage
        src="/media/dp.jpg"
        fallback="/media/dp.svg"
        alt={alt}
        className="portrait-img"
        loading="eager"
        draggable="false"
      />
      <span className="portrait-sheen" aria-hidden="true" />
      <span className="portrait-ring" aria-hidden="true" />
      <span className="portrait-tag mono" aria-hidden="true">16 · 11</span>
    </div>
  );
}

/* ── Section heading ──────────────────────────────────────────── */
export function SectionHead({ scene, eyebrow, title, accent, copy, light = false }) {
  return (
    <div className={`section-head ${light ? "is-light" : ""}`}>
      <Reveal>
        <div className="scene-line">
          <span className="scene-code">{scene}</span>
          <span className="scene-rule" />
          <span className="scene-label">{eyebrow}</span>
        </div>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="section-title">
          {title}
          {accent ? <em>{accent}</em> : null}
        </h2>
      </Reveal>
      {copy ? (
        <Reveal delay={0.15}>
          <p className="section-copy">{copy}</p>
        </Reveal>
      ) : null}
    </div>
  );
}

/* ── Film slate (clapperboard) ────────────────────────────────── */
export function FilmSlate({ scene = "SC.01", label = "TAKE 01" }) {
  return (
    <div className="film-slate" aria-hidden="true">
      <span className="slate-stripes" />
      <span className="slate-code">{scene}</span>
      <span className="slate-meta">{label}</span>
    </div>
  );
}

/* ── Typewriter ───────────────────────────────────────────────── */
export function Typewriter({ text, speed = 26, startDelay = 150, className = "", showCaret = true }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let index = 0;
    let timer;
    const kickoff = setTimeout(() => {
      timer = setInterval(() => {
        index += 1;
        setCount(index);
        if (index >= text.length) clearInterval(timer);
      }, speed);
    }, startDelay);
    return () => {
      clearTimeout(kickoff);
      clearInterval(timer);
    };
  }, [inView, text, speed, startDelay]);

  return (
    <p ref={ref} className={`typewriter ${className}`}>
      <span>{text.slice(0, count)}</span>
      {showCaret && <span className="caret" aria-hidden="true" />}
    </p>
  );
}

/* ── Animated counter ─────────────────────────────────────────── */
export function Counter({ to, className = "", duration = 1.6, suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const value = useMotionValue(0);
  const text = useTransform(value, (v) => Math.round(v).toLocaleString("en-US"));
  useEffect(() => {
    if (!inView) return;
    const controls = animate(value, to, { duration, ease: EASE.out });
    return () => controls.stop();
  }, [inView, to, duration, value]);
  return (
    <span ref={ref} className={className}>
      <motion.span>{text}</motion.span>
      {suffix}
    </span>
  );
}

/* ── Magnetic button ──────────────────────────────────────────── */
export function Magnetic({ children, className = "", strength = 10 }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 18 });
  const sy = useSpring(y, { stiffness: 260, damping: 18 });

  function move(event) {
    const box = event.currentTarget.getBoundingClientRect();
    x.set(((event.clientX - box.left) / box.width - 0.5) * strength);
    y.set(((event.clientY - box.top) / box.height - 0.5) * strength);
  }

  function leave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      className={className}
      style={{ x: sx, y: sy }}
      onPointerMove={move}
      onPointerLeave={leave}
    >
      {children}
    </motion.div>
  );
}

/* ── Reduced-motion helper ───────────────────────────────────── */
export function useReduced() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const listener = (event) => setReduced(event.matches);
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
  }, []);
  return reduced;
}
