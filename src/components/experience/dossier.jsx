"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BadgeCheck, Crown, Flower2, Gem, Music2, RotateCcw, Sparkles } from "lucide-react";
import { Portrait, Sunflower, Reveal, SectionHead, TiltCard } from "@/components/ui/motion-kit";
import { SPRING } from "@/lib/motion";
import { sfx, vibrate } from "@/lib/sfx";

function useISTClock() {
  const [time, setTime] = useState("--:--:--");
  useEffect(() => {
    const format = () =>
      new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(new Date());
    setTime(format());
    const timer = setInterval(() => setTime(format()), 1000);
    return () => clearInterval(timer);
  }, []);
  return time;
}

const REDACTED = [
  ["CLASSIFIED TRAIT", "effortlessly impossible to forget"],
  ["EARLY PREDICTION", "main character, confirmed"],
  ["GOLD STATUS", "only getting warmer from here"],
];

export default function Dossier() {
  const [flipped, setFlipped] = useState(false);
  const clock = useISTClock();

  function flip() {
    setFlipped((value) => !value);
    sfx.click();
    vibrate(8);
  }

  return (
    <section className="dossier" id="dossier">
      <div className="dossier-aura" aria-hidden="true" />
      <div className="wrap">
        <SectionHead
          scene="SC.02"
          eyebrow="THE GOLDEN DOSSIER"
          title="main character"
          accent="energy."
          copy="Filed under: born for bright entrances. Cleared for a whole new chapter. Tap the card — the file has two sides."
        />

        <div className="dossier-grid">
          <Reveal className="flip-wrap">
            <TiltCard className="flip-tilt" max={7} glare={false}>
              <motion.div
                className="flip-inner"
                animate={{ rotateY: flipped ? 180 : 0 }}
                transition={SPRING.soft}
                style={{ transformStyle: "preserve-3d" }}
              >
                <article className="id-card face-front" onClick={flip} aria-label="Dhruv dossier card, tap to flip">
                  <div className="id-holo" aria-hidden="true" />
                  <div className="id-top mono">
                    <span>SUBJECT_001</span>
                    <span className="id-clearance">CLASSIFIED · GOLD</span>
                  </div>
                  <div className="id-crest">
                    <Crown size={18} />
                    <span className="mono">DHRV · AU 79</span>
                  </div>
                  <h3 className="id-name">DHRUV</h3>
                  <p className="id-tagline">Kaushal by name. Golden by nature.</p>
                  <div className="id-meta">
                    <div>
                      <span className="mono">BIRTHDAY</span>
                      <b>16 · 11</b>
                    </div>
                    <div>
                      <span className="mono">SIGNATURE</span>
                      <b className="script">Sunflower</b>
                    </div>
                  </div>
                  <div className="id-stripes" aria-hidden="true" />
                  <span className="id-flip-hint mono"><RotateCcw size={12} /> TAP TO FLIP</span>
                  <motion.span
                    className="stamp stamp-approved"
                    initial={{ opacity: 0, scale: 2.1, rotate: -24 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: -11 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ ...SPRING.bouncy, delay: 0.5 }}
                  >
                    APPROVED
                    <small>16 NOV</small>
                  </motion.span>
                </article>

                <article className="id-card face-back" onClick={flip} aria-label="Dossier back with live time">
                  <div className="id-top mono">
                    <span>FILE_GOLD · BACK</span>
                    <span className="id-clearance">LIVE DATA</span>
                  </div>
                  <div className="back-hours">
                    <span className="mono">RIGHT NOW · ASIA / KOLKATA</span>
                    <strong className="mono">{clock}</strong>
                    <span className="back-sub mono">THE GOLDEN HOUR IS ALWAYS SOMEWHERE</span>
                  </div>
                  <div className="back-facts">
                    <span className="mono"><Flower2 size={12} /> SIGNATURE FLOWER · SUNFLOWER</span>
                    <span className="mono"><Music2 size={12} /> SOUNDTRACK · 02 SIDES</span>
                    <span className="mono"><Gem size={12} /> CLEARANCE · AU 79</span>
                  </div>
                  <p className="back-quote">
                    “Some people walk in and the whole room turns golden.”
                  </p>
                  <span className="id-flip-hint mono"><RotateCcw size={12} /> TAP TO FLIP BACK</span>
                  <motion.span
                    className="stamp stamp-verified"
                    initial={{ opacity: 0, scale: 2.1, rotate: 15 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: 8 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ ...SPRING.bouncy, delay: 0.35 }}
                  >
                    VERIFIED
                    <small>GOLDEN CODED</small>
                  </motion.span>
                </article>
              </motion.div>
            </TiltCard>
          </Reveal>

          <Reveal delay={0.1}>
            <TiltCard className="portrait-panel" max={8}>
              <div className="portrait-panel-glow" aria-hidden="true" />
              <span className="micro mono">SUBJECT PORTRAIT · 001</span>
              <div className="portrait-frame">
                <Portrait />
                <span className="portrait-caption mono">GOLDEN HOUR · 16 NOV</span>
              </div>
              <h3 className="portrait-title">Dhruv<br /><em>Kaushal.</em></h3>
              <p className="portrait-copy">Golden hour in human form. The friend who turns an ordinary day into the part of the story everyone remembers.</p>
              <div className="portrait-chips">
                <span className="mini-chip mono"><BadgeCheck size={11} /> CERTIFIED GOLD</span>
                <span className="mini-chip mono">16 NOV</span>
                <span className="mini-chip mono">SC.02</span>
              </div>
              <Sunflower className="portrait-flower" />
            </TiltCard>
          </Reveal>
        </div>

        <div className="redacted-list">
          {REDACTED.map(([label, text], index) => (
            <Reveal key={label} delay={index * 0.08}>
              <div className="redacted-row">
                <span className="mono redacted-label">{label}</span>
                <span className="redacted-text">
                  {text}
                  <motion.span
                    className="redacted-bar"
                    initial={{ scaleX: 1 }}
                    whileInView={{ scaleX: 0 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 0.7, delay: 0.4 + index * 0.12, ease: [0.76, 0, 0.24, 1] }}
                    style={{ originX: 0 }}
                  />
                </span>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="stat-strip">
          {[
            { value: "GOLD", label: "CHAPTER LOADED", icon: Crown },
            { value: "02", label: "ANTHEMS ON REPEAT", icon: Music2 },
            { value: "01", label: "SIGNATURE FLOWER", icon: Flower2 },
            { value: "∞", label: "GOOD THINGS AHEAD", icon: Sparkles },
          ].map((stat, index) => (
            <Reveal key={stat.label} delay={index * 0.06}>
              <div className="stat-cell">
                <stat.icon size={14} />
                <b>{stat.value}</b>
                <span className="mono">{stat.label}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
